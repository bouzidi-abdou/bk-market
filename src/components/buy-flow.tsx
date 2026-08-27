"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgePercent,
  Bitcoin,
  Check,
  CheckCircle2,
  Coins,
  Copy,
  CreditCard,
  Loader2,
  Lock,
  Minus,
  Package,
  PartyPopper,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Timer,
  Wallet,
  X,
} from "lucide-react";
import DiscordIcon from "./discord-icon";
import LoginModal from "./login-modal";
import IconTile from "./icon-tile";
import { cn, COUPON_CODE } from "@/lib/utils";

type FlowProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  deliveryTime: string;
  icon: string;
  tint: string;
};

type Stage = "idle" | "checkout" | "processing" | "success" | "error";

const METHODS = [
  { id: "paypal", label: "PayPal", sub: "الأكثر استخداماً", icon: Wallet },
  { id: "crypto", label: "كريبتو USDT", sub: "شبكة TRC20", icon: Bitcoin },
  { id: "card", label: "بطاقة بنكية", sub: "فيزا / ماستركارد", icon: CreditCard },
  { id: "balance", label: "رصيد المتجر", sub: "رصيد حسابك", icon: Coins },
] as const;

const STEPS = [
  "التحقق من توفّر المنتج في المخزون",
  "تأكيد عملية الدفع بشكل آمن",
  "إنشاء تذكرة التسليم في الديسكورد",
];

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function BuyFlow({ product }: { product: FlowProduct }) {
  const [me, setMe] = useState<{
    user: unknown;
    configured: boolean;
  } | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState<string>("paypal");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe({ user: null, configured: false }));
  }, []);

  const subtotal = useMemo(() => product.price * qty, [product.price, qty]);
  const discount = coupon ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  function startCheckout() {
    if (!me) return;
    if (!me.user) {
      setLoginOpen(true);
      return;
    }
    setStage("checkout");
  }

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (code === COUPON_CODE) {
      setCoupon(COUPON_CODE);
      setCouponMsg("تم تطبيق كود الخصم — خصم 10% أُضيف لطلبك");
    } else {
      setCoupon(null);
      setCouponMsg(`كود غير صالح، جرّب ${COUPON_CODE}`);
    }
  }

  async function confirmOrder() {
    setStage("processing");
    setStep(0);
    const stepTimer1 = setTimeout(() => setStep(1), 750);
    const stepTimer2 = setTimeout(() => setStep(2), 1450);

    try {
      const req = fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: qty,
          coupon: coupon ?? undefined,
          paymentMethod: method,
        }),
      });
      const [res] = await Promise.all([req, delay(2100)]);
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "حدث خطأ غير متوقع");
      }
      setOrderCode(data.order.code);
      setOrderTotal(data.order.total);
      setStage("success");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "حدث خطأ غير متوقع");
      setStage("error");
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
    }
  }

  function closeAll() {
    if (stage === "processing") return;
    setStage("idle");
    setCoupon(null);
    setCouponInput("");
    setCouponMsg(null);
  }

  return (
    <>
      <button
        onClick={startCheckout}
        disabled={!me}
        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-neutral-900 px-8 py-4.5 text-base font-black text-white shadow-xl shadow-neutral-900/20 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-wait disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:shadow-white/5"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full dark:via-black/10" />
        {!me ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <ShoppingCart className="size-5" />
        )}
        اشترِ الآن — ${product.price.toFixed(2)}
      </button>
      <p className="mt-3 flex items-center justify-center gap-2 text-[11px] font-bold text-neutral-400">
        <Lock className="size-3.5" />
        تسجيل الدخول عبر ديسكورد مطلوب لإتمام الشراء
      </p>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        next={pathname || `/product/${product.slug}`}
        configured={me?.configured ?? false}
        title="خطوة واحدة تفصلك عن الشراء"
        subtitle="سجّل دخولك بحساب الديسكورد لإتمام طلبك واستلامه فوراً"
      />

      <AnimatePresence>
        {stage !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-4"
            onClick={closeAll}
            data-lenis-prevent
          >
            <div className="absolute inset-0 bg-neutral-950/55 backdrop-blur-md" />

            <motion.div
              initial={{ opacity: 0, y: 90, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[2rem] border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 sm:rounded-[2rem]"
            >
              {/* header */}
              <div className="relative flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <IconTile name={product.icon} tint={product.tint} size="sm" />
                  <div>
                    <h3 className="text-sm font-black">
                      {stage === "success"
                        ? "تم استلام طلبك"
                        : stage === "processing"
                          ? "جاري معالجة طلبك"
                          : "إتمام عملية الشراء"}
                    </h3>
                    <p className="text-[11px] font-bold text-neutral-400">
                      {product.name}
                    </p>
                  </div>
                </div>
                {stage !== "processing" && (
                  <button
                    onClick={closeAll}
                    aria-label="إغلاق"
                    className="grid size-9 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="overflow-y-auto p-6">
                {/* ---------- CHECKOUT ---------- */}
                {stage === "checkout" && (
                  <div className="space-y-6">
                    {/* qty */}
                    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4 dark:border-white/10">
                      <span className="text-sm font-black">الكمية</span>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="grid size-9 place-items-center rounded-full border border-neutral-200 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-white/15 dark:hover:border-white dark:hover:bg-white dark:hover:text-neutral-900"
                          aria-label="تقليل"
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="font-display w-6 text-center text-lg font-bold">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty((q) => Math.min(10, q + 1))}
                          className="grid size-9 place-items-center rounded-full border border-neutral-200 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-white/15 dark:hover:border-white dark:hover:bg-white dark:hover:text-neutral-900"
                          aria-label="زيادة"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* payment */}
                    <div>
                      <p className="mb-3 text-sm font-black">طريقة الدفع</p>
                      <div className="grid grid-cols-2 gap-3">
                        {METHODS.map(({ id, label, sub, icon: Icon }) => (
                          <button
                            key={id}
                            onClick={() => setMethod(id)}
                            className={cn(
                              "relative flex items-center gap-3 rounded-2xl border p-3.5 text-start transition",
                              method === id
                                ? "border-accent bg-accent/[0.06] ring-1 ring-accent/40"
                                : "border-neutral-200 hover:border-neutral-300 dark:border-white/10 dark:hover:border-white/20"
                            )}
                          >
                            <Icon
                              className={cn(
                                "size-5",
                                method === id ? "text-accent" : "text-neutral-400"
                              )}
                            />
                            <span>
                              <b className="block text-xs font-black">{label}</b>
                              <span className="text-[10px] font-bold text-neutral-400">
                                {sub}
                              </span>
                            </span>
                            {method === id && (
                              <motion.span
                                layoutId="pay-check"
                                className="absolute -top-1.5 -start-1.5 grid size-5 place-items-center rounded-full bg-accent text-white"
                              >
                                <Check className="size-3" />
                              </motion.span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* coupon */}
                    <div>
                      <p className="mb-3 text-sm font-black">كود الخصم</p>
                      <div className="flex gap-2" dir="ltr">
                        <div className="relative flex-1">
                          <BadgePercent className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                          <input
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="BK10"
                            className="w-full rounded-2xl border border-neutral-200 bg-transparent py-3 ps-10 pe-4 font-display text-sm font-bold uppercase tracking-widest outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-white/10"
                          />
                        </div>
                        <button
                          onClick={applyCoupon}
                          className="rounded-2xl bg-neutral-900 px-5 text-xs font-black text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                          تطبيق
                        </button>
                      </div>
                      {couponMsg && (
                        <p
                          className={cn(
                            "mt-2 text-[11px] font-bold",
                            coupon ? "text-emerald-500" : "text-rose-500"
                          )}
                        >
                          {couponMsg}
                        </p>
                      )}
                    </div>

                    {/* summary */}
                    <div className="space-y-2.5 rounded-2xl bg-neutral-50 p-5 text-sm dark:bg-white/[0.03]">
                      <div className="flex justify-between font-bold text-neutral-500 dark:text-neutral-400">
                        <span>سعر الوحدة</span>
                        <span className="font-display">${product.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-neutral-500 dark:text-neutral-400">
                        <span>الكمية</span>
                        <span className="font-display">×{qty}</span>
                      </div>
                      {coupon && (
                        <div className="flex justify-between font-bold text-emerald-500">
                          <span>خصم BK10 (10%)</span>
                          <span className="font-display">-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-neutral-500 dark:text-neutral-400">
                        <span>رسوم المعالجة</span>
                        <span className="text-emerald-500">مجاناً</span>
                      </div>
                      <div className="my-2 border-t border-dashed border-neutral-200 dark:border-white/10" />
                      <div className="flex items-center justify-between">
                        <span className="font-black">الإجمالي</span>
                        <motion.span
                          key={total}
                          initial={{ scale: 1.15, color: "#5865f2" }}
                          animate={{ scale: 1, color: "inherit" }}
                          className="font-display text-2xl font-bold"
                        >
                          ${total.toFixed(2)}
                        </motion.span>
                      </div>
                      <p className="flex items-center gap-1.5 pt-1 text-[11px] font-bold text-neutral-400">
                        <Timer className="size-3.5 text-emerald-500" />
                        التسليم المتوقع: {product.deliveryTime}
                      </p>
                    </div>

                    <button
                      onClick={confirmOrder}
                      className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-accent px-8 py-4 text-base font-black text-white shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accent-dark"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <Lock className="size-4.5" />
                      تأكيد الطلب والدفع — ${total.toFixed(2)}
                    </button>
                    <p className="flex items-center justify-center gap-2 text-[10px] font-bold text-neutral-400">
                      <ShieldCheck className="size-3.5 text-emerald-500" />
                      معاملة مشفرة وآمنة — بضغطك على تأكيد توافق على شروط الاستخدام
                    </p>
                  </div>
                )}

                {/* ---------- PROCESSING ---------- */}
                {stage === "processing" && (
                  <div className="py-6">
                    <div className="relative mx-auto mb-8 grid size-24 place-items-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-accent/15" />
                      <span className="absolute inset-2 animate-pulse rounded-full bg-accent/10" />
                      <span className="grid size-16 place-items-center rounded-full bg-accent text-white shadow-xl shadow-accent/40">
                        <Loader2 className="size-7 animate-spin" />
                      </span>
                    </div>
                    <div className="mx-auto max-w-xs space-y-4">
                      {STEPS.map((label, i) => (
                        <div key={label} className="flex items-center gap-3">
                          <span
                            className={cn(
                              "grid size-7 place-items-center rounded-full border transition-all duration-500",
                              i < step
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : i === step
                                  ? "border-accent bg-accent/10 text-accent"
                                  : "border-neutral-200 text-neutral-300 dark:border-white/10 dark:text-neutral-600"
                            )}
                          >
                            {i < step ? (
                              <Check className="size-3.5" />
                            ) : i === step ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <span className="size-1.5 rounded-full bg-current" />
                            )}
                          </span>
                          <span
                            className={cn(
                              "text-sm font-bold transition-colors duration-500",
                              i <= step
                                ? "text-neutral-800 dark:text-neutral-100"
                                : "text-neutral-400 dark:text-neutral-600"
                            )}
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ---------- SUCCESS ---------- */}
                {stage === "success" && (
                  <div className="py-4 text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16 }}
                      className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30"
                    >
                      <PartyPopper className="size-9" />
                    </motion.div>
                    <h4 className="mt-6 text-xl font-black">تم تأكيد طلبك بنجاح</h4>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-neutral-500 dark:text-neutral-400">
                      سيتم تسليم طلبك عبر رسالة خاصة + تذكرة داخل سيرفر الديسكورد
                      خلال:{" "}
                      <b className="text-neutral-900 dark:text-white">
                        {product.deliveryTime}
                      </b>
                    </p>

                    <div className="mx-auto mt-6 flex max-w-xs items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-neutral-200 p-4 dark:border-white/15">
                      <div className="text-start">
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          رقم الطلب
                        </p>
                        <p className="font-display text-lg font-bold tracking-wider">
                          {orderCode}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(orderCode);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1600);
                        }}
                        className="grid size-11 place-items-center rounded-xl bg-neutral-900 text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
                        aria-label="نسخ رقم الطلب"
                      >
                        {copied ? <Check className="size-4.5" /> : <Copy className="size-4.5" />}
                      </button>
                    </div>

                    <div className="mx-auto mt-4 flex max-w-xs justify-between rounded-2xl bg-neutral-50 p-4 text-sm font-bold dark:bg-white/[0.03]">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        إجمالي المدفوع
                      </span>
                      <span className="font-display text-base font-bold text-emerald-500">
                        ${orderTotal}
                      </span>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Link
                        href="/account"
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-3.5 text-sm font-black text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
                      >
                        <Package className="size-4" />
                        تتبّع طلباتي
                      </Link>
                      <button
                        onClick={closeAll}
                        className="flex-1 rounded-2xl border border-neutral-200 py-3.5 text-sm font-black transition hover:bg-neutral-50 dark:border-white/10 dark:hover:bg-white/5"
                      >
                        متابعة التسوق
                      </button>
                    </div>
                    <p className="mt-4 flex items-center justify-center gap-2 text-[11px] font-bold text-neutral-400">
                      <DiscordIcon className="size-3.5 text-accent" />
                      تأكد من فتح الرسائل الخاصة (DMs) في حسابك لاستلام الطلب
                    </p>
                  </div>
                )}

                {/* ---------- ERROR ---------- */}
                {stage === "error" && (
                  <div className="py-8 text-center">
                    <div className="mx-auto grid size-16 place-items-center rounded-full bg-rose-500/10 text-rose-500">
                      <X className="size-8" />
                    </div>
                    <h4 className="mt-5 text-lg font-black">تعذّر إتمام الطلب</h4>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                      {errorMsg}
                    </p>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setStage("checkout")}
                        className="flex-1 rounded-2xl bg-neutral-900 py-3.5 text-sm font-black text-white dark:bg-white dark:text-neutral-900"
                      >
                        حاول مجدداً
                      </button>
                      <button
                        onClick={closeAll}
                        className="flex-1 rounded-2xl border border-neutral-200 py-3.5 text-sm font-black dark:border-white/10"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {stage === "checkout" && (
                <div className="flex items-center justify-center gap-2 border-t border-neutral-100 py-3 text-[11px] font-bold text-neutral-400 dark:border-white/[0.06]">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  ضمان BK MARKET يحمي أموالك حتى استلام المنتج كاملاً
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
