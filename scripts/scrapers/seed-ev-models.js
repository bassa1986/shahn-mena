// scripts/scrapers/seed-ev-models.js
//
// This is a one-time (or edit-and-rerun) seed script, not a scheduled
// job. Model specs, prices, and pros/cons don't change on a schedule —
// they change when a manufacturer announces something, which is a
// manual edit-this-file-and-run event. Run it whenever the list below
// changes; there's no cron for this one.
//
// Prices and specs below are the same values that were previously
// hardcoded directly in app/models/page.tsx — moved here so updating
// them is a data edit + script run instead of a code change + redeploy.
// Re-verify prices before trusting them; they age the same way the
// incentives list does. reviewed_at tracks that the same way.

import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../../.env.local') })

const sql = neon(process.env.DATABASE_URL)

const REVIEWED_AT = '2026-07-01' // update whenever prices/specs below are actually re-checked

const MODELS = [
  {
    slug: 'lucid-air',
    brand: 'Lucid',
    name_ar: 'لوسيد إير',
    badge_ar: 'الأفضل في الحر',
    range_km: 728,
    range_hot_km: 620,
    charge_speed_kw: 300,
    heat_loss_pct: 15,
    price_sar: 395000,
    pros_ar: ['الأطول مدىً خليجياً', 'تبريد استثنائي في 50°C', 'شحن 300kW فائق السرعة'],
    cons_ar: ['سعر مرتفع', 'شبكة صيانة محدودة'],
    syarah_url: 'https://syarah.com?utm_source=shahnamena&utm_medium=affiliate&utm_campaign=lucid-air',
    dubizzle_url: 'https://uae.dubizzle.com/motors/?utm_source=shahnamena&utm_medium=affiliate',
    display_order: 1,
  },
  {
    slug: 'byd-seal',
    brand: 'BYD',
    name_ar: 'بي واي دي سيل',
    badge_ar: 'الأفضل قيمةً',
    range_km: 524,
    range_hot_km: 480,
    charge_speed_kw: 150,
    heat_loss_pct: 8,
    price_sar: 155000,
    pros_ar: ['خسارة 8٪ فقط في الحر', 'سعر تنافسي', 'ضمان بطارية 8 سنوات'],
    cons_ar: ['شبكة شحن محدودة خليجياً'],
    syarah_url: 'https://syarah.com?utm_source=shahnamena&utm_medium=affiliate&utm_campaign=byd-seal',
    dubizzle_url: 'https://uae.dubizzle.com/motors/?utm_source=shahnamena&utm_medium=affiliate',
    display_order: 2,
  },
  {
    slug: 'tesla-model-3',
    brand: 'Tesla',
    name_ar: 'تسلا موديل 3',
    badge_ar: 'الأوسع انتشاراً',
    range_km: 629,
    range_hot_km: 500,
    charge_speed_kw: 250,
    heat_loss_pct: 20,
    price_sar: 195000,
    pros_ar: ['شبكة Supercharger واسعة', 'تحديثات OTA مستمرة'],
    cons_ar: ['خسارة 20٪ في الصيف'],
    syarah_url: 'https://syarah.com?utm_source=shahnamena&utm_medium=affiliate&utm_campaign=tesla-model3',
    dubizzle_url: 'https://uae.dubizzle.com/motors/?utm_source=shahnamena&utm_medium=affiliate',
    display_order: 3,
  },
  {
    slug: 'hyundai-ioniq6',
    brand: 'Hyundai',
    name_ar: 'هيونداي IONIQ 6',
    badge_ar: 'الأسرع شحناً',
    range_km: 614,
    range_hot_km: 390,
    charge_speed_kw: 220,
    heat_loss_pct: 37,
    price_sar: 185000,
    pros_ar: ['شحن 10-80٪ في 18 دقيقة'],
    cons_ar: ['خسارة 37٪ في 45°C'],
    syarah_url: 'https://syarah.com?utm_source=shahnamena&utm_medium=affiliate&utm_campaign=ioniq6',
    dubizzle_url: 'https://uae.dubizzle.com/motors/?utm_source=shahnamena&utm_medium=affiliate',
    display_order: 4,
  },
  {
    slug: 'kia-ev6',
    brand: 'Kia',
    name_ar: 'كيا EV6',
    badge_ar: 'الأكثر ديناميكية',
    range_km: 528,
    range_hot_km: 390,
    charge_speed_kw: 230,
    heat_loss_pct: 36,
    price_sar: 178000,
    pros_ar: ['أداء رياضي ممتاز'],
    cons_ar: ['خسارة مدى عالية في الحر'],
    syarah_url: 'https://syarah.com?utm_source=shahnamena&utm_medium=affiliate&utm_campaign=kia-ev6',
    dubizzle_url: 'https://uae.dubizzle.com/motors/?utm_source=shahnamena&utm_medium=affiliate',
    display_order: 5,
  },
  {
    slug: 'mg4',
    brand: 'MG',
    name_ar: 'إم جي 4',
    badge_ar: 'الأوفر للميزانية',
    range_km: 520,
    range_hot_km: 400,
    charge_speed_kw: 140,
    heat_loss_pct: 23,
    price_sar: 128000,
    pros_ar: ['أرخص سعر', 'ضمان 7 سنوات'],
    cons_ar: ['شبكة شحن محدودة'],
    syarah_url: 'https://syarah.com?utm_source=shahnamena&utm_medium=affiliate&utm_campaign=mg4',
    dubizzle_url: 'https://uae.dubizzle.com/motors/?utm_source=shahnamena&utm_medium=affiliate',
    display_order: 6,
  },
]

async function upsertModel(m) {
  const existing = await sql`SELECT id FROM ev_models WHERE slug = ${m.slug}`

  if (existing.length > 0) {
    await sql`
      UPDATE ev_models SET
        brand = ${m.brand},
        name_ar = ${m.name_ar},
        badge_ar = ${m.badge_ar},
        range_km = ${m.range_km},
        range_hot_km = ${m.range_hot_km},
        charge_speed_kw = ${m.charge_speed_kw},
        heat_loss_pct = ${m.heat_loss_pct},
        price_sar = ${m.price_sar},
        pros_ar = ${m.pros_ar},
        cons_ar = ${m.cons_ar},
        syarah_url = ${m.syarah_url},
        dubizzle_url = ${m.dubizzle_url},
        display_order = ${m.display_order},
        reviewed_at = ${REVIEWED_AT},
        updated_at = NOW()
      WHERE slug = ${m.slug}
    `
    return 'updated'
  }

  await sql`
    INSERT INTO ev_models
      (id, slug, brand, name_ar, badge_ar, range_km, range_hot_km, charge_speed_kw,
       heat_loss_pct, price_sar, pros_ar, cons_ar, syarah_url, dubizzle_url,
       display_order, reviewed_at)
    VALUES
      (gen_random_uuid()::text, ${m.slug}, ${m.brand}, ${m.name_ar}, ${m.badge_ar},
       ${m.range_km}, ${m.range_hot_km}, ${m.charge_speed_kw}, ${m.heat_loss_pct},
       ${m.price_sar}, ${m.pros_ar}, ${m.cons_ar}, ${m.syarah_url}, ${m.dubizzle_url},
       ${m.display_order}, ${REVIEWED_AT})
  `
  return 'inserted'
}

async function run() {
  console.log('--- EV models seed ---')
  const age = Math.floor((Date.now() - new Date(REVIEWED_AT)) / 86400000)
  console.log(`Specs/prices last reviewed: ${REVIEWED_AT} (${age} days ago)`)
  if (age > 120) console.warn('⚠ Over 4 months since prices were checked — verify before trusting price_sar values.')
  console.log('')

  let inserted = 0, updated = 0
  for (const m of MODELS) {
    const result = await upsertModel(m)
    if (result === 'inserted') inserted++
    else updated++
    console.log(`${result}: ${m.slug}`)
  }
  console.log(`\n${inserted} inserted, ${updated} updated.`)
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
