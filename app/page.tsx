import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Battery, MapPin, Calculator, Shield, ChevronLeft, Thermometer, Car } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'شحن MENA — دليل السيارات الكهربائية في الخليج',
  description: 'دليل شامل للسيارات الكهربائية في السعودية والإمارات والمغرب',
  alternates: { canonical: '/' },
}

type Article = { slug: string; title_ar: string; category: string | null; excerpt_ar: string | null }
type Stats   = { stations: string; incentives: string; articles: string }

async function getStats(): Promise<Stats> {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const [s, i, a] = await Promise.all([
      sql('SELECT COUNT(*) as count FROM charging_networks'),
      sql('SELECT COUNT(*) as count FROM incentives'),
      sql('SELECT COUNT(*) as count FROM articles WHERE published = true'),
    ])
    return {
      stations:   String((s[0] as { count: number }).count  ?? 0),
      incentives: String((i[0] as { count: number }).count  ?? 0),
      articles:   String((a[0] as { count: number }).count  ?? 0),
    }
  } catch (err) {
    console.error('Failed to load homepage stats:', err)
    return { stations: '200+', incentives: '18+', articles: '0' }
  }
}

async function getLatestArticles(): Promise<Article[]> {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql('SELECT title_ar, slug, category, excerpt_ar FROM articles WHERE published = true ORDER BY created_at DESC LIMIT 3')
    return rows as Article[]
  } catch (err) {
    console.error('Failed to load featured articles:', err)
    return []
  }
}

const FEATURES = [
  { icon: <Car size={22} />,         title: 'دليل الموديلات',     desc: 'مقارنة أداء السيارات الكهربائية في مناخ الخليج الحار', href: '/models' },
  { icon: <Thermometer size={22} />, title: 'دليل الحرارة',      desc: 'تأثير الحرارة الشديدة على البطاريات والمدى', href: '/heat-guide' },
  { icon: <MapPin size={22} />,      title: 'خريطة الشحن',       desc: '200+ محطة شحن في السعودية والإمارات والمغرب', href: '/charging-map' },
  { icon: <Shield size={22} />,      title: 'الحوافز الحكومية',  desc: 'أحدث الإعفاءات والدعم الحكومي لشراء السيارات الكهربائية', href: '/incentives' },
  { icon: <Calculator size={22} />,  title: 'حاسبة التوفير',     desc: 'احسب كم ستوفر مقارنةً بالسيارات التقليدية', href: '/calculator' },
  { icon: <Battery size={22} />,     title: 'المقالات',           desc: 'أحدث أخبار ومقالات السيارات الكهربائية بالعربية', href: '/articles' },
]

export default async function HomePage() {
  const [stats, articles] = await Promise.all([getStats(), getLatestArticles()])

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen">

        <section className="relative overflow-hidden pt-28 pb-20 px-4" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(245,166,35,0.12) 0%, transparent 70%)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 badge-gold mb-6">
              <Zap size={14} /> دليل السيارات الكهربائية الأول في الخليج
            </div>
            <h1 className="font-tajawal font-black text-5xl md:text-7xl text-[#FAF3E0] mb-6 leading-tight" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              شحن <span className="text-[#F5A623]">MENA</span>
            </h1>
            <p className="text-[#A89070] text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              كل ما تحتاجه قبل شراء سيارتك الكهربائية في السعودية والإمارات والمغرب
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/models" className="btn-primary text-base px-8 py-3">
                <Car size={18} /> دليل الموديلات
              </Link>
              <Link href="/calculator" className="btn-secondary text-base px-8 py-3">
                <Calculator size={18} /> احسب توفيرك
              </Link>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { value: stats.stations,   label: 'محطة شحن' },
              { value: stats.incentives, label: 'حافز حكومي' },
              { value: stats.articles,   label: 'مقال عربي' },
            ].map(s => (
              <div key={s.label} className="text-center card-surface">
                <div className="font-tajawal font-black text-3xl text-[#F5A623] mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{s.value}</div>
                <div className="text-sm text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-tajawal font-black text-3xl text-[#FAF3E0] mb-10 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            استكشف الموقع
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <Link key={f.href} href={f.href}
                className="group card-surface hover:border-[#F5A623]/50 hover:shadow-[0_0_20px_rgba(245,166,35,0.12)] transition-all duration-300">
                <div className="text-[#F5A623] mb-3">{f.icon}</div>
                <h3 className="font-tajawal font-black text-lg text-[#FAF3E0] group-hover:text-[#F5A623] transition-colors mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {f.title}
                </h3>
                <p className="text-[#A89070] text-sm leading-relaxed" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{f.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-xs text-[#F5A623] font-semibold">
                  استكشف <ChevronLeft size={12} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {articles.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-tajawal font-black text-2xl text-[#FAF3E0]" style={{ fontFamily: 'Tajawal, sans-serif' }}>أحدث المقالات</h2>
              <Link href="/articles" className="text-sm text-[#F5A623] flex items-center gap-1">
                عرض الكل <ChevronLeft size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(articles as Article[]).map(a => (
                <Link key={a.slug} href={'/articles/' + a.slug}
                  className="group card-surface hover:border-[#F5A623]/50 transition-all">
                  {a.category && <span className="badge-gold text-xs mb-3 inline-block">{a.category}</span>}
                  <h3 className="font-tajawal font-bold text-[#FAF3E0] group-hover:text-[#F5A623] transition-colors mb-2 leading-snug" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {a.title_ar}
                  </h3>
                  {a.excerpt_ar && <p className="text-[#A89070] text-sm line-clamp-2" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{a.excerpt_ar}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="w-full h-24 bg-[#122236] border border-[#F5A623]/20 rounded-lg flex items-center justify-center text-[#A89070] text-sm">
            إعلان
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
