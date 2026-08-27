"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownWideNarrow,
  PackageSearch,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import ProductCard, { type CardProduct } from "./product-card";
import ProductIcon from "./product-icon";
import { CATEGORIES, cn } from "@/lib/utils";

type Sort = "popular" | "price-asc" | "price-desc" | "rating";

const SORTS: { id: Sort; label: string }[] = [
  { id: "popular", label: "الأكثر مبيعاً" },
  { id: "rating", label: "الأعلى تقييماً" },
  { id: "price-asc", label: "السعر: من الأقل" },
  { id: "price-desc", label: "السعر: من الأعلى" },
];

export default function StoreBrowser({
  products,
  initialCat = "all",
}: {
  products: CardProduct[];
  initialCat?: string;
}) {
  const [cat, setCat] = useState(initialCat);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("popular");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: products.length };
    for (const p of products) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.description.toLowerCase().includes(needle)
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      default:
        list.sort((a, b) => b.sales - a.sales);
    }
    return list;
  }, [products, cat, q, sort]);

  return (
    <div>
      {/* controls */}
      <div className="sticky top-[76px] z-40 -mx-2 rounded-3xl glass border border-neutral-200/70 p-3 shadow-lg shadow-neutral-900/[0.04] dark:border-white/[0.06] sm:mx-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute start-4 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن نيترو، نتفليكس، بطاقة ستيم…"
              className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 ps-11 pe-10 text-sm font-bold outline-none transition placeholder:font-semibold placeholder:text-neutral-400 focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-white/10 dark:bg-neutral-900"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                aria-label="مسح البحث"
                className="absolute end-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="relative">
            <ArrowDownWideNarrow className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="w-full cursor-pointer appearance-none rounded-2xl border border-neutral-200 bg-white py-3.5 ps-11 pe-8 text-sm font-bold outline-none transition focus:border-accent dark:border-white/10 dark:bg-neutral-900 lg:w-52"
              aria-label="ترتيب"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          <FilterPill
            active={cat === "all"}
            onClick={() => setCat("all")}
            label="الكل"
            count={counts.all}
          />
          {Object.entries(CATEGORIES).map(([key, c]) => (
            <FilterPill
              key={key}
              active={cat === key}
              onClick={() => setCat(key)}
              label={c.ar}
              icon={c.icon}
              count={counts[key] ?? 0}
            />
          ))}
        </div>
      </div>

      {/* results info */}
      <div className="mt-8 flex items-center gap-2 text-xs font-bold text-neutral-400">
        <SlidersHorizontal className="size-3.5" />
        عرض {filtered.length} من {products.length} منتج
        {cat !== "all" && (
          <button
            onClick={() => setCat("all")}
            className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-accent transition hover:bg-accent/20"
          >
            {CATEGORIES[cat]?.ar}
            <X className="size-3" />
          </button>
        )}
      </div>

      {/* grid — CSS-only entrances for a feather-light feel */}
      {filtered.length > 0 ? (
        <div
          key={`${cat}-${q}-${sort}`}
          className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filtered.map((p, i) => (
            <div
              key={p.id}
              className="card-enter"
              style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center py-16 text-center">
          <span className="grid size-20 place-items-center rounded-3xl bg-neutral-100 text-neutral-300 dark:bg-white/5 dark:text-neutral-600">
            <PackageSearch className="size-10" />
          </span>
          <h3 className="mt-6 text-lg font-black">لا توجد نتائج مطابقة</h3>
          <p className="mt-2 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
            جرّب كلمة بحث مختلفة أو تصفح قسماً آخر من المتجر.
          </p>
          <button
            onClick={() => {
              setQ("");
              setCat("all");
            }}
            className="mt-6 rounded-full bg-neutral-900 px-6 py-3 text-xs font-black text-white dark:bg-white dark:text-neutral-900"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  icon,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-black transition-all",
        active
          ? "border-neutral-900 bg-neutral-900 text-white shadow-lg shadow-neutral-900/20 dark:border-white dark:bg-white dark:text-neutral-900"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white/25"
      )}
    >
      {icon && (
        <ProductIcon
          name={icon}
          className={cn("size-3.5", active ? "" : "text-neutral-400")}
        />
      )}
      {label}
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[10px]",
          active
            ? "bg-white/20 dark:bg-black/15"
            : "bg-neutral-100 text-neutral-400 dark:bg-white/10"
        )}
      >
        {count}
      </span>
    </button>
  );
}
