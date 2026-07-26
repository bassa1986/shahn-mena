// scripts/scrapers/incentives-scraper.js
//
// Despite living in the "scrapers" folder, this does not fetch anything
// from government websites. EV incentive programs (customs exemptions,
// registration fee waivers, etc.) are announced irregularly via press
// releases and ministry pages with no consistent structure to parse
// reliably — attempting to scrape them would break constantly and,
// worse, could silently show wrong incentive terms to someone deciding
// whether to buy a car. That's a worse failure mode than admitting this
// is manually maintained.
//
// What this script actually does: takes the reviewed list below and
// syncs it to the database on a schedule, so a data edit here plus a
// commit is enough to update the live site without a manual DB write.
// The LAST_REVIEWED date is the thing that matters — if it's more than
// a few months old, the entries below need a human to re-check the
// source_url links before anyone trusts the "value" field.

import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../../.env.local') })

const sql = neon(process.env.DATABASE_URL)

const LAST_REVIEWED = '2026-07-01' // update this whenever the list below is actually re-checked

const INCENTIVES = [
  // --- Saudi Arabia ---
  {
    country: 'SA',
    title_ar: 'إعفاء جمركي على استيراد السيارات الكهربائية',
    description_ar: 'إعفاء كامل من الرسوم الجمركية عند استيراد السيارات الكهربائية الجديدة للاستخدام الشخصي.',
    value: 'إعفاء 100٪',
    valid_until: null, // open-ended policy, not a time-limited promotion
    source_url: 'https://zatca.gov.sa',
  },
  {
    country: 'SA',
    title_ar: 'دعم تركيب الشاحن المنزلي',
    description_ar: 'دعم مالي يصل إلى 5,000 ريال لتركيب شاحن منزلي بقدرة تصل إلى 22 كيلوواط.',
    value: 'حتى 5,000 ر.س',
    valid_until: '2027-12-31',
    source_url: 'https://www.energy.gov.sa',
  },
  {
    country: 'SA',
    title_ar: 'إعفاء من رسوم الترخيص السنوية',
    description_ar: 'إعفاء من رسوم الترخيص لمدة 5 سنوات من تاريخ أول تسجيل، قابل للتجديد.',
    value: 'إعفاء 5 سنوات',
    valid_until: '2027-12-31',
    source_url: 'https://www.moi.gov.sa',
  },
  {
    country: 'SA',
    title_ar: 'خصم على رسوم الفحص الدوري',
    description_ar: 'خصم 50٪ على رسوم الفحص الدوري لجميع السيارات الكهربائية المسجلة.',
    value: 'خصم 50٪',
    valid_until: null,
    source_url: 'https://www.moi.gov.sa',
  },

  // --- UAE ---
  {
    country: 'AE',
    title_ar: 'إعفاء رسوم التسجيل — أبوظبي',
    description_ar: 'أبوظبي تعفي أصحاب السيارات الكهربائية من رسوم التسجيل السنوية.',
    value: 'إعفاء دائم',
    valid_until: null,
    source_url: 'https://www.dmt.gov.ae',
  },
  {
    country: 'AE',
    title_ar: 'تصاريح ووقوف مجانية للسيارات الكهربائية',
    description_ar: 'وقوف مجاني في مواقف البلديات والمراكز التجارية المعتمدة في دبي وأبوظبي.',
    value: 'وقوف مجاني',
    valid_until: '2027-06-30',
    source_url: 'https://www.dm.gov.ae',
  },
  {
    country: 'AE',
    title_ar: 'شحن مدعوم عبر شبكة DEWA الخضراء',
    description_ar: 'أسعار شحن مخفضة في محطات DEWA للمركبات الكهربائية المسجلة في دبي.',
    value: 'أسعار مخفضة',
    valid_until: '2027-12-31',
    source_url: 'https://www.dewa.gov.ae',
  },
  {
    country: 'AE',
    title_ar: 'خصم على رسوم الاستيراد الجمركي',
    description_ar: 'خصم على رسوم الجمارك عند استيراد سيارة كهربائية للاستخدام الشخصي.',
    value: 'خصم جزئي',
    valid_until: '2027-12-31',
    source_url: 'https://www.moei.gov.ae',
  },

  // --- Morocco ---
  {
    country: 'MA',
    title_ar: 'خفض ضريبة القيمة المضافة على السيارات الكهربائية',
    description_ar: 'خفض ضريبة القيمة المضافة على اقتناء السيارات الكهربائية الجديدة ضمن خطة التحول الطاقوي.',
    value: 'خفض TVA',
    valid_until: '2027-12-31',
    source_url: 'https://www.finances.gov.ma',
  },
  {
    country: 'MA',
    title_ar: 'برنامج توسيع محطات الشحن العامة',
    description_ar: 'برنامج حكومي لتمويل توسيع شبكة محطات الشحن العامة بدعم من صندوق التنمية الطاقوية.',
    value: 'برنامج بنية تحتية',
    valid_until: '2027-12-31',
    source_url: 'https://www.mtpnet.gov.ma',
  },
]

async function upsertIncentive(inc) {
  const existing = await sql`
    SELECT id FROM incentives WHERE country = ${inc.country} AND title_ar = ${inc.title_ar}
  `

  if (existing.length > 0) {
    await sql`
      UPDATE incentives SET
        description_ar = ${inc.description_ar},
        value = ${inc.value},
        valid_until = ${inc.valid_until},
        source_url = ${inc.source_url},
        reviewed_at = ${LAST_REVIEWED}
      WHERE id = ${existing[0].id}
    `
    return 'updated'
  }

  await sql`
    INSERT INTO incentives (id, country, title_ar, description_ar, value, valid_until, source_url, reviewed_at)
    VALUES (gen_random_uuid()::text, ${inc.country}, ${inc.title_ar}, ${inc.description_ar}, ${inc.value}, ${inc.valid_until}, ${inc.source_url}, ${LAST_REVIEWED})
  `
  return 'inserted'
}

async function run() {
  console.log('--- Incentives data sync (curated list, not a live scrape) ---')

  const reviewedDaysAgo = Math.floor((Date.now() - new Date(LAST_REVIEWED)) / 86400000)
  console.log(`List last reviewed: ${LAST_REVIEWED} (${reviewedDaysAgo} days ago)`)
  if (reviewedDaysAgo > 120) {
    console.warn('⚠ This list has not been manually re-checked in over 4 months. Verify source_url links still say what "value" claims before trusting this data.')
  }
  console.log('')

  let inserted = 0, updated = 0
  for (const inc of INCENTIVES) {
    const result = await upsertIncentive(inc)
    if (result === 'inserted') inserted++
    else updated++
  }

  console.log(`${inserted} inserted, ${updated} updated, ${INCENTIVES.length} total entries in curated list.`)
  console.log('Open-ended policies use valid_until = null and never expire on the site.')
  console.log('Time-limited items carry a real valid_until date and will be flagged as expired on the incentives page once passed.')
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Incentives sync failed:', err)
    process.exit(1)
  })
