"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, BadgePercent, Truck, Headset, ShieldCheck } from "lucide-react";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";
import AuthButton from "./auth-button";
import Marquee from "./marquee";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/store", label: "المتجر" },
  { href: "/exchange", label: "الصرف" },
  { href: "/#categories", label: "الأقسام" },
  { href: "/#how", label: "كيف نعمل" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* animated offers strip — collapses on scroll */}
      <div
        className={cn(
          "overflow-hidden bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 transition-[max-height,opacity] duration-500",
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
        )}
      >
        <div className="flex h-10 items-center">
          <Marquee
            fast
            items={[
              <span key="1" className="flex items-center gap-2">
                <BadgePercent className="size-3.5 text-accent" /> كود{" "}
                <b className="font-display text-xs tracking-widest">BK10</b> يمنحك خصم 10% على كل شيء
              </span>,
              <span key="2" className="flex items-center gap-2">
                <Truck className="size-3.5 text-accent" /> توصيل فوري خلال دقائق عبر ديسكورد
              </span>,
              <span key="3" className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-accent" /> ضمان استبدال على جميع المنتجات
              </span>,
              <span key="4" className="flex items-center gap-2">
                <Headset className="size-3.5 text-accent" /> دعم فني على مدار الساعة
              </span>,
            ]}
            className="text-xs font-semibold text-neutral-300 dark:text-neutral-700"
          />
        </div>
      </div>

      <nav
        className={cn(
          "transition-all duration-500",
          scrolled
            ? "glass border-b border-neutral-900/[0.06] shadow-[0_8px_40px_-16px_rgba(0,0,0,0.12)] dark:border-white/10 dark:shadow-none"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative rounded-full px-4 py-2 text-sm font-bold text-neutral-600 transition hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              >
                {l.label}
                <span className="absolute inset-x-4 -bottom-px h-px origin-center scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
            <AuthButton />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMenu((v) => !v)}
              aria-label="القائمة"
              className="grid size-10 place-items-center rounded-full border border-neutral-200 bg-white/70 dark:border-neutral-800 dark:bg-neutral-900/70"
            >
              {menu ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-4 mt-2 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 lg:hidden"
            data-lenis-prevent
          >
            <div className="flex flex-col">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-2xl px-4 py-3.5 text-sm font-bold transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <AuthButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
