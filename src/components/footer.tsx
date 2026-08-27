import Link from "next/link";
import { Headset, Mail, ShieldCheck, Truck } from "lucide-react";
import Logo from "./logo";
import DiscordIcon from "./discord-icon";
import Marquee from "./marquee";
import { CATEGORIES } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-neutral-950 text-neutral-300 dark:bg-black">
      {/* top marquee */}
      <div className="border-b border-white/[0.06] py-5">
        <Marquee
          items={[
            "توصيل فوري",
            "أسعار منافسة",
            "دعم 24/7",
            "ضمان استبدال",
            "أكثر من 12,000 عميل",
            "منتجات ديسكورد أصلية",
          ]}
          className="font-display text-xs uppercase tracking-[0.3em] text-neutral-500"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo href="/" />
            <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-400">
              سوق رقمي فاخر لكل احتياجاتك — فيزات وبطاقات هدايا، اشتراكات
              بريميوم لكل المنصات المشهورة، حسابات قديمة نادرة، نيترو وبوستات،
              وخدمات برمجة وتصميم احترافية. كل شيء في مكان واحد.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-bold text-neutral-400">
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
                <Truck className="size-3.5 text-accent" /> تسليم فوري
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
                <ShieldCheck className="size-3.5 text-accent" /> دفع آمن
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
                <Headset className="size-3.5 text-accent" /> دعم دائم
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.25em] text-neutral-500">
              الأقسام
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {Object.entries(CATEGORIES).map(([key, c]) => (
                <li key={key}>
                  <Link
                    href={`/store?cat=${key}`}
                    className="text-neutral-400 transition hover:text-white"
                  >
                    {c.ar}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.25em] text-neutral-500">
              روابط سريعة
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/store" className="text-neutral-400 transition hover:text-white">المتجر</Link></li>
              <li><Link href="/exchange" className="text-neutral-400 transition hover:text-white">مركز الصرف</Link></li>
              <li><Link href="/#categories" className="text-neutral-400 transition hover:text-white">الأقسام</Link></li>
              <li><Link href="/#how" className="text-neutral-400 transition hover:text-white">كيف نعمل</Link></li>
              <li><Link href="/account" className="text-neutral-400 transition hover:text-white">حسابي وطلباتي</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.25em] text-neutral-500">
              تواصل معنا
            </h4>
            <p className="mt-5 text-sm leading-7 text-neutral-400">
              فريقنا متواجد على الديسكورد على مدار الساعة لاستقبال طلباتك
              والإجابة عن استفساراتك.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                className="flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-black text-white transition hover:bg-accent-dark"
              >
                <DiscordIcon className="size-4" /> سيرفر الديسكورد
              </a>
              <a
                href="#"
                className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs font-black text-neutral-300 transition hover:bg-white/5"
              >
                <Mail className="size-4" /> البريد
              </a>
            </div>
          </div>
        </div>

        {/* giant wordmark — forced dark shine so it stays visible in light mode */}
        <div className="dark pointer-events-none mt-16 select-none overflow-hidden">
          <p className="shine-text whitespace-nowrap text-center font-display text-[11.5vw] font-bold uppercase leading-none tracking-[0.08em] opacity-25">
            BK MARKET
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-neutral-500 md:flex-row">
          <p>© 2026 BK MARKET — جميع الحقوق محفوظة.</p>
          <p className="text-center md:text-end">
            BK MARKET متجر مستقل وليس تابعاً لشركة Discord Inc. أو أي منصة مذكورة.
          </p>
        </div>
      </div>
    </footer>
  );
}
