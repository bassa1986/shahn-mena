import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Zap, Battery, Thermometer, ExternalLink } from 'lucide-react'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'موديلات السيارات الكهربائية | شحن MENA',
  description: 'مقارنة أفضل السيارات الكهربائية المتاحة في السعودية والإمارات',
}

type Model = {
  id: string
  slug: string
  brand: string
  name_ar: string
  badge_ar: string | null
  range_km: number
  range_hot_km: number
  charge_speed_kw: number
  heat_loss_pct: number
  price_sar: number
  pros_ar: string[]
  cons_ar: string[]
  syarah_url: string | null
  dubizzle_url: string | null
  reviewed_at: string | null
}

type TCOParam = { country: string; electricity_rate_kwh: number; avg_fuel_price: number }

async function getModels(): Promise<Model[]> {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql(
      'SELECT id, slug, brand, name_ar, badge_ar, range_km, range_hot_km, charge_speed_kw, heat_loss_pct, price_sar, pros_ar, cons_ar, syarah_url, dubizzle_url, reviewed_at FROM ev_models WHERE active = true ORDER BY display_order'
    )
    return rows as Model[]
  } catch {
    return []
  }
}

async function getTCOParams(): Promise<TCOParam[]> {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql('SELECT country, electricity_rate_kwh, avg_fuel_price FROM tco_params ORDER BY country')
    return rows as TCOParam[]
  } catch {
    return []
  }
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

export default async function ModelsPage() {
  const [models, tco] = await Promise.all([getModels(), getTCOParams()])
  const sa = tco.find(t => t.country === 'SA')
  const ae = tco.find(t => t.country === 'AE')

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-20 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-lg mb-4">
              <Battery size={28} className="text-[#F5A623]" />
            </div>
            <h1 className="font-tajawal font-black text-4xl text-[#FAF3E0] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>موديلات السيارات الكهربائية</h1>
            <p className="text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>مقارنة الأداء والمدى والسعر في مناخ الخليج الحار</p>
          </div>

          {(sa || ae) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {sa && (
                <div className="card-surface flex items-center justify-between">
                  <span className="text-sm text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>🇸🇦 السعودية</span>
                  <span className="text-sm text-[#FAF3E0]">{sa.electricity_rate_kwh} ر.س/kWh · {sa.avg_fuel_price} ر.س/ل بنزين</span>
                </div>
              )}
              {ae && (
                <div className="card-surface flex items-center justify-between">
                  <span className="text-sm text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>🇦🇪 الإمارات</span>
                  <span className="text-sm text-[#FAF3E0]">{ae.electricity_rate_kwh} د.إ/kWh · {ae.avg_fuel_price} د.إ/ل بنزين</span>
                </div>
              )}
            </div>
          )}

          {models.length === 0 && (
            <div className="card-surface text-center py-16">
              <p className="text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                لا توجد موديلات بعد — شغّل <code>node scripts/scrapers/seed-ev-models.js</code>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {models.map(m => {
              const age = daysSince(m.reviewed_at)
              const stale = age !== null && age > 120
              return (
                <div key={m.id} id={m.slug} className="card-surface flex flex-col scroll-mt-24">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{m.brand}</span>
                    {m.badge_ar && <span className="badge-gold text-[11px]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{m.badge_ar}</span>}
                  </div>
                  <h2 className="font-tajawal font-black text-xl text-[#FAF3E0] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>{m.name_ar}</h2>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div>
                      <div className="text-[#FAF3E0] font-bold text-sm">{m.range_km}</div>
                      <div className="text-[10px] text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>كم رسمي</div>
                    </div>
                    <div>
                      <div className="text-[#FAF3E0] font-bold text-sm flex items-center justify-center gap-0.5"><Thermometer size={11} className="text-[#F5A623]" />{m.range_hot_km}</div>
                      <div className="text-[10px] text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>كم في الحر</div>
                    </div>
                    <div>
                      <div className="text-[#FAF3E0] font-bold text-sm flex items-center justify-center gap-0.5"><Zap size={11} className="text-[#F5A623]" />{m.charge_speed_kw}</div>
                      <div className="text-[10px] text-[#A89070]">kW شحن</div>
                    </div>
                  </div>

                  <div className="text-xs text-rose-400 mb-3" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                    فقدان {m.heat_loss_pct}٪ من المدى في الحر الشديد
                  </div>

                  {m.pros_ar.length > 0 && (
                    <ul className="text-xs text-[#A89070] mb-2 space-y-1" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                      {m.pros_ar.map((p, i) => <li key={i}>✓ {p}</li>)}
                    </ul>
                  )}
                  {m.cons_ar.length > 0 && (
                    <ul className="text-xs text-[#A89070]/70 mb-4 space-y-1" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                      {m.cons_ar.map((c, i) => <li key={i}>✗ {c}</li>)}
                    </ul>
                  )}

                  <div className="mt-auto pt-3 border-t border-[#F5A623]/10">
                    <div className="font-tajawal font-black text-lg text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {m.price_sar.toLocaleString('en-US')} ر.س
                    </div>
                    <div className="flex gap-2">
                      {m.syarah_url && (
                        <a href={m.syarah_url} target="_blank" rel="noopener noreferrer nofollow sponsored"
                          className="flex-1 flex items-center justify-center gap-1 text-xs bg-[#F5A623] text-[#0D1B2A] font-bold py-2 rounded-lg"
                          style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                          سيارة <ExternalLink size={11} />
                        </a>
                      )}
                      {m.dubizzle_url && (
                        <a href={m.dubizzle_url} target="_blank" rel="noopener noreferrer nofollow sponsored"
                          className="flex-1 flex items-center justify-center gap-1 text-xs border border-[#F5A623]/40 text-[#F5A623] font-bold py-2 rounded-lg"
                          style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                          دوبيزل <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    {age !== null && (
                      <div className={`mt-2 text-[10px] ${stale ? 'text-amber-400' : 'text-[#A89070]/60'}`} style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                        {stale ? '⚠ ' : ''}آخر مراجعة للسعر: {new Date(m.reviewed_at!).toLocaleDateString('en-GB')}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
