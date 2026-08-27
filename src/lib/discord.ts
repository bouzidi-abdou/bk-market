import { env } from "./env";

const TOKEN_URL = "https://discord.com/api/oauth2/token";
const USER_URL = "https://discord.com/api/users/@me";

export function isDiscordConfigured() {
  return !!(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET);
}

export function getRedirectUri(origin: string) {
  return `${origin}/api/auth/discord/callback`;
}

export function buildAuthorizeUrl(origin: string, state: string) {
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    redirect_uri: getRedirectUri(origin),
    response_type: "code",
    scope: "identify email",
    state,
    prompt: "consent",
  });
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCode(code: string, redirectUri: string) {
  const body = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    client_secret: env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  return (await res.json()) as { access_token: string };
}

export type DiscordApiUser = {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  email?: string | null;
};

export async function fetchDiscordUser(accessToken: string) {
  const res = await fetch(USER_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Fetch user failed: ${res.status}`);
  return (await res.json()) as DiscordApiUser;
}

export function avatarUrl(
  discordId: string,
  avatarHash: string | null,
  size = 128
) {
  if (avatarHash) {
    const ext = avatarHash.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.${ext}?size=${size}`;
  }
  // Discord default avatar index (new username system)
  let index = 0;
  const parsed = Number(discordId);
  if (Number.isFinite(parsed)) {
    index = Math.abs(Math.floor(parsed / 4194304)) % 6;
  }
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}
