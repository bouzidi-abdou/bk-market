import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type Db = NodePgDatabase<typeof schema>;

let cachedPool: Pool | null = null;
let cachedDb: Db | null = null;

/**
 * Lazy initialization: importing this module NEVER touches the environment,
 * so `next build` page-data collection works on Netlify even before
 * DATABASE_URL is set. The connection is only created on the first real
 * database query (runtime), where the variable must exist.
 */
function init(): Db {
  if (cachedDb) return cachedDb;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is required — add it in Netlify → Site configuration → Environment variables."
    );
  }
  cachedPool = new Pool({
    connectionString: url,
    connectionTimeoutMillis: 10_000,
  });
  cachedDb = drizzle(cachedPool, { schema });
  return cachedDb;
}

const globalForDb = globalThis as typeof globalThis & {
  __bkMarketDb?: Db;
};

function getDb(): Db {
  // Cache across hot-reloads in dev via globalThis
  if (process.env.NODE_ENV !== "production") {
    if (!globalForDb.__bkMarketDb) globalForDb.__bkMarketDb = init();
    return globalForDb.__bkMarketDb;
  }
  return init();
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const instance = getDb();
    const value = Reflect.get(instance as object, prop);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(instance)
      : value;
  },
});
