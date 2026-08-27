import { desc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { trackVisit } from "@/lib/track";
import { dbSafe } from "@/lib/safe";
import StoreBrowser from "@/components/store-browser";
import Marquee from "@/components/marquee";
import DbBanner from "@/components/db-banner";
import type { CardProduct } from "@/components/product-card";

export const dynamic = "force-dynamic";

function serialize(p: typeof products.$inferSelect): CardProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: p.category,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
    icon: p.icon,
    tint: p.tint,
    imageUrl: p.imageUrl,
    badge: p.badge,
    deliveryTime: p.deliveryTime,
    rating: p.rating,
    sales: p.sales,
  };
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const [{ ok: dbOk, data: rows }] = await Promise.all([
    dbSafe(
      () =>
        db
          .select()
          .from(products)
          .orderBy(desc(products.featured), desc(products.sales)),
      [] as (typeof products.$inferSelect)[]
    ),
    trackVisit("/store"),
  ]);

  return (
    <>
      <section className="relative overflow-hidden pb-10 pt-44 md:pt-52">
        <div className="absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,black,transparent)]" />
          <div className="absolute -top-24 start-1/3 size-[380px] rounded-full bg-accent/10 blur-[110px]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-neutral-400">
            BK MARKET STORE
          </p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl">
            المتجر <span className="shine-text font-display tracking-tight">الكامل</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-neutral-500 dark:text-neutral-400">
            {rows.length} منتجاً رقمياً منتقى بعناية — ابحث، رشّح، واطلب خلال
            أقل من دقيقة.
          </p>
        </div>
        <div className="mt-10 border-y border-neutral-200/70 bg-white py-4 dark:border-white/[0.06] dark:bg-neutral-900/40">
          <Marquee
            fast
            items={[
              "خصم 10% بكود BK10",
              "تسليم فوري خلال دقائق",
              "ضمان استبدال على كل منتج",
              "منتجات جديدة كل أسبوع",
            ]}
            className="font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400"
          />
        </div>
      </section>

      {!dbOk && <DbBanner title="المتجر قيد التهيئة مؤقتاً" />}

      <section className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <StoreBrowser products={rows.map(serialize)} initialCat={cat ?? "all"} />
      </section>
    </>
  );
}
