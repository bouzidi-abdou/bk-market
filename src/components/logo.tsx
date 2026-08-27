import Link from "next/link";
import { cn, SITE_LOGO_URL } from "@/lib/utils";

export const LOGO_URL = SITE_LOGO_URL;

export default function Logo({
  size = "md",
  href = "/",
  className,
}: {
  size?: "sm" | "md" | "lg";
  href?: string | null;
  className?: string;
}) {
  const tile =
    size === "lg"
      ? "size-12 rounded-2xl"
      : size === "sm"
        ? "size-8 rounded-lg"
        : "size-10 rounded-xl";
  const ring = size === "sm" ? "rounded-xl" : "rounded-[16px]";
  const text =
    size === "lg"
      ? "text-2xl tracking-[0.18em]"
      : size === "sm"
        ? "text-sm tracking-[0.18em]"
        : "text-base tracking-[0.16em]";

  const inner = (
    <div className={cn("group flex items-center gap-3", className)}>
      <span className="relative">
        {/* rotating orbit ring — the LOOP mark */}
        <span
          aria-hidden
          className={cn("absolute -inset-[5px] opacity-70", ring)}
        >
          <span className="absolute inset-0 animate-spin-slow rounded-[inherit] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#5865f2_340deg,transparent_360deg)] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] p-[1.5px]" />
        </span>
        <span
          className={cn(
            "relative block overflow-hidden bg-neutral-900 shadow-lg shadow-neutral-900/20 ring-1 ring-white/10 transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105 dark:shadow-black/50",
            tile
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_URL}
            alt="BK MARKET"
            className="size-full object-cover"
            loading="eager"
          />
        </span>
      </span>
      <span className={cn("shine-text font-display font-semibold uppercase", text)}>
        BK MARKET
      </span>
    </div>
  );

  if (!href) return inner;
  return (
    <Link href={href} aria-label="BK MARKET — الرئيسية">
      {inner}
    </Link>
  );
}
