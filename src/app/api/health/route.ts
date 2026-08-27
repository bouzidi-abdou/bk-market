import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";

/**
 * Diagnostics endpoint — open it on your deployed URL to see exactly what
 * is wrong (missing env vars / unreachable database / missing tables).
 * Never leaks secret VALUES, only their presence.
 */
export async function GET() {
  const env = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    SESSION_SECRET: Boolean(process.env.SESSION_SECRET),
    DISCORD_OAUTH: Boolean(
      process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
    ),
    ADMIN_IDS: Boolean(process.env.ADMIN_DISCORD_IDS),
    COUPON_CODE: process.env.NEXT_PUBLIC_COUPON_CODE ?? "BK10",
  };

  let database: Record<string, unknown>;
  if (!env.DATABASE_URL) {
    database = {
      status: "missing-env",
      hint: "أضف DATABASE_URL في إعدادات الاستضافة (Netlify → Environment variables)",
    };
  } else {
    try {
      await db.execute(sql`select 1`);
      const [row] = await db
        .select({ value: sql<number>`count(*)::int` })
        .from(products);
      database = { status: "connected", products: row?.value ?? 0 };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      database = {
        status: "error",
        message: message.slice(0, 180),
        hint: message.includes("does not exist")
          ? "الجداول غير موجودة — نفّذ: npx drizzle-kit push ثم npx tsx src/db/seed.ts مع DATABASE_URL الخاص بك"
          : "تعذّر الاتصال — تحقق من صحة الرابط (انتبه للأحرف الخاصة في كلمة المرور: استعمل URL-encoding)",
      };
    }
  }

  const healthy = database.status === ("connected" as string) && env.SESSION_SECRET;

  return NextResponse.json(
    { ok: Boolean(healthy), env, database },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
