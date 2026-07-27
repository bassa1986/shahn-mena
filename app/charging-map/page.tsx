import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'
import { MapPin, Zap, Navigation } from 'lucide-react'
import { queryWithRetry } from '@/lib/db'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'خريطة محطات الشحن | شحن MENA',
  description: 'محطات الشحن الكهربائي في السعودية والإمارات والمغرب',
  alternates: { canonical: '/charging-map' },
}

type Station = {
  id: string; name: string; network_provider: string; country: string
  city: string; speed_kw: number; connector_type: string; status: string
  lat: number; lng: number
}

async function getStations(): Promise<Station[]> {
  try {
    const rows = await queryWithRetry('SELECT id, name, network_provider, country, city, speed_kw, connector_type, status, lat, lng FROM charging_networks ORDER BY country, city LIMIT 150')
    return rows as Station[]
  } catch (err) {
    console.error('Failed to load charging stations:', err)
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
          <div className="pt-6"><Breadcrumbs items={[{ label: 'الشحن', href: '/charging-map' }]} /></div>
          <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] rounded-xl overflow-hidden mb-2">
            <Image
              src="https://images.unsplash.com/photo-1641659376402-3d2f48a91ed7?w=1600&h=550&fit=crop&auto=format&q=80"
              alt="محطات شحن السيارات الكهربائية"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
          </div>

          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-lg mb-4">
              <MapPin size={28} className="text-[#F5A623]" />
            </div>
            <h1 className="font-tajawal font-black text-4xl text-[#FAF3E0] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              خريطة محطات الشحن
            </h1>
            <p className="text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              {stations.length}+ محطة شحن كهربائي — اضغط على أي محطة لفتح الموقع في الخريطة
            </p>
          </div>

          {Object.entries(countries).map(([country, stns]) => (
            <div key={country} className="mb-10">
              <h2 className="font-tajawal font-black text-2xl text-[#FAF3E0] mb-5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {flags[country]} {names[country]} ({stns.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stns.map(s => {
                  const mapsUrl = s.lat && s.lng
                    ? `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}&travelmode=driving`
                    : `https://www.google.com/maps/search/${encodeURIComponent(s.name + ' ' + s.city)}`

                  return (
                    <a
                      key={s.id}
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-surface hover:border-[#F5A623]/60 hover:shadow-[0_0_20px_rgba(245,166,35,0.15)] transition-all duration-200 cursor-pointer group block"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-tajawal font-bold text-[#FAF3E0] text-sm group-hover:text-[#F5A623] transition-colors" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {s.name}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${s.status === 'متاح' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {s.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#A89070] mb-3" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                        {s.network_provider} · {s.city}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-[#F5A623]">
                            <Zap size={12} /> {s.speed_kw} kW
                          </span>
                          <span className="text-xs text-[#A89070]">{s.connector_type}</span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-[#F5A623] opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                          <Navigation size={11} /> اتجاهات
                        </span>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          ))}

          {stations.length === 0 && (
            <div className="card-surface text-center py-16">
              <p className="text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                لا توجد بيانات بعد
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
