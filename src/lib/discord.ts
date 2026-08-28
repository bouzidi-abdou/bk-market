import { env } from "./env";

const TOKEN_URL = "https://discord.com/api/oauth2/token";
const USER_URL = "https://discord.com/api/users/@me";

// دالة جلب بيانات الاعتماد من المتغيرات بأكثر من طريقة لضمان العمل على Netlify
function getCredentials() {
  let clientId = env.DISCORD_CLIENT_ID || process.env.DISCORD_CLIENT_ID || "";
  let clientSecret = env.DISCORD_CLIENT_SECRET || process.env.DISCORD_CLIENT_SECRET || "";

  if ((!clientId || !clientSecret) && process.env.DISCORD_OAUTH) {
    try {
      const parsed = JSON.parse(process.env.DISCORD_OAUTH);
      clientId = parsed.clientId || clientId;
      clientSecret = parsed.clientSecret || clientSecret;
    } catch (e) {
      console.error("[Discord Lib] Failed to parse DISCORD_OAUTH JSON:", e);
    }
  }

  return { clientId, clientSecret };
}

export function isDiscordConfigured() {
  const { clientId, clientSecret } = getCredentials();
  return !!(clientId && clientSecret);
}

export function getRedirectUri(origin: string) {
  return `${origin}/api/auth/discord/callback`;
}

export function buildAuthorizeUrl(origin: string, state: string) {
  const { clientId } = getCredentials();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(origin),
    response_type: "code",
    scope: "identify email",
    state,
    prompt: "consent",
  });
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCode(code: string, redirectUri: string) {
  const { clientId, clientSecret } = getCredentials();

  if (!clientId || !clientSecret) {
    throw new Error("Missing Discord Client ID or Client Secret");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
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

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[Discord OAuth Failed] Status: ${res.status}, Response: ${errorText}`);
    throw new Error(`Token exchange failed: ${res.status}`);
  }

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
  let index = 0;
  const parsed = Number(discordId);
  if (Number.isFinite(parsed)) {
    index = Math.abs(Math.floor(parsed / 4194304)) % 6;
  }
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}