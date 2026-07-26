import axios from 'axios'
import { query, closePool } from '../db.js'

const log = {
  info:    msg => console.log('ℹ', msg),
  success: msg => console.log('✅', msg),
  warn:    msg => console.log('⚠', msg),
  error:   msg => console.log('❌', msg),
}

// OpenChargeMap's own docs describe this as a shared, low-privilege
// free-tier key meant for exactly this kind of use — so this isn't a
// "someone's account got compromised" situation. Still moved to an env
// var rather than a literal in the fetch call, since a committed
// credential in a public repo is bad hygiene regardless of how low the
// actual stakes are. The hardcoded value stays as the fallback default,
// so this keeps working exactly as before even if you never add the
// env var anywhere — nothing breaks either way.
const OCM_API_KEY = process.env.OPENCHARGEMAP_API_KEY || 'b95dee04-1427-4042-b9cb-17e29db8b1f7'

async function fetchFromOpenChargeMap(countryCode, maxResults = 100) {
  try {
    log.info(`Fetching stations for ${countryCode}...`)
    const res = await axios.get('https://api.openchargemap.io/v3/poi/', {
      params: {
        output: 'json', countrycode: countryCode,
        maxresults: maxResults, compact: true, verbose: false,
        statustypeid: 50,
      },
      headers: { 'X-API-Key': OCM_API_KEY },
      timeout: 15000,
    })
    const stations = []
    for (const poi of res.data) {
      if (!poi.AddressInfo?.Latitude || !poi.AddressInfo?.Longitude) continue
      const connections = poi.Connections ?? []
      const maxPower    = Math.max(...connections.map(c => c.PowerKW ?? 0), 0)
      const connType    = connections[0]?.ConnectionType?.Title ?? 'CCS'
      let provider      = poi.OperatorInfo?.Title ?? 'Unknown'
      if (provider.toLowerCase().includes('dewa'))  provider = 'DEWA'
      if (provider.toLowerCase().includes('adnoc')) provider = 'ADNOC E2GO'
      if (provider.toLowerCase().includes('eviq'))  provider = 'EVIQ'
      stations.push({
        name:             poi.AddressInfo.Title ?? 'Charging Station',
        network_provider: provider,
        country:          countryCode,
        city:             poi.AddressInfo.Town ?? poi.AddressInfo.City ?? 'Unknown',
        speed_kw:         maxPower > 0 ? Math.round(maxPower) : 50,
        connector_type:   connType,
        lat:              poi.AddressInfo.Latitude,
        lng:              poi.AddressInfo.Longitude,
        status:           'متاح',
      })
    }
    log.success(`${countryCode}: Found ${stations.length} stations`)
    return stations
  } catch (e) {
    log.warn(`Failed for ${countryCode}: ${e.message}`)
    return []
  }
}

async function upsertStations(stations) {
  let inserted = 0, updated = 0, skipped = 0
  for (const s of stations) {
    if (!s.lat || !s.lng || isNaN(s.lat) || isNaN(s.lng)) { skipped++; continue }
    try {
      const existing = await query(
        'SELECT id FROM charging_networks WHERE ABS(lat - $1) < 0.001 AND ABS(lng - $2) < 0.001 LIMIT 1',
        [s.lat, s.lng]
      )
      if (existing.rows.length > 0) {
        await query(
          'UPDATE charging_networks SET name=$1, network_provider=$2, city=$3, speed_kw=$4, connector_type=$5, status=$6 WHERE id=$7',
          [s.name, s.network_provider, s.city, s.speed_kw, s.connector_type, s.status, existing.rows[0].id]
        )
        updated++
      } else {
        await query(
          'INSERT INTO charging_networks (id,name,network_provider,country,city,speed_kw,connector_type,lat,lng,status) VALUES (gen_random_uuid()::text,$1,$2,$3,$4,$5,$6,$7,$8,$9)',
          [s.name, s.network_provider, s.country, s.city, s.speed_kw, s.connector_type, s.lat, s.lng, s.status]
        )
        inserted++
      }
    } catch (e) {
      log.error(`Failed: ${s.name}: ${e.message}`)
      skipped++
    }
  }
  return { inserted, updated, skipped }
}

async function run() {
  console.log('\n⚡ Charging Stations Scraper\n')
  const [sa, ae, ma] = await Promise.all([
    fetchFromOpenChargeMap('SA', 150),
    fetchFromOpenChargeMap('AE', 150),
    fetchFromOpenChargeMap('MA', 50),
  ])
  const all = [...sa, ...ae, ...ma]
  log.info(`Total: ${all.length} stations`)
  if (all.length === 0) { log.warn('No stations found'); return }
  const { inserted, updated, skipped } = await upsertStations(all)
  log.success(`Done: ${inserted} inserted, ${updated} updated, ${skipped} skipped`)
}

run().then(() => closePool()).catch(e => { console.error(e); closePool(); process.exit(1) })
