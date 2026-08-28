import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession, STATE_COOKIE, NEXT_COOKIE } from "@/lib/auth";
import { exchangeCode, fetchDiscordUser, avatarUrl, getRedirectUri } from "@/lib/discord";

export async function GET(req: NextRequest) {
  const host = req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const origin = host ? `${protocol}://${host}` : req.nextUrl.origin;

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const savedState = req.cookies.get(STATE_COOKIE)?.value;
  const nextCookie = req.cookies.get(NEXT_COOKIE)?.value;

  const safeNext =
    nextCookie && nextCookie.startsWith("/") && !nextCookie.startsWith("//")
      ? nextCookie
      : "/";

  // Check state mismatch
  if (!code || !state || !savedState || state !== savedState) {
    console.error("[auth] OAuth state mismatch or missing params", { code: !!code, state, savedState });
    return NextResponse.redirect(new URL("/?error=discord", origin));
  }

  try {
    // 💡 تم إصلاح ترتيب القيم وتحضير رابط الـ redirect الصحيح
    const redirectUri = getRedirectUri(origin);
    const tokens = await exchangeCode(code, redirectUri);
    
    if (!tokens || !tokens.access_token) {
      console.error("[auth] Failed to exchange code for token");
      return NextResponse.redirect(new URL("/?error=discord", origin));
    }

    const discordUser = await fetchDiscordUser(tokens.access_token);
    if (!discordUser || !discordUser.id) {
      console.error("[auth] Failed to fetch Discord user");
      return NextResponse.redirect(new URL("/?error=discord", origin));
    }

    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.discordId, discordUser.id))
      .limit(1);

    if (!user) {
      [user] = await db
        .insert(users)
        .values({
          discordId: discordUser.id,
          username: discordUser.username,
          globalName: discordUser.global_name || discordUser.username,
          avatar: discordUser.avatar,
          email: discordUser.email,
        })
        .returning();
    } else {
      await db
        .update(users)
        .set({
          username: discordUser.username,
          globalName: discordUser.global_name || discordUser.username,
          avatar: discordUser.avatar,
          email: discordUser.email,
          lastLoginAt: new Date(),
        })
        .where(eq(users.id, user.id));
    }

    await createSession({
      id: user.id,
      discordId: user.discordId,
      username: user.username,
      globalName: user.globalName,
      avatar: avatarUrl(user.discordId, user.avatar),
    });

    const res = NextResponse.redirect(new URL(safeNext, origin));
    res.cookies.delete(STATE_COOKIE);
    res.cookies.delete(NEXT_COOKIE);
    return res;
  } catch (e) {
    console.error("[auth] OAuth callback error:", e);
    return NextResponse.redirect(new URL("/?error=discord", origin));
  }
}