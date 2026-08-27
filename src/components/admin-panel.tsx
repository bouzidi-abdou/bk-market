"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Image as ImageIcon,
  Loader2,
  Minus,
  Package,
  Plus,
  Sparkles,
  Star,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import IconTile from "./icon-tile";
import ProductIcon, { ICONS } from "./product-icon";
import { CATEGORIES, TINTS, cn } from "@/lib/utils";

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number | null;
  icon: string;
  tint: string;
  stock: number;
  sales: number;
  featured: boolean;
};

type Tab = "add" | "manage";

const ICON_KEYS = Object.keys(ICONS);
const TINT_KEYS = Object.keys(TINTS);

const inputCls =
  "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold outline-none transition placeholder:font-semibold placeholder:text-neutral-400 focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-white/10 dark:bg-neutral-900";
const labelCls = "mb-2 block text-xs font-black text-neutral-500 dark:text-neutral-400";

export default function AdminPanel({
  initialProducts,
}: {
  initialProducts: AdminProduct[];
}) {
  const [tab, setTab] = useState<Tab>("add");
  const [items, setItems] = useState(initialProducts);
  const router = useRouter();

  /* ---------- add form state ---------- */
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [form, setForm] = useState({
    name: "",
    nameEn: "",
    description: "",
    category: "cards",
    price: "",
    oldPrice: "",
    stock: "100",
    deliveryTime: "فوري",
    badge: "",
    tint: "violet",
    icon: "Sparkles",
    imageUrl: "",
    featured: false,
    features: "",
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ");
      setMsg({ ok: true, text: `تمت إضافة "${data.product.name}" إلى المتجر بنجاح` });
      setForm((f) => ({
        ...f,
        name: "",
        nameEn: "",
        description: "",
        price: "",
        oldPrice: "",
        badge: "",
        imageUrl: "",
        features: "",
      }));
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "حدث خطأ" });
    } finally {
      setBusy(false);
    }
  }

  /* ---------- manage actions ---------- */
  async function patch(id: string, payload: { stock?: number; featured?: boolean }) {
    setItems((list) => list.map((p) => (p.id === id ? { ...p, ...payload } : p)));
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
  }

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  async function remove(id: string) {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 2500);
      return;
    }
    setItems((list) => list.filter((p) => p.id !== id));
    setConfirmDelete(null);
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-neutral-200/80 bg-white shadow-xl shadow-neutral-900/[0.04] dark:border-white/[0.08] dark:bg-neutral-900/70">
      {/* tabs */}
      <div className="flex border-b border-neutral-100 dark:border-white/[0.06]">
        {(
          [
            { id: "add" as Tab, label: "إضافة منتج جديد", icon: Plus },
            { id: "manage" as Tab, label: `إدارة المنتجات (${items.length})`, icon: Package },
          ]
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-2.5 px-4 py-5 text-sm font-black transition",
              tab === id
                ? "text-accent"
                : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            )}
          >
            <Icon className="size-4.5" />
            {label}
            {tab === id && (
              <span className="absolute inset-x-6 bottom-0 h-[3px] rounded-full bg-accent" />
            )}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        {tab === "add" ? (
          /* ================= ADD FORM ================= */
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label className={labelCls}>اسم المنتج (عربي) *</label>
              <input
                className={inputCls}
                placeholder="مثال: بطاقة فيزا افتراضية $100"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>الاسم بالإنجليزية</label>
              <input
                className={inputCls}
                dir="ltr"
                placeholder="Virtual Visa $100"
                value={form.nameEn}
                onChange={(e) => set("nameEn", e.target.value)}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={labelCls}>الوصف *</label>
              <textarea
                className={cn(inputCls, "min-h-24 resize-y leading-7")}
                placeholder="وصف تسويقي واضح يشرح المنتج وطريقة التسليم…"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>القسم *</label>
              <select
                className={cn(inputCls, "cursor-pointer appearance-none")}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {Object.entries(CATEGORIES).map(([k, c]) => (
                  <option key={k} value={k}>
                    {c.ar}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>شارة مميزة (اختياري)</label>
              <input
                className={inputCls}
                placeholder="الأكثر مبيعاً / نادر / جديد"
                value={form.badge}
                onChange={(e) => set("badge", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>السعر $ *</label>
                <input
                  className={inputCls}
                  dir="ltr"
                  inputMode="decimal"
                  placeholder="9.99"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value.replace(/[^\d.]/g, ""))}
                />
              </div>
              <div>
                <label className={labelCls}>قبل الخصم $</label>
                <input
                  className={inputCls}
                  dir="ltr"
                  inputMode="decimal"
                  placeholder="19.99"
                  value={form.oldPrice}
                  onChange={(e) => set("oldPrice", e.target.value.replace(/[^\d.]/g, ""))}
                />
              </div>
              <div>
                <label className={labelCls}>العدد المتوفر *</label>
                <input
                  className={inputCls}
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="100"
                  value={form.stock}
                  onChange={(e) => set("stock", e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>مدة التسليم</label>
              <input
                className={inputCls}
                placeholder="فوري — 5 دقائق"
                value={form.deliveryTime}
                onChange={(e) => set("deliveryTime", e.target.value)}
              />
            </div>

            <div className="lg:col-span-2">
              <label className={labelCls}>رابط الصورة (اختياري — تظهر كغلاف للمنتج)</label>
              <div className="relative">
                <ImageIcon className="absolute start-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <input
                  className={cn(inputCls, "ps-10")}
                  dir="ltr"
                  placeholder="https://example.com/product.png"
                  value={form.imageUrl}
                  onChange={(e) => set("imageUrl", e.target.value)}
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className={labelCls}>اختر الأيقونة</label>
              <div className="grid max-h-44 grid-cols-6 gap-2 overflow-y-auto rounded-2xl border border-neutral-200 p-3 sm:grid-cols-9 dark:border-white/10" data-lenis-prevent>
                {ICON_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => set("icon", k)}
                    title={k}
                    className={cn(
                      "grid aspect-square place-items-center rounded-xl border transition",
                      form.icon === k
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-neutral-600 dark:border-white/10 dark:hover:text-neutral-200"
                    )}
                  >
                    <ProductIcon name={k} className="size-4.5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className={labelCls}>لون المنتج</label>
              <div className="flex flex-wrap gap-2.5">
                {TINT_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => set("tint", k)}
                    aria-label={k}
                    className={cn(
                      "grid size-10 place-items-center rounded-full transition",
                      TINTS[k].solid,
                      form.tint === k
                        ? "scale-110 ring-2 ring-neutral-900 ring-offset-2 dark:ring-white dark:ring-offset-neutral-900"
                        : "opacity-50 hover:opacity-90"
                    )}
                  >
                    {form.tint === k && <Check className="size-4.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className={labelCls}>المميزات (كل ميزة في سطر)</label>
              <textarea
                className={cn(inputCls, "min-h-24 resize-y leading-7")}
                placeholder={"تسليم فوري خلال دقائق\nضمان استبدال 30 يوم\nدعم فني على مدار الساعة"}
                value={form.features}
                onChange={(e) => set("features", e.target.value)}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-neutral-200 p-4 transition hover:border-accent/40 dark:border-white/10 lg:col-span-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="size-4.5 accent-accent"
              />
              <Star className={cn("size-4.5", form.featured ? "fill-amber-400 text-amber-400" : "text-neutral-300")} />
              <span className="text-sm font-black">منتج مميز — يظهر في مقدمة المتجر</span>
            </label>

            {msg && (
              <p
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-black lg:col-span-2",
                  msg.ok
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-rose-500/10 text-rose-500"
                )}
              >
                {msg.ok ? <Check className="size-4" /> : <TriangleAlert className="size-4" />}
                {msg.text}
              </p>
            )}

            <button
              onClick={submit}
              disabled={busy}
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-neutral-900 py-4 text-sm font-black text-white transition hover:bg-neutral-700 disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 lg:col-span-2"
            >
              {busy ? <Loader2 className="size-4.5 animate-spin" /> : <Plus className="size-4.5" />}
              نشر المنتج في المتجر
            </button>
          </div>
        ) : (
          /* ================= MANAGE LIST ================= */
          <div className="space-y-3">
            {items.length === 0 && (
              <p className="py-12 text-center text-sm font-bold text-neutral-400">
                لا توجد منتجات — أضف أول منتج من التبويب المجاور.
              </p>
            )}
            {items.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-neutral-200/70 p-4 transition hover:border-neutral-300 dark:border-white/[0.07] dark:hover:border-white/15"
              >
                <IconTile name={p.icon} tint={p.tint} size="sm" />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-black">{p.name}</h4>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[10px] font-bold text-neutral-400">
                    <span>{CATEGORIES[p.category]?.ar}</span>
                    <span>•</span>
                    <span className="font-display">${p.price.toFixed(2)}</span>
                    <span>•</span>
                    <span>{p.sales.toLocaleString("en")} مبيعة</span>
                  </p>
                </div>

                {/* stock stepper */}
                <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-2 py-1.5 dark:border-white/10">
                  <button
                    onClick={() => patch(p.id, { stock: Math.max(0, p.stock - 1) })}
                    className="grid size-6 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white"
                    aria-label="إنقاص"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className={cn("min-w-10 text-center font-display text-xs font-bold", p.stock < 10 && "text-amber-500")}>
                    {p.stock}
                  </span>
                  <button
                    onClick={() => patch(p.id, { stock: p.stock + 1 })}
                    className="grid size-6 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white"
                    aria-label="زيادة"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <span className="text-[10px] font-black text-neutral-400">المخزون</span>

                <button
                  onClick={() => patch(p.id, { featured: !p.featured })}
                  aria-label="تمييز"
                  className={cn(
                    "grid size-9 place-items-center rounded-full border transition",
                    p.featured
                      ? "border-amber-400/50 bg-amber-400/10 text-amber-400"
                      : "border-neutral-200 text-neutral-300 hover:text-amber-400 dark:border-white/10"
                  )}
                >
                  <Star className={cn("size-4", p.featured && "fill-amber-400")} />
                </button>

                <button
                  onClick={() => remove(p.id)}
                  className={cn(
                    "grid h-9 place-items-center rounded-full border px-3 text-[10px] font-black transition",
                    confirmDelete === p.id
                      ? "border-rose-500 bg-rose-500 text-white"
                      : "border-neutral-200 text-neutral-400 hover:border-rose-300 hover:text-rose-500 dark:border-white/10"
                  )}
                >
                  {confirmDelete === p.id ? (
                    "تأكيد الحذف؟"
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
