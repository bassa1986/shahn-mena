import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MapPin, Zap } from 'lucide-react'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'خريطة محطات الشحن | شحن MENA',
  description: 'محطات الشحن الكهربائي في السعودية والإمارات والمغرب',
}

type Station = { id: string; name: string; network_provider: string; country: string; city: string; speed_kw: number; connector_type: string; status: string }

async function getStations(): Promise<Station[]> {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql('SELECT id, name, network_provider, country, city, speed_kw, connector_type, status FROM charging_networks ORDER BY country, city LIMIT 150')
    return rows as Station[]
  } catch {
    return []
  }
}

export default async function ChargingMapPage() {
  const stations = await getStations()
  const countries: Record<string, Station[]> = {}
  stations.forEach(s => {
    if (!countries[s.country]) countries[s.country] = []
    countries[s.country].push(s)
  })
  const flags: Record<string, string> = { SA: '🇸🇦', AE: '🇦🇪', MA: '🇲🇦' }
  const names: Record<string, string> = { SA: 'السعودية', AE: 'الإمارات', MA: 'المغرب' }

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-20 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-lg mb-4">
              <MapPin size={28} className="text-[#F5A623]" />
            </div>
            <h1 className="font-tajawal font-black text-4xl text-[#FAF3E0] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>خريطة محطات الشحن</h1>
            <p className="text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{stations.length}+ محطة شحن كهربائي في المنطقة</p>
          </div>

          {Object.entries(countries).map(([country, stns]) => (
            <div key={country} className="mb-10">
              <h2 className="font-tajawal font-black text-2xl text-[#FAF3E0] mb-5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {flags[country]} {names[country]} ({stns.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stns.map(s => (
                  <div key={s.id} className="card-surface">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-tajawal font-bold text-[#FAF3E0] text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{s.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${s.status === 'متاح' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{s.status}</span>
                    </div>
                    <p className="text-xs text-[#A89070] mb-3" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{s.network_provider} · {s.city}</p>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-[#F5A623]"><Zap size={12} /> {s.speed_kw} kW</span>
                      <span className="text-xs text-[#A89070]">{s.connector_type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {stations.length === 0 && (
            <div className="card-surface text-center py-16">
              <p className="text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>لا توجد بيانات بعد — قم بتشغيل سكريبت الشحن</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
