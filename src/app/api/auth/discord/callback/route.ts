import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, STATE_COOKIE, NEXT_COOKIE } from "@/lib/auth";
import {
  exchangeCode,
  fetchDiscordUser,
  getRedirectUri,
  avatarUrl,
} from "@/lib/discord";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const storedState = req.cookies.get(STATE_COOKIE)?.value;
  const next = req.cookies.get(NEXT_COOKIE)?.value || "/";

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/?error=oauth_state", origin));
  }

  try {
    const { access_token } = await exchangeCode(code, getRedirectUri(origin));
    const du = await fetchDiscordUser(access_token);

    const [user] = await db
      .insert(users)
      .values({
        discordId: du.id,
        username: du.username,
        globalName: du.global_name,
        avatar: du.avatar,
        email: du.email ?? null,
      })
      .onConflictDoUpdate({
        target: users.discordId,
        set: {
          username: du.username,
          globalName: du.global_name,
          avatar: du.avatar,
          email: du.email ?? null,
          lastLoginAt: new Date(),
        },
      })
      .returning();

    await createSession({
      id: user.id,
      discordId: user.discordId,
      username: user.username,
      globalName: user.globalName,
      avatar: avatarUrl(user.discordId, user.avatar),
    });

    const res = NextResponse.redirect(
      new URL(next.startsWith("/") ? next : "/", origin)
    );
    res.cookies.delete(STATE_COOKIE);
    res.cookies.delete(NEXT_COOKIE);
    return res;
  } catch {
    return NextResponse.redirect(new URL("/?error=discord", origin));
  }
}
