import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession, STATE_COOKIE, NEXT_COOKIE } from "@/lib/auth";
import {
  isDiscordConfigured,
  buildAuthorizeUrl,
  avatarUrl,
} from "@/lib/discord";
import { env } from "@/lib/env";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/security";

export async function GET(req: NextRequest) {
  // Brute-force / abuse protection on the authentication entry point
  const rl = rateLimit(
    `auth:${getClientIp(req)}`,
    env.RL_AUTH.limit,
    env.RL_AUTH.windowMs
  );
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  // 1. تحديد الـ origin الصحيح من الـ Host Header لقراءة الدومين الفعلي للمستخدم
  const host = req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const origin = host ? `${protocol}://${host}` : req.nextUrl.origin;

  const nextParam = req.nextUrl.searchParams.get("next") || "/";
  const safeNext =
    nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/";

  // Real Discord OAuth when credentials are configured
  if (isDiscordConfigured()) {
    const state = randomBytes(16).toString("hex");
    const res = NextResponse.redirect(buildAuthorizeUrl(origin, state));
    
    // ضبط الخيارات الخاصة بالكوكيز لتناسب البيئة المرفوعة و HTTPS
    const isProduction =
      process.env.NODE_ENV === "production" || origin.startsWith("https");

    const cookieBase = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: isProduction,
      path: "/",
      maxAge: 600,
    };

    res.cookies.set(STATE_COOKIE, state, cookieBase);
    res.cookies.set(NEXT_COOKIE, safeNext, cookieBase);
    return res;
  }

  // Preview mode: sign in a demo Discord-styled identity so the full
  // experience works before DISCORD_CLIENT_ID / SECRET are provided.
  try {
    const demoDiscordId = "984163515000000512";
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.discordId, demoDiscordId))
      .limit(1);

    if (!user) {
      [user] = await db
        .insert(users)
        .values({
          discordId: demoDiscordId,
          username: "bk.market",
          globalName: "عضو BK MARKET",
          avatar: null,
          email: null,
        })
        .returning();
    } else {
      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));
    }

    await createSession({
      id: user.id,
      discordId: user.discordId,
      username: user.username,
      globalName: user.globalName,
      avatar: avatarUrl(user.discordId, user.avatar),
    });

    return NextResponse.redirect(new URL(safeNext, origin));
  } catch (e) {
    console.error("[auth] demo login failed:", e);
    return NextResponse.redirect(new URL("/?error=db", origin));
  }
}