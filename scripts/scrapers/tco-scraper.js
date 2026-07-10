import { query, closePool } from '../db.js'

const PRICES = [
  { country: 'SA', electricity_rate_kwh: 0.18, avg_fuel_price: 2.18 },
  { country: 'AE', electricity_rate_kwh: 0.30, avg_fuel_price: 2.89 },
  { country: 'MA', electricity_rate_kwh: 1.20, avg_fuel_price: 13.50 },
]

async function run() {
  console.log('\n💰 TCO Params Scraper\n')
  for (const p of PRICES) {
    try {
      const existing = await query('SELECT id FROM tco_params WHERE country=$1', [p.country])
      if (existing.rows.length > 0) {
        await query('UPDATE tco_params SET electricity_rate_kwh=$1, avg_fuel_price=$2 WHERE country=$3',
          [p.electricity_rate_kwh, p.avg_fuel_price, p.country])
        console.log(`✅ Updated ${p.country}`)
      } else {
        await query('INSERT INTO tco_params (id,country,electricity_rate_kwh,avg_fuel_price) VALUES (gen_random_uuid()::text,$1,$2,$3)',
          [p.country, p.electricity_rate_kwh, p.avg_fuel_price])
        console.log(`✅ Inserted ${p.country}`)
      }
    } catch (e) {
      console.error('Failed:', p.country, e.message)
    }
  }
}

run().then(() => closePool()).catch(e => { console.error(e); closePool(); process.exit(1) })
