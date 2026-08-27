/**
 * SERVER-SIDE ONLY configuration — never import this from client components.
 * Client-safe public values live in @/lib/utils (COUPON_CODE, SITE_LOGO_URL).
 */

const isProd = process.env.NODE_ENV === "production";

function required(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required environment variable: ${key}`);
  return v;
}

import { createHash } from "crypto";

let cachedSecret: string | null = null;

/**
 * Resilient secret resolution — the server must NEVER 500 because of a
 * missing SESSION_SECRET (notably on Netlify before the var is added):
 * 1. explicit SESSION_SECRET wins (recommended in production)
 * 2. otherwise derive a stable, non-public secret from DATABASE_URL so
 *    sessions keep working and survive restarts
 * 3. final fallback is a dev constant
 */
export function getSessionSecret(): string {
  if (cachedSecret) return cachedSecret;
  const v = process.env.SESSION_SECRET;
  if (v && v.length >= 16) {
    cachedSecret = v;
    return cachedSecret;
  }
  const seed = process.env.DATABASE_URL || (isProd ? "" : "bk-market-dev");
  cachedSecret =
    "bk-deriv-" + createHash("sha256").update(seed).digest("hex");
  return cachedSecret;
}

export const env = {
  isProd,

  get DATABASE_URL() {
    return required("DATABASE_URL");
  },

  // Discord OAuth
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID ?? "",
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET ?? "",

  // Discord admin / role check
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID ?? "",
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN ?? "",
  ADMIN_ROLE_ID: process.env.ADMIN_ROLE_ID ?? "",
  ADMIN_DISCORD_IDS: (process.env.ADMIN_DISCORD_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // Coupons
  COUPON_CODE: (
    process.env.COUPON_CODE ??
    process.env.NEXT_PUBLIC_COUPON_CODE ??
    "BK10"
  ).toUpperCase(),
  COUPON_PERCENT: (() => {
    const n = Number(process.env.COUPON_PERCENT ?? 10);
    return Number.isFinite(n) ? Math.min(Math.max(n, 0), 100) / 100 : 0.1;
  })(),

  // Integrations
  EXCHANGE_API_URL:
    process.env.EXCHANGE_API_URL ?? "https://open.er-api.com/v6/latest/USD",

  // Cookies / transport
  COOKIE_SECURE: process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "1"
    : isProd,

  // Rate limits (requests per window)
  RL_AUTH: { limit: 15, windowMs: 60_000 },
  RL_ORDERS: { limit: 8, windowMs: 60_000 },
  RL_ADMIN: { limit: 40, windowMs: 60_000 },
} as const;
