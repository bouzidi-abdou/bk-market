"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, Zap, Package, X } from "lucide-react";
import DiscordIcon from "./discord-icon";

export default function LoginModal({
  open,
  onClose,
  next,
  configured,
  title = "سجّل دخولك عبر ديسكورد",
  subtitle = "تسجيل الدخول مطلوب لإتمام أي عملية شراء في BK MARKET",
}: {
  open: boolean;
  onClose: () => void;
  next: string;
  configured: boolean;
  title?: string;
  subtitle?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-center justify-center p-4"
          onClick={onClose}
          data-lenis-prevent
        >
          <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="absolute -top-24 end-1/2 size-48 translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="absolute end-4 top-4 grid size-9 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              <X className="size-4" />
            </button>

            <div className="relative">
              <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-accent text-white shadow-xl shadow-accent/30">
                <DiscordIcon className="size-8" />
              </div>
              <h3 className="text-center text-xl font-black">{title}</h3>
              <p className="mt-2 text-center text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                {subtitle}
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                {[
                  { icon: Zap, text: "استلام فوري لطلبك على حسابك في ديسكورد" },
                  { icon: Package, text: "تتبّع جميع طلباتك من صفحة حسابك" },
                  { icon: ShieldCheck, text: "حماية كاملة لمشترياتك وضمان الاستبدال" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                      <Icon className="size-4" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>

              <a
                href={`/api/auth/discord?next=${encodeURIComponent(next)}`}
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-accent px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accent-dark"
              >
                <DiscordIcon className="size-5" />
                متابعة عبر Discord
              </a>

              {!configured && (
                <p className="mt-4 rounded-xl bg-neutral-100 px-4 py-2.5 text-center text-[11px] leading-5 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  وضع المعاينة — لم يتم ضبط مفاتيح ديسكورد بعد، سيتم تسجيلك بحساب
                  تجريبي. أضف DISCORD_CLIENT_ID و DISCORD_CLIENT_SECRET لتفعيل
                  الربط الحقيقي.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
