import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TCOCalculator from '@/components/TCOCalculator'

export const metadata: Metadata = {
  title: 'حاسبة توفير السيارة الكهربائية | شحن MENA',
  description: 'احسب كم ستوفر بالتحول إلى السيارات الكهربائية في السعودية والإمارات',
  alternates: { canonical: '/calculator' },
}

type TCOParam = { country: string; electricity_rate_kwh: number; avg_fuel_price: number }

async function getTCOParams(): Promise<TCOParam[]> {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql('SELECT country, electricity_rate_kwh, avg_fuel_price FROM tco_params ORDER BY country')
    return rows as TCOParam[]
  } catch (err) {
    console.error('Failed to load TCO params (calculator page):', err)
    return [
      { country: 'SA', electricity_rate_kwh: 0.18, avg_fuel_price: 2.18 },
      { country: 'AE', electricity_rate_kwh: 0.30, avg_fuel_price: 2.89 },
    ]
  }
}

export default async function CalculatorPage() {
  const params = await getTCOParams()
  const defaults: TCOParam[] = [
    { country: 'SA', electricity_rate_kwh: 0.18, avg_fuel_price: 2.18 },
    { country: 'AE', electricity_rate_kwh: 0.30, avg_fuel_price: 2.89 },
  ]

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-20 pb-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-tajawal font-black text-4xl text-[#FAF3E0] mb-4 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            حاسبة التوفير
          </h1>
          <p className="text-[#A89070] text-center mb-10" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
            احسب كم ستوفر سنوياً بالتحول إلى السيارة الكهربائية
          </p>
          <TCOCalculator params={params.length > 0 ? params : defaults} />
        </div>
      </main>
      <Footer />
    </>
  )
}
