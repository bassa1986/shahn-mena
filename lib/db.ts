import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL environment variable.')
}

const sql = neon(process.env.DATABASE_URL)

/**
 * Runs a query with automatic retries on transient connection failures
 * (timeouts, brief network blips). The @neondatabase/serverless driver
 * makes an HTTP request per query, which occasionally times out even on
 * a healthy connection — a bare failure was surfacing as a page-level
 * 404/empty-state for users on otherwise-successful requests. Retrying
 * once or twice with a short backoff absorbs that without callers having
 * to change their existing try/catch handling.
 */
export async function queryWithRetry<T = any>(
  queryText: string,
  params: any[] = [],
  retries = 2,
  delayMs = 300
): Promise<T[]> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return (await sql(queryText, params as any)) as T[]
    } catch (err) {
      lastError = err
      if (attempt < retries) {
        console.warn(
          `DB query failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delayMs}ms...`,
          err instanceof Error ? err.message : err
        )
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  }
  throw lastError
}

/**
 * Same retry behavior as queryWithRetry, but for callers using Neon's
 * tagged-template query style (sql`SELECT ... WHERE x = ${value}`)
 * instead of the function-call style with a separate params array.
 *
 * Used specifically for parameterized queries (WHERE slug = $1 etc.) —
 * the tagged-template form is Neon's primary, most-tested API path.
 * The function-call style with an explicit params array was observed to
 * reliably fail in production for parameterized queries specifically
 * (zero-parameter queries on the same driver/version worked fine), so
 * this isn't a style preference — it's a workaround for that.
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 300): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < retries) {
        console.warn(
          `DB query failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delayMs}ms...`,
          err instanceof Error ? err.message : err
        )
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  }
  throw lastError
}

export { sql }

export type Article = {
  id: string; title_ar: string; slug: string; excerpt_ar: string | null
  body_ar: string; category: string | null; seo_title: string | null
  seo_description: string | null; published: boolean; view_count: number
  created_at: string; updated_at: string
}
export type ChargingStation = {
  id: string; name: string; network_provider: string; country: string
  city: string; speed_kw: number; connector_type: string; lat: number; lng: number; status: string
}
export type Incentive = {
  id: string; country: string; title_ar: string; description_ar: string
  value: string; valid_until: string | null; source_url: string | null
}
export type TCOParams = {
  id: string; country: string; electricity_rate_kwh: number
  avg_fuel_price: number; updated_at: string
}
