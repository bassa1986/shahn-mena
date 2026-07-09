import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Zap, Thermometer, Battery, ChevronLeft, Car } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'دليل موديلات السيارات الكهربائية 2025 | شحن MENA',
  description: 'مقارنة شاملة لأفضل السيارات الكهربائية في السعودية والإمارات',
}

type TCOParam = { country: string; electricity_rate_kwh: number; avg_fuel_price: number }

async function getTCOParams(): Promise<TCOParam[]> {
  const defaults: TCOParam[] = [
    { country: 'SA', electricity_rate_kwh: 0.18, avg_fuel_price: 2.18 },
    { country: 'AE', electricity_rate_kwh: 0.30, avg_fuel_price: 2.89 },
  ]
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql('SELECT country, electricity_rate_kwh, avg_fuel_price FROM tco_params ORDER BY country')
    return rows.length > 0 ? (rows as TCOParam[]) : defaults
  } catch {
    return defaults
  }
}

const MODELS = [
  { id: 'lucid',  nameAr: 'لوسيد إير',        brand: 'Lucid',    range: 728, hot: 620, kw: 300, loss: 15, sar: 395000, badge: 'الأفضل في الحر 🏆',     pros: ['الأطول مدىً خليجياً', 'تبريد استثنائي'],       cons: ['سعر مرتفع'] },
  { id: 'byd',    nameAr: 'بي واي دي سيل',    brand: 'BYD',      range: 524, hot: 480, kw: 150, loss: 8,  sar: 155000, badge: 'الأفضل قيمةً 💎',        pros: ['خسارة 8٪ فقط في الحر', 'سعر تنافسي'],         cons: ['شبكة شحن محدودة'] },
  { id: 'tesla',  nameAr: 'تسلا موديل 3',      brand: 'Tesla',    range: 629, hot: 500, kw: 250, loss: 20, sar: 195000, badge: 'الأوسع انتشاراً ⚡',     pros: ['شبكة Supercharger واسعة'],                     cons: ['خسارة 20٪ في الصيف'] },
  { id: 'ioniq',  nameAr: 'هيونداي IONIQ 6',   brand: 'Hyundai',  range: 614, hot: 390, kw: 220, loss: 37, sar: 185000, badge: 'الأسرع شحناً 🔋',        pros: ['شحن 10-80٪ في 18 دقيقة'],                      cons: ['خسارة 37٪ في 45°C'] },
  { id: 'ev6',    nameAr: 'كيا EV6',            brand: 'Kia',      range: 528, hot: 390, kw: 230, loss: 36, sar: 178000, badge: 'الأكثر ديناميكية 🏎',    pros: ['أداء رياضي ممتاز'],                            cons: ['خسارة مدى عالية'] },
  { id: 'mg4',    nameAr: 'إم جي 4',            brand: 'MG',       range: 520, hot: 400, kw: 140, loss: 23, sar: 128000, badge: 'الأوفر للميزانية 💰',    pros: ['أرخص سعر', 'ضمان 7 سنوات'],                   cons: ['شبكة شحن محدودة'] },
]

export default async function ModelsPage() {
  const tco = await getTCOParams()
  const sa  = tco.find(t => t.country === 'SA') ?? { electricity_rate_kwh: 0.18, avg_fuel_price: 2.18 }
  const ae  = tco.find(t => t.country === 'AE') ?? { electricity_rate_kwh: 0.30, avg_fuel_price: 2.89 }

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-20 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center py-12">
            <Car size={40} className="text-[#F5A623] mx-auto mb-4" />
            <h1 className="font-tajawal font-black text-5xl text-[#FAF3E0] mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              دليل الموديلات 2025
            </h1>
            <p className="text-[#A89070] text-lg" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              مقارنة شاملة لأداء السيارات الكهربائية في مناخ الخليج الحار
            </p>
          </div>

          <div className="mb-8 card-surface">
            <h2 className="font-tajawal font-black text-base text-[#F5A623] mb-4 flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Zap size={16} /> أسعار الطاقة الحالية
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'كهرباء السعودية', value: sa.electricity_rate_kwh + ' ر.س/kWh' },
                { label: 'وقود السعودية',   value: sa.avg_fuel_price       + ' ر.س/ل'   },
                { label: 'كهرباء الإمارات', value: ae.electricity_rate_kwh + ' د.إ/kWh' },
                { label: 'وقود الإمارات',   value: ae.avg_fuel_price       + ' د.إ/ل'   },
              ].map(p => (
                <div key={p.label} className="bg-[#0A1520] rounded-lg p-3 text-center">
                  <div className="text-xs text-[#A89070] mb-1" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{p.label}</div>
                  <div className="font-tajawal font-black text-[#F5A623]" style={{ fontFamily: 'Tajawal, sans-serif' }}>{p.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {MODELS.map(m => (
              <div key={m.id} className="card-surface hover:border-[#F5A623]/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-[#A89070] mb-1">{m.brand}</p>
                    <h2 className="font-tajawal font-black text-xl text-[#FAF3E0]" style={{ fontFamily: 'Tajawal, sans-serif' }}>{m.nameAr}</h2>
                  </div>
                  <span className="badge-gold text-xs" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{m.badge}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#0A1520] rounded p-2 text-center">
                    <Battery size={12} className="text-[#F5A623] mx-auto mb-1" />
                    <div className="font-black text-[#FAF3E0] text-sm">{m.range}</div>
                    <div className="text-xs text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>كم رسمي</div>
                  </div>
                  <div className="bg-[#0A1520] rounded p-2 text-center">
                    <Thermometer size={12} className="text-rose-400 mx-auto mb-1" />
                    <div className="font-black text-[#FAF3E0] text-sm">{m.hot}</div>
                    <div className="text-xs text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>كم (45°C)</div>
                  </div>
                  <div className="bg-[#0A1520] rounded p-2 text-center">
                    <Zap size={12} className="text-sky-400 mx-auto mb-1" />
                    <div className="font-black text-[#FAF3E0] text-sm">{m.kw}</div>
                    <div className="text-xs text-[#A89070]">kW</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 bg-[#0A1520] rounded-full h-1.5 overflow-hidden">
                    <div
                      style={{ width: Math.min(m.loss * 2, 100) + '%' }}
                      className={m.loss <= 10 ? 'h-full bg-emerald-500 rounded-full' : m.loss <= 20 ? 'h-full bg-amber-500 rounded-full' : 'h-full bg-rose-500 rounded-full'}
                    />
                  </div>
                  <span className={`text-xs font-bold ${m.loss <= 10 ? 'text-emerald-400' : m.loss <= 20 ? 'text-amber-400' : 'text-rose-400'}`}>
                    -{m.loss}٪
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  <div>
                    <p className="text-emerald-400 font-semibold mb-1" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>✓ المميزات</p>
                    {m.pros.map(p => <p key={p} className="text-[#A89070] mb-0.5" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>• {p}</p>)}
                  </div>
                  <div>
                    <p className="text-rose-400 font-semibold mb-1" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>✗ العيوب</p>
                    {m.cons.map(c => <p key={c} className="text-[#A89070] mb-0.5" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>• {c}</p>)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F5A623]/10">
                  <p className="font-tajawal font-black text-[#F5A623]" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {m.sar.toLocaleString()} ر.س
                  </p>
                  <div className="flex gap-2">
                    <a href={'https://syarah.com?utm_source=shahnamena&utm_medium=affiliate&utm_campaign=' + m.id}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs bg-[#F5A623] text-[#0D1B2A] font-bold px-3 py-1.5 rounded-lg hover:bg-[#E09510]"
                      style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                      <ExternalLink size={11} /> سيارة.كوم
                    </a>
                    <a href="https://uae.dubizzle.com/motors/?utm_source=shahnamena&utm_medium=affiliate"
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs border border-[#F5A623]/30 text-[#FAF3E0] font-bold px-3 py-1.5 rounded-lg"
                      style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                      <ExternalLink size={11} /> دبيزل
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-surface">
            <h3 className="font-tajawal font-black text-base text-[#F5A623] mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>روابط مفيدة</h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'دليل الحرارة',      href: '/heat-guide' },
                { label: 'احسب توفيرك',       href: '/calculator' },
                { label: 'خريطة الشحن',       href: '/charging-map' },
                { label: 'الحوافز الحكومية',  href: '/incentives' },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  className="flex items-center justify-between py-2 text-sm text-[#FAF3E0] border-b border-[#F5A623]/10 hover:text-[#F5A623] transition-colors"
                  style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                  {l.label}<ChevronLeft size={13} className="text-[#A89070]" />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
