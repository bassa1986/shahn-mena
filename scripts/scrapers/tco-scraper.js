// scripts/scrapers/tco-scraper.js
//
// Electricity rates (SA/AE/MA) are regulated tariffs that don't have a
// scrapeable public page with a stable structure — these stay as
// maintained constants below, reviewed manually. That's stated plainly
// here rather than dressed up as a live fetch.
//
// Fuel prices DO have public pages that change monthly. This script
// makes a real attempt to fetch and parse Saudi Arabia's price, and
// falls back to the last-known constant if the fetch or parse fails
// for any reason (site redesign, network block, etc). Every run logs
// which one actually happened — check the workflow logs, don't assume.

import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../../.env.local') })

const sql = neon(process.env.DATABASE_URL)

// Reviewed manually — last checked 2026-07. Update when tariffs change.
const ELECTRICITY_RATE_KWH = {
  SA: 0.18, // SEC residential tariff, SAR/kWh
  AE: 0.38, // DEWA residential tariff, AED/kWh
  MA: 1.10, // ONEE residential tariff, MAD/kWh
}

// Fallback fuel prices — used only if the live fetch below fails.
// Reviewed manually — last checked 2026-07.
const FUEL_PRICE_FALLBACK = {
  SA: 2.18, // SAR/L, 91 octane
  AE: 2.90, // AED/L, Special 95
  MA: 13.50, // MAD/L, Sans Plomb
}

async function tryFetchSaudiFuelPrice() {
  // Aramco publishes monthly retail fuel prices. This is a best-effort
  // parse of their public price page — it WILL break if they change
  // their HTML structure, and that's fine: it just falls back below.
  try {
    const res = await fetch('https://www.aramco.com/en/what-we-do/downstream/domestic-fuel-marketing', {
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const html = await res.text()

    // Look for a price pattern like "2.18 SAR/Litre" near "91"
    const match = html.match(/91[^\d]{0,40}(\d\.\d{2})/)
    if (match) {
      const price = parseFloat(match[1])
      if (price > 1 && price < 5) {
        return { price, source: 'live-fetch' }
      }
    }
    throw new Error('price pattern not found in page')
  } catch (err) {
    return { price: null, source: 'fallback', reason: err.message }
  }
}

async function upsertTCOParams(country, electricityRate, fuelPrice, fuelSource) {
  const existing = await sql`SELECT id FROM tco_params WHERE country = ${country}`

  if (existing.length > 0) {
    await sql`
      UPDATE tco_params
      SET electricity_rate_kwh = ${electricityRate},
          avg_fuel_price = ${fuelPrice},
          updated_at = NOW()
      WHERE country = ${country}
    `
  } else {
    await sql`
      INSERT INTO tco_params (id, country, electricity_rate_kwh, avg_fuel_price, updated_at)
      VALUES (gen_random_uuid()::text, ${country}, ${electricityRate}, ${fuelPrice}, NOW())
    `
  }
  console.log(`[${country}] electricity=${electricityRate} fuel=${fuelPrice} (fuel source: ${fuelSource})`)
}

async function run() {
  console.log('--- TCO params sync ---')
  console.log('Electricity rates: manually-maintained constants (regulated tariffs, no stable public scrape target)')
  console.log('Fuel prices: attempting live fetch where possible, falling back to reviewed constants otherwise')
  console.log('')

  // Saudi Arabia — attempt live fetch
  const saResult = await tryFetchSaudiFuelPrice()
  const saFuelPrice = saResult.price ?? FUEL_PRICE_FALLBACK.SA
  if (saResult.source === 'fallback') {
    console.log(`SA live fetch failed (${saResult.reason}) — using fallback constant`)
  }
  await upsertTCOParams('SA', ELECTRICITY_RATE_KWH.SA, saFuelPrice, saResult.source)

  // UAE and Morocco — no reliable public scrape target identified yet,
  // using reviewed constants directly. Revisit if a stable source is found.
  await upsertTCOParams('AE', ELECTRICITY_RATE_KWH.AE, FUEL_PRICE_FALLBACK.AE, 'constant')
  await upsertTCOParams('MA', ELECTRICITY_RATE_KWH.MA, FUEL_PRICE_FALLBACK.MA, 'constant')

  console.log('')
  console.log('Done. tco_params.updated_at reflects this run\'s timestamp regardless of whether values changed —')
  console.log('use it to show "last checked" on the site, not "last changed".')
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('TCO sync failed:', err)
    process.exit(1)
  })
