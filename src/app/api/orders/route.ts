import { NextResponse, type NextRequest } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { env } from "@/lib/env";
import {
  getClientIp,
  rateLimit,
  sameOrigin,
  tooManyRequests,
} from "@/lib/security";

const PAYMENT_METHODS = new Set(["paypal", "crypto", "card", "balance"]);
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: orders.id,
      quantity: orders.quantity,
      unitPrice: orders.unitPrice,
      discount: orders.discount,
      total: orders.total,
      coupon: orders.coupon,
      paymentMethod: orders.paymentMethod,
      status: orders.status,
      createdAt: orders.createdAt,
      productName: products.name,
      productSlug: products.slug,
      productIcon: products.icon,
      productTint: products.tint,
    })
    .from(orders)
    .innerJoin(products, eq(orders.productId, products.id))
    .where(eq(orders.userId, session.id))
    .orderBy(desc(orders.createdAt))
    .limit(50);

  return NextResponse.json({ orders: rows });
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ message: "مصدر الطلب غير موثوق" }, { status: 403 });
  }
  const rl = rateLimit(
    `orders:${getClientIp(req)}`,
    env.RL_ORDERS.limit,
    env.RL_ORDERS.windowMs
  );
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized", message: "سجّل دخولك عبر ديسكورد أولاً لإتمام الشراء" },
      { status: 401 }
    );
  }

  let body: {
    productId?: string;
    quantity?: number;
    coupon?: string;
    paymentMethod?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "طلب غير صالح" }, { status: 400 });
  }

  const quantity = Math.min(Math.max(Number(body.quantity) || 1, 1), 10);
  const paymentMethod = PAYMENT_METHODS.has(body.paymentMethod ?? "")
    ? body.paymentMethod!
    : "paypal";

  if (!body.productId || !UUID_RE.test(body.productId)) {
    return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 });
  }

  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, body.productId))
      .limit(1);

    if (!product) {
      return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 });
    }
    if (product.stock < quantity) {
      return NextResponse.json(
        { message: "الكمية المطلوبة غير متوفرة حالياً" },
        { status: 409 }
      );
    }

    const unit = Number(product.price);
    const subtotal = unit * quantity;
    const couponCode = (body.coupon ?? "").trim().toUpperCase().slice(0, 24);
    const hasCoupon = couponCode === env.COUPON_CODE;
    const discount = hasCoupon ? subtotal * env.COUPON_PERCENT : 0;
    const total = Math.max(subtotal - discount, 0);

    const [order] = await db
      .insert(orders)
      .values({
        userId: session.id,
        productId: product.id,
        quantity,
        unitPrice: unit.toFixed(2),
        discount: discount.toFixed(2),
        total: total.toFixed(2),
        coupon: hasCoupon ? env.COUPON_CODE : null,
        paymentMethod,
        status: "processing",
      })
      .returning();

    await db
      .update(products)
      .set({
        stock: Math.max(0, product.stock - quantity),
        sales: product.sales + quantity,
      })
      .where(eq(products.id, product.id));

    return NextResponse.json({
      ok: true,
      order: {
        id: order.id,
        code: `BK-${order.id.slice(0, 8).toUpperCase()}`,
        quantity,
        total: total.toFixed(2),
        discount: discount.toFixed(2),
        coupon: hasCoupon ? env.COUPON_CODE : null,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "تعذّر إتمام الطلب حالياً — حاول بعد قليل" },
      { status: 500 }
    );
  }
}
