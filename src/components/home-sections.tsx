import Link from "next/link";
import {
  ArrowLeft,
  Zap,
  ShieldCheck,
  Headset,
  BadgePercent,
  LogIn,
  CreditCard,
  PackageCheck,
} from "lucide-react";
import Reveal, { RevealStagger, RevealItem } from "./reveal";
import SectionHeading from "./section-heading";
import ProductIcon from "./product-icon";
import IconTile from "./icon-tile";
import DiscordIcon from "./discord-icon";
import { CATEGORIES, TINTS } from "@/lib/utils";

/* ------------------------------ CATEGORIES ------------------------------ */

export type CategoryStat = { key: string; count: number; minPrice: number };

export function CategoriesSection({ data }: { data: CategoryStat[] }) {
  return (
    <section id="categories" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="الأقسام"
          title={
            <>
              ستة عوالم،{" "}
              <span className="text-accent">كل ما تحتاجه رقمياً</span> في مكان
              واحد
            </>
          }
          sub="من الفيزات والاشتراكات إلى الحسابات والخدمات الإبداعية — تصفح أقسامنا واختر ما يناسبك."
        />

        <RevealStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {data.map(({ key, count: n, minPrice }, i) => {
            const c = CATEGORIES[key];
            if (!c) return null;
            const t = TINTS[c.tint] ?? TINTS.violet;
            const wide = i === 0 || i === 5;
            return (
              <RevealItem
                key={key}
                className={wide ? "lg:col-span-3" : "lg:col-span-2"}
              >
                <Link href={`/store?cat=${key}`} className="group block h-full">
                  <div
                    className={`relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white p-6 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-neutral-300 group-hover:shadow-xl dark:border-white/[0.07] dark:bg-neutral-900/70 dark:group-hover:border-white/15`}
                  >
                    {/* tinted wash + ghost watermark (CSS only) */}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 ${t.wash}`}
                    />
                    <ProductIcon
                      name={c.icon}
                      className={`pointer-events-none absolute -bottom-10 -end-8 size-44 rotate-[16deg] opacity-[0.04] transition-opacity duration-700 group-hover:opacity-[0.08] ${t.text}`}
                    />

                    <div className="relative flex items-start justify-between">
                      <IconTile name={c.icon} tint={c.tint} size="lg" glow />
                      <span className="grid size-10 place-items-center rounded-full border border-neutral-200 text-neutral-400 transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-white dark:border-white/10">
                        <ArrowLeft className="size-4" />
                      </span>
                    </div>

                    <div className="relative mt-5 flex-1">
                      <h3 className="text-lg font-black transition-colors duration-300 group-hover:text-accent">
                        {c.ar}
                      </h3>
                      <p className="mt-0.5 font-display text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                        {c.en}
                      </p>
                    </div>

                    <div className="relative mt-4 flex items-center gap-2 text-[11px] font-black">
                      <span className="rounded-full bg-neutral-900/[0.05] px-3 py-1.5 text-neutral-500 ring-1 ring-inset ring-neutral-900/[0.06] dark:bg-white/[0.06] dark:text-neutral-300 dark:ring-white/[0.08]">
                        {n} منتج
                      </span>
                      {minPrice > 0 && (
                        <span
                          className={`flex items-center gap-1 rounded-full px-3 py-1.5 ring-1 ring-inset ${t.wash} ${t.text}`}
                        >
                          يبدأ من
                          <b className="font-display">${minPrice.toFixed(2)}</b>
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}

/* -------------------------------- WHY US -------------------------------- */

const WHY = [
  {
    icon: Zap,
    title: "توصيل برّاق السرعة",
    text: "أغلب المنتجات تصلك تلقائياً خلال أقل من 10 دقائق من إتمام الدفع — بلا انتظار وبلا تعقيد.",
  },
  {
    icon: ShieldCheck,
    title: "ضمان ذهبي حقيقي",
    text: "أي منتج يتوقف عن العمل خلال فترة الضمان نستبدله فوراً أو نعيد رصيدك — بدون نقاش.",
  },
  {
    icon: BadgePercent,
    title: "أسعار تحت الجملة",
    text: "نتعامل مع مورّدين مباشرين حول العالم لنقدم سعراً لن تجده في أي متجر آخر — بجودة أصلية.",
  },
  {
    icon: Headset,
    title: "دعم بشري 24/7",
    text: "فريق حقيقي يرد عليك بالعربية على مدار الساعة عبر تذاكر الديسكورد — متوسط الرد 3 دقائق.",
  },
];

export function WhySection() {
  return (
    <section
      id="why"
      className="relative overflow-hidden bg-neutral-950 py-20 text-white dark:bg-black md:py-28"
    >
      <div className="absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]" />
        <div className="absolute -top-40 start-1/4 size-[420px] rounded-full bg-accent/15 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow="لماذا BK MARKET؟"
          title={
            <>
              لسنا مجرد متجر —{" "}
              <span className="shine-text">نحن تجربة شراء تليق بك</span>
            </>
          }
        />

        <Reveal>
          <p className="mx-auto -mt-6 max-w-3xl text-center text-base leading-9 text-neutral-400">
            منذ اليوم الأول ونحن نسأل أنفسنا سؤالاً واحداً: كيف نجعل شراء منتج
            رقمي أسهل من إرسال رسالة؟ بنينا BK MARKET حول إجابة واحدة — منتجات
            أصلية بأسعار عادلة، تسليم أسرع مما تتوقع، ودعم يعاملك كصديق لا
            كرقم طلب. هذه ليست وعوداً تسويقية، بل المعيار الذي نقيس به كل
            عملية تمر عبر متجرنا.
          </p>
        </Reveal>

        <RevealStagger className="mt-14 grid gap-x-12 sm:grid-cols-2">
          {WHY.map(({ icon: Icon, title, text }, i) => (
            <RevealItem key={title}>
              <div className="group flex items-start gap-5 border-t border-white/10 py-7">
                <span className="shrink-0 font-display text-xs font-bold tracking-widest text-neutral-600 transition-colors group-hover:text-accent">
                  0{i + 1}
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-accent ring-1 ring-inset ring-white/10">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-black transition-colors group-hover:text-white">
                    {title}
                  </h3>
                  <p className="mt-1.5 max-w-md text-sm leading-7 text-neutral-500">
                    {text}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

/* ------------------------------ HOW IT WORKS ---------------------------- */

const STEPS = [
  {
    n: "01",
    icon: LogIn,
    title: "سجّل عبر ديسكورد",
    text: "ضغطة زر واحدة تكفي — اربط حسابك وخلّي كل مشترياتك مربوطة بهويتك بشكل آمن.",
  },
  {
    n: "02",
    icon: CreditCard,
    title: "اختر وادفع بأمان",
    text: "تصفح الأقسام، اختر منتجك، وادفع بالطريقة التي تريحك عبر بوابة مشفرة بالكامل.",
  },
  {
    n: "03",
    icon: PackageCheck,
    title: "استلم خلال دقائق",
    text: "يصلك الطلب عبر رسالة خاصة وتذكرة في سيرفر الديسكورد فوراً — مع ضمان الاستبدال الكامل.",
  },
];

export function HowSection() {
  return (
    <section id="how" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="كيف نعمل؟"
          title={
            <>
              من الضغطة إلى الاستلام —{" "}
              <span className="text-accent">ثلاث خطوات فقط</span>
            </>
          }
          sub="صممنا رحلة الشراء لتكون أسرع مما تتخيل."
        />

        <div className="relative">
          <div className="absolute inset-x-24 top-16 hidden border-t-2 border-dashed border-neutral-200 dark:border-white/10 lg:block" />
          <RevealStagger className="relative grid gap-10 lg:grid-cols-3">
            {STEPS.map(({ n, icon: Icon, title, text }, i) => (
              <RevealItem key={n}>
                <div className="group relative text-center">
                  <div className="relative mx-auto grid size-32 place-items-center">
                    <span className="absolute inset-0 rounded-full border border-neutral-200 bg-white transition-colors duration-500 group-hover:border-accent/40 dark:border-white/10 dark:bg-neutral-900" />
                    <span className="absolute inset-3 rounded-full border border-dashed border-neutral-300 dark:border-white/15" />
                    <span className="relative grid size-16 place-items-center rounded-full bg-neutral-900 text-white shadow-xl shadow-neutral-900/20 transition-colors duration-500 group-hover:bg-accent dark:bg-white dark:text-neutral-900 dark:group-hover:bg-accent dark:group-hover:text-white">
                      <Icon className="size-7" />
                    </span>
                    <span className="absolute -top-1 -end-1 z-10 grid size-9 place-items-center rounded-full bg-accent font-display text-xs font-bold text-white shadow-lg shadow-accent/40">
                      {i + 1}
                    </span>
                  </div>
                  <p className="mt-6 font-display text-[10px] uppercase tracking-[0.35em] text-neutral-400">
                    STEP {n}
                  </p>
                  <h3 className="mt-2 text-xl font-black">{title}</h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-neutral-500 dark:text-neutral-400">
                    {text}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- CTA ---------------------------------- */

export function CTASection() {
  return (
    <section className="relative px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-neutral-950 px-6 py-20 text-center text-white md:py-28">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: "url(/images/hero-dark.png)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/30" />
          <div className="bg-noise absolute inset-0 opacity-20 mix-blend-overlay" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-black tracking-wide text-neutral-300 backdrop-blur">
              <span className="size-1.5 animate-pulse-soft rounded-full bg-emerald-400" />
              انضم لأكثر من 12,000 عميل
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-black leading-[1.3] md:text-5xl md:leading-[1.25]">
              جاهز تبدأ رحلتك في عالم
              <br />
              <span className="shine-text font-display uppercase tracking-wide">
                المنتجات الرقمية؟
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-neutral-400">
              فيزات وبطاقات، اشتراكات بريميوم، حسابات نادرة، وخدمات برمجة
              وتصميم — تصفح المتجر الآن ولا تنسَ كود{" "}
              <b className="font-display text-accent">BK10</b> بخصم 10%.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/store"
                className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-black text-neutral-900 shadow-2xl transition hover:-translate-y-1"
              >
                تصفّح المتجر
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              </Link>
              <a
                href="/api/auth/discord"
                className="group flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-sm font-black text-white shadow-xl shadow-accent/30 transition hover:-translate-y-1 hover:bg-accent-dark"
              >
                <DiscordIcon className="size-4.5" />
                دخول عبر ديسكورد
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
