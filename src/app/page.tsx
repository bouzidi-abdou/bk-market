import { count, min } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { trackVisit } from "@/lib/track";
import { dbSafe } from "@/lib/safe";
import Hero from "@/components/hero";
import Marquee from "@/components/marquee";
import DbBanner from "@/components/db-banner";
import {
  CategoriesSection,
  WhySection,
  HowSection,
  CTASection,
  type CategoryStat,
} from "@/components/home-sections";
import { CATEGORIES } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ ok: dbOk, data: statsRows }] = await Promise.all([
    dbSafe(
      () =>
        db
          .select({
            category: products.category,
            n: count(),
            minP: min(products.price),
          })
          .from(products)
          .groupBy(products.category),
      [] as { category: string; n: number; minP: string | null }[]
    ),
    trackVisit("/"),
  ]);

  const stats: CategoryStat[] = Object.keys(CATEGORIES).map((key) => {
    const row = statsRows.find((r) => r.category === key);
    return {
      key,
      count: row?.n ?? 0,
      minPrice: row?.minP ? Number(row.minP) : 0,
    };
  });

  return (
    <>
      <Hero />
      {!dbOk && <DbBanner />}

      {/* product names band */}
      <section className="border-y border-neutral-200/70 bg-white py-5 dark:border-white/[0.06] dark:bg-neutral-900/40">
        <Marquee
          items={[
            "نيترو بوست",
            "Netflix 4K",
            "Spotify Premium",
            "بطاقات Steam",
            "فيزا افتراضية",
            "ChatGPT Plus",
            "YouTube Premium",
            "حسابات 2016 نادرة",
            "بوتات مخصصة",
            "بوستات سيرفر",
            "Shahid VIP",
            "هوية بصرية",
            "Google Play",
            "مواقع متاجر",
          ]}
          className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500"
        />
      </section>

      <CategoriesSection data={stats} />

      {/* perks band */}
      <section className="border-y border-neutral-200/70 bg-white py-5 dark:border-white/[0.06] dark:bg-neutral-900/40">
        <Marquee
          reverse
          items={[
            "توصيل تلقائي خلال دقائق",
            "ضمان استبدال ذهبي",
            "دفع مشفر وآمن 100%",
            "أسعار تحت الجملة",
            "دعم عربي 24/7",
            "تقييم 4.9 من آلاف العملاء",
          ]}
          className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500"
        />
      </section>

      <WhySection />
      <HowSection />
      <CTASection />
    </>
  );
}
