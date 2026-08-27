"use client";

import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Gamepad2,
  Headset,
  Music,
  ShieldCheck,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import DiscordIcon from "./discord-icon";
import CountUp from "./count-up";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

function ParallaxChip({
  sx,
  sy,
  factor,
  className,
  floatClass,
  icon: Icon,
  title,
  sub,
}: {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  factor: number;
  className?: string;
  floatClass: string;
  icon: typeof Zap;
  title: string;
  sub: string;
}) {
  const x = useTransform(sx, (v) => v * factor);
  const y = useTransform(sy, (v) => v * factor * 0.8);

  return (
    <motion.div
      style={{ x, y }}
      className={cn("absolute z-20", className)}
    >
      <div
        className={cn(
          "glass flex items-center gap-3 rounded-2xl border border-white/60 p-3 pe-5 shadow-xl shadow-neutral-900/[0.08] dark:border-white/10 dark:shadow-black/40",
          floatClass
        )}
      >
        <span className="grid size-10 place-items-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
          <Icon className="size-5" />
        </span>
        <span className="text-start">
          <b className="block text-sm font-black leading-4">{title}</b>
          <span className="text-[11px] font-bold text-neutral-400">{sub}</span>
        </span>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });

  const imgX = useTransform(sx, (v) => v * -34);
  const imgY = useTransform(sy, (v) => v * -26);
  const bgX = useTransform(sx, (v) => v * 14);
  const bgY = useTransform(sy, (v) => v * 12);

  return (
    <section
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative overflow-hidden pt-44 pb-20 md:pt-52 md:pb-28"
    >
      {/* backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black,transparent)]" />
        <motion.div
          style={{ x: bgX, y: bgY }}
          className="absolute -top-32 start-[8%] size-[420px] rounded-full bg-accent/15 blur-[110px] dark:bg-accent/20"
        />
        <div className="absolute top-1/3 end-[4%] size-[380px] rounded-full bg-indigo-400/10 blur-[110px]" />
        <div className="bg-noise absolute inset-0 opacity-[0.35] mix-blend-multiply dark:opacity-[0.18] dark:mix-blend-overlay" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8">
        {/* ---- copy ---- */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white/70 px-4 py-2 text-xs font-black text-neutral-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-neutral-300"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            المتجر متاح الآن — توصيل فوري عبر ديسكورد
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
            className="mt-7 font-display text-sm uppercase tracking-[0.35em] text-neutral-400"
          >
            Welcome to
          </motion.p>

          <h1 className="mt-3">
            <motion.span
              initial={{ opacity: 0, y: 70, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.14, ease: EASE }}
              className="shine-text block font-display text-[13vw] font-bold uppercase leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.6rem]"
            >
              BK MARKET
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
              className="mt-5 block text-2xl font-black leading-snug md:text-[2rem]"
            >
              سوق رقمي فاخر —{" "}
              <span className="relative inline-block text-accent">
                لكل احتياجاتك الإلكترونية
                <svg
                  className="absolute -bottom-2 start-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 6 Q 60 0 100 4 T 198 3"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    className="opacity-60"
                  />
                </svg>
              </span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            className="mt-6 max-w-xl text-sm leading-8 text-neutral-500 dark:text-neutral-400 md:text-base"
          >
            نيترو وبوستات، فيزات وبطاقات هدايا، اشتراكات بريميوم لكل المنصات
            المشهورة، حسابات قديمة نادرة، وخدمات برمجة وتصميم احترافية —
            بأسعار لا تُنافس وتسليم أسرع مما تتخيل.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.38, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/store"
              className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-neutral-900 px-8 py-4 text-sm font-black text-white shadow-xl shadow-neutral-900/20 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-neutral-900/30 dark:bg-white dark:text-neutral-900 dark:shadow-white/10"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full dark:via-black/15" />
              تصفّح المتجر
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
            </Link>
            <a
              href="#how"
              className="group flex items-center gap-3 rounded-full border border-neutral-300 px-7 py-4 text-sm font-black transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-white/15 dark:hover:border-white dark:hover:bg-white dark:hover:text-neutral-900"
            >
              <DiscordIcon className="size-4.5 text-accent transition group-hover:text-inherit" />
              كيف نعمل؟
            </a>
          </motion.div>

          {/* trust row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.46, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs font-bold text-neutral-500 dark:text-neutral-400"
          >
            <span className="flex items-center gap-2">
              <span className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400" />
                ))}
              </span>
              4.9/5 من +3,100 تقييم
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" /> ضمان استبدال
            </span>
            <span className="flex items-center gap-2">
              <Truck className="size-4 text-accent" /> تسليم خلال دقائق
            </span>
            <span className="flex items-center gap-2">
              <Headset className="size-4 text-indigo-500" /> دعم 24/7
            </span>
          </motion.div>
        </div>

        {/* ---- 3D scene ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
          className="relative mx-auto aspect-square w-full max-w-[540px] [perspective:1400px]"
        >
          <motion.div
            style={{ x: imgX, y: imgY }}
            className="absolute inset-0 ring-3d"
          >
            <div className="absolute inset-4 rounded-[2.75rem] bg-gradient-to-br from-accent/25 via-transparent to-indigo-400/20 blur-2xl" />
            <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border border-white/70 shadow-2xl shadow-neutral-900/[0.14] dark:border-white/10 dark:shadow-black/50">
              <Image
                src="/images/hero-light.png"
                alt="عالم BK MARKET ثلاثي الأبعاد"
                fill
                priority
                className="object-cover transition-transform duration-[2s] hover:scale-105 dark:hidden"
              />
              <Image
                src="/images/hero-dark.png"
                alt="عالم BK MARKET ثلاثي الأبعاد"
                fill
                priority
                className="hidden object-cover transition-transform duration-[2s] hover:scale-105 dark:block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent dark:from-black/30" />
            </div>
          </motion.div>

          {/* floating chips */}
          <ParallaxChip
            sx={sx} sy={sy} factor={52} floatClass="animate-float-a"
            className="-top-4 end-2 md:-end-6"
            icon={Zap} title="نيترو بوست" sub="بدءاً من $1.99"
          />
          <ParallaxChip
            sx={sx} sy={sy} factor={70} floatClass="animate-float-b"
            className="top-[30%] -start-2 md:-start-10"
            icon={CreditCard} title="فيزا افتراضية" sub="تفعيل فوري"
          />
          <ParallaxChip
            sx={sx} sy={sy} factor={44} floatClass="animate-float-c"
            className="bottom-[24%] end-0 md:-end-4"
            icon={Music} title="Spotify سنة" sub="$14.99 فقط"
          />
          <ParallaxChip
            sx={sx} sy={sy} factor={62} floatClass="animate-float-a"
            className="-bottom-5 start-[14%]"
            icon={Gamepad2} title="بطاقات Steam" sub="تسليم تلقائي"
          />

          {/* rotating ring badge */}
          <motion.div
            style={{ x: bgX, y: bgY }}
            className="absolute -bottom-8 end-[8%] z-30 hidden md:block"
          >
            <div className="relative grid size-28 place-items-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
                <defs>
                  <path id="circlePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                </defs>
                <text className="fill-neutral-500 font-display text-[9.5px] uppercase tracking-[0.32em] dark:fill-neutral-400">
                  <textPath href="#circlePath">
                    BK MARKET • DIGITAL • STORE •
                  </textPath>
                </text>
              </svg>
              <span className="grid size-12 place-items-center rounded-full bg-accent text-white shadow-lg shadow-accent/40">
                <DiscordIcon className="size-6" />
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.55, ease: EASE }}
        className="mx-auto mt-20 max-w-5xl px-4 sm:px-6"
      >
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-200/60 dark:border-white/[0.06] dark:bg-white/[0.04] md:grid-cols-4">
          {[
            { v: 12000, s: "+", label: "عميل سعيد" },
            { v: 18, s: "+", label: "منتج رقمي منتقى" },
            { v: 4.9, s: "/5", label: "متوسط التقييم", d: 1 },
            { v: 85000, s: "+", label: "عملية تسليم ناجحة" },
          ].map(({ v, s, label, d }) => (
            <div
              key={label}
              className="bg-white px-6 py-7 text-center dark:bg-neutral-950"
            >
              <p className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                <CountUp to={v} suffix={s} decimals={d ?? 0} />
              </p>
              <p className="mt-1.5 text-xs font-bold text-neutral-400">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
