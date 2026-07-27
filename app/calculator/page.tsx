import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'
import FaqJsonLd from '@/components/FaqJsonLd'
import TCOCalculator from '@/components/TCOCalculator'
import { Battery, Thermometer, ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'حاسبة توفير السيارة الكهربائية | شحن MENA',
  description: 'احسب كم ستوفر بالتحول إلى السيارات الكهربائية في السعودية والإمارات',
  alternates: { canonical: '/calculator' },
}

const FAQ = [
  { q: 'كيف تحسب هذه الحاسبة التوفير؟', a: 'تقارن الحاسبة تكلفة الوقود لسيارتك الحالية بتكلفة الكهرباء لشحن سيارة كهربائية على نفس المسافة، باستخدام أسعار الكهرباء والبنزين الفعلية في بلدك.' },
  { q: 'هل التوفير المحسوب يشمل تكلفة الشراء الأولي؟', a: 'لا، هذه الحاسبة تقارن التكلفة التشغيلية فقط (وقود مقابل كهرباء)، ولا تأخذ في الحسبان فرق سعر الشراء بين السيارتين أو تكاليف الصيانة.' },
  { q: 'هل تختلف النتيجة باختلاف نمط القيادة؟', a: 'نعم — المسافة اليومية ومعدل استهلاك كل سيارة يؤثران مباشرة على التوفير الفعلي. جرّب أرقاماً مختلفة في الحاسبة لتقييم حالتك الخاصة بدقة أكبر.' },
]

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
      <FaqJsonLd items={FAQ} />
      <main dir="rtl" className="pt-20 pb-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs items={[{ label: 'حاسبة التوفير', href: '/calculator' }]} />
          <h1 className="font-tajawal font-black text-4xl text-[#FAF3E0] mb-4 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            حاسبة التوفير
          </h1>
          <p className="text-[#A89070] text-center mb-10" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
            احسب كم ستوفر سنوياً بالتحول إلى السيارة الكهربائية
          </p>
          <TCOCalculator params={params.length > 0 ? params : defaults} />

          <h2 className="font-tajawal font-black text-xl text-[#FAF3E0] mt-12 mb-5" style={{ fontFamily: 'Tajawal, sans-serif' }}>أسئلة شائعة</h2>
          <div className="flex flex-col gap-3 mb-10">
            {FAQ.map((f, i) => (
              <details key={i} className="card-surface">
                <summary className="cursor-pointer font-tajawal font-bold text-[#FAF3E0] text-sm select-none" style={{ fontFamily: 'Tajawal, sans-serif' }}>{f.q}</summary>
                <p className="text-[#A89070] text-sm leading-relaxed mt-3" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{f.a}</p>
              </details>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Battery size={20} />,     label: 'قارن الموديلات',  href: '/models',     desc: 'اختر السيارة المناسبة لك' },
              { icon: <Thermometer size={20} />, label: 'دليل الحرارة',    href: '/heat-guide', desc: 'أداء البطارية في الصيف' },
            ].map(c => (
              <Link key={c.href} href={c.href}
                className="group flex items-center gap-4 card-surface hover:border-[#F5A623]/50 transition-all">
                <div className="text-[#F5A623] flex-shrink-0">{c.icon}</div>
                <div>
                  <p className="font-tajawal font-bold text-[#FAF3E0] group-hover:text-[#F5A623] transition-colors" style={{ fontFamily: 'Tajawal, sans-serif' }}>{c.label}</p>
                  <p className="text-xs text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{c.desc}</p>
                </div>
                <ChevronLeft size={16} className="text-[#A89070] mr-auto flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
