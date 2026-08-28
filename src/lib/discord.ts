import { env } from "./env";

const TOKEN_URL = "https://discord.com/api/oauth2/token";
const USER_URL = "https://discord.com/api/users/@me";

function getCredentials() {
  let clientId = process.env.DISCORD_CLIENT_ID || (env as any)?.DISCORD_CLIENT_ID || "";
  let clientSecret = process.env.DISCORD_CLIENT_SECRET || (env as any)?.DISCORD_CLIENT_SECRET || "";

  if ((!clientId || !clientSecret) && process.env.DISCORD_OAUTH) {
    try {
      const parsed = typeof process.env.DISCORD_OAUTH === "string" 
        ? JSON.parse(process.env.DISCORD_OAUTH) 
        : process.env.DISCORD_OAUTH;
        
      clientId = parsed.clientId || parsed.client_id || clientId;
      clientSecret = parsed.clientSecret || parsed.client_secret || clientSecret;
    } catch (e) {
      console.error("[Discord OAuth] JSON Parse Error:", e);
    }
  }

  return { clientId: String(clientId).trim(), clientSecret: String(clientSecret).trim() };
}

export function isDiscordConfigured() {
  const { clientId, clientSecret } = getCredentials();
  return Boolean(clientId && clientSecret);
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
    console.error("[Discord OAuth Error] Missing credentials in production environment.");
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
    const errorBody = await res.text();
    console.error(`[Discord OAuth Failed] Status: ${res.status} | Body: ${errorBody}`);
    throw new Error(`Token exchange failed with status ${res.status}`);
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