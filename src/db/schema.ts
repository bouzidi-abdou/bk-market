import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    discordId: text("discord_id").notNull().unique(),
    username: text("username").notNull(),
    globalName: text("global_name"),
    avatar: text("avatar"),
    email: text("email"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("users_discord_id_idx").on(t.discordId)]
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    nameEn: text("name_en"),
    description: text("description").notNull(),
    category: text("category").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    oldPrice: numeric("old_price", { precision: 10, scale: 2 }),
    icon: text("icon").notNull().default("Sparkles"),
    tint: text("tint").notNull().default("violet"),
    imageUrl: text("image_url"),
    badge: text("badge"),
    deliveryTime: text("delivery_time").notNull().default("فوري"),
    stock: integer("stock").notNull().default(250),
    rating: numeric("rating", { precision: 2, scale: 1 })
      .notNull()
      .default("5.0"),
    sales: integer("sales").notNull().default(0),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("products_category_idx").on(t.category),
    index("products_featured_idx").on(t.featured),
  ]
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    discount: numeric("discount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    total: numeric("total", { precision: 10, scale: 2 }).notNull(),
    coupon: text("coupon"),
    paymentMethod: text("payment_method").notNull().default("paypal"),
    status: text("status").notNull().default("processing"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("orders_user_idx").on(t.userId)]
);

export const visits = pgTable(
  "visits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    path: text("path").notNull().default("/"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("visits_created_idx").on(t.createdAt)]
);

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Visit = typeof visits.$inferSelect;
