import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { isDiscordConfigured } from "@/lib/discord";
import { isAdminUser } from "@/lib/admin";

export async function GET() {
  const user = await getSessionUser();
  const isAdmin = user ? await isAdminUser(user.discordId) : false;
  return NextResponse.json({
    user,
    configured: isDiscordConfigured(),
    isAdmin,
  });
}
