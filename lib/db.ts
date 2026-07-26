import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL environment variable.')
}

export const sql = neon(process.env.DATABASE_URL)

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
