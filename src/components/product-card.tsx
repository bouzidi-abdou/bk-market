import Link from "next/link";
import { ArrowLeft, Star, TrendingUp } from "lucide-react";
import IconTile from "./icon-tile";
import ProductIcon from "./product-icon";
import { cn, formatNumber, TINTS } from "@/lib/utils";

export type CardProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  oldPrice: number | null;
  icon: string;
  tint: string;
  imageUrl: string | null;
  badge: string | null;
  deliveryTime: string;
  rating: string;
  sales: number;
};

/**
 * Lightweight luxury card — pure CSS hover effects, zero JS motion cost.
 */
export default function ProductCard({ product }: { product: CardProduct }) {
  const tint = TINTS[product.tint] ?? TINTS.violet;

  return (
    <Link href={`/product/${product.slug}`} className="group block h-full">
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white transition-all duration-500",
          "group-hover:-translate-y-1.5 group-hover:border-neutral-300 group-hover:shadow-xl dark:border-white/[0.07] dark:bg-neutral-900/70 dark:group-hover:border-white/15"
        )}
      >
        {/* tinted wash (CSS only) */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100",
            tint.wash
          )}
        />

        {/* optional product image */}
        {product.imageUrl ? (
          <div className="relative h-40 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          </div>
        ) : null}

        <div className="relative flex flex-1 flex-col p-5">
          {/* top row */}
          <div className="flex items-start justify-between gap-3">
            <IconTile name={product.icon} tint={product.tint} size="lg" glow />
            <div className="flex flex-col items-end gap-1.5">
              {product.badge && (
                <span className="rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-black text-white shadow-md dark:bg-white dark:text-neutral-900">
                  {product.badge}
                </span>
              )}
              {product.oldPrice && (
                <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-black text-rose-500 ring-1 ring-inset ring-rose-500/20">
                  خصم {Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              )}
            </div>
          </div>

          {/* body */}
          <div className="relative mt-4 flex-1">
            {!product.imageUrl && (
              <ProductIcon
                name={product.icon}
                className={cn(
                  "pointer-events-none absolute -bottom-8 -end-6 -z-0 size-36 rotate-[14deg] opacity-[0.035] transition-opacity duration-700 group-hover:opacity-[0.07]",
                  tint.text
                )}
              />
            )}
            <h3 className="relative text-[15px] font-black leading-6 transition-colors duration-300 group-hover:text-accent">
              {product.name}
            </h3>
            <p className="relative mt-1.5 line-clamp-2 text-xs leading-5.5 text-neutral-500 dark:text-neutral-400">
              {product.description}
            </p>
          </div>

          {/* meta row */}
          <div className="relative mt-4 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-3 fill-amber-400" />
              ))}
              <b className="ms-1 text-[11px] font-black text-neutral-600 dark:text-neutral-300">
                {product.rating}
              </b>
            </span>
            <span className="flex items-center gap-1 text-[10px] font-black text-neutral-400">
              <TrendingUp className="size-3" />
              {formatNumber(product.sales)}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-500 ring-1 ring-inset ring-emerald-500/15">
              <span className="size-1 rounded-full bg-emerald-500" />
              {product.deliveryTime.split("—")[0].trim()}
            </span>
          </div>

          {/* price */}
          <div className="relative mt-4 flex items-end justify-between border-t border-neutral-100 pt-4 dark:border-white/[0.06]">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
                السعر
              </p>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="font-display text-[1.35rem] font-bold leading-none tracking-tight">
                  ${product.price.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-[11px] font-bold text-neutral-400 line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <span className="grid size-10 place-items-center rounded-full border border-neutral-200 text-neutral-500 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-accent group-hover:bg-accent group-hover:text-white dark:border-white/10 dark:text-neutral-400">
              <ArrowLeft className="size-4.5" />
            </span>
          </div>
        </div>

        {/* bottom accent sweep */}
        <span className="absolute inset-x-0 bottom-0 z-10 h-[3px] origin-right scale-x-0 bg-gradient-to-l from-accent via-indigo-400 to-accent transition-transform duration-500 group-hover:scale-x-100" />
      </div>
    </Link>
  );
}
