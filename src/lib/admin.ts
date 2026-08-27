import { env } from "./env";
import { isDiscordConfigured } from "./discord";

/**
 * Admin resolution order:
 * 1. ADMIN_DISCORD_IDS env (comma-separated Discord user IDs) — always works
 * 2. Real Discord role check via bot: DISCORD_GUILD_ID + DISCORD_BOT_TOKEN + ADMIN_ROLE_ID
 * 3. Preview fallback: when Discord OAuth is not configured at all, allow access
 *    so the demo identity can manage the store.
 */
export async function isAdminUser(discordId: string): Promise<boolean> {
  if (env.ADMIN_DISCORD_IDS.includes(discordId)) return true;

  if (env.DISCORD_GUILD_ID && env.DISCORD_BOT_TOKEN && env.ADMIN_ROLE_ID) {
    try {
      const res = await fetch(
        `https://discord.com/api/guilds/${env.DISCORD_GUILD_ID}/members/${discordId}`,
        {
          headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const member = (await res.json()) as { roles?: string[] };
        if (member.roles?.includes(env.ADMIN_ROLE_ID)) return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  if (!isDiscordConfigured() && env.ADMIN_DISCORD_IDS.length === 0) return true;
  return false;
}
