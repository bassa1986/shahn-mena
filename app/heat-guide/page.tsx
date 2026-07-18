import type { Metadata } from 'next'
import Link from 'next/link'
import { Thermometer, Battery, Zap, Shield, ChevronLeft, AlertTriangle, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const revalidate = 86400
export const metadata: Metadata = {
  title: 'دليل الحرارة والسيارات الكهربائية | شحن MENA',
  description: 'تأثير الحرارة الشديدة على بطاريات السيارات الكهربائية في السعودية والإمارات',
}

type TCORow     = { country: string; electricity_rate_kwh: number }
type ArticleRow = { slug: string; title_ar: string; category: string | null }

async function getLiveData(): Promise<{ tco: TCORow[]; articles: ArticleRow[] }> {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const [tco, articles] = await Promise.all([
      sql('SELECT country, electricity_rate_kwh FROM tco_params ORDER BY country'),
      sql('SELECT title_ar, slug, category FROM articles WHERE published = true ORDER BY created_at DESC LIMIT 4'),
    ])
    return { tco: tco as TCORow[], articles: articles as ArticleRow[] }
  } catch {
    return { tco: [], articles: [] }
  }
}

const TIPS = [
  { icon: '🌡', title: 'افهم حدود البطارية',          body: 'تعمل البطاريات بكفاءة مثلى بين 20-35°C. عند 45°C تنخفض السعة 8-37٪ حسب نظام التبريد.',                         badge: 'علم التقنية',   color: 'text-sky-400'     },
  { icon: '☀️', title: 'لا تترك السيارة تحت الشمس',   body: 'الحرارة الداخلية تتجاوز 70°C تحت الشمس المباشرة. فعّل وضع حماية البطارية دائماً قبل الخروج.',                  badge: 'نصيحة ذهبية',  color: 'text-amber-400'   },
  { icon: '⚡', title: 'تجنب الشحن السريع في الحر',    body: 'فوق 42°C يُفضَّل الشحن الليلي AC لإعطاء البطارية وقتاً كافياً للتبريد الطبيعي.',                              badge: 'تحذير مهم',    color: 'text-rose-400'    },
  { icon: '🔋', title: 'ابقَ بين 20-80٪',             body: 'الشحن لـ80٪ يطيل عمر البطارية 2-3 أضعاف في مناخ الخليج مقارنة بالشحن الكامل.',                                badge: 'ذهبية',         color: 'text-emerald-400' },
  { icon: '❄️', title: 'فعّل التبريد المسبق',          body: 'ميزة متوفرة في Tesla وBYD وLucid — تبرد البطارية قبل الشحن السريع مما يرفع الكفاءة ويحمي الخلايا.',           badge: 'احترافي',       color: 'text-violet-400'  },
  { icon: '🏠', title: 'فضّل الشحن المنزلي الليلي',   body: 'الشحن ليلاً عند 22-28°C يمنح أفضل كفاءة وأطول عمر للبطارية مع أقل تكلفة.',                                    badge: 'توفير',         color: 'text-amber-400'   },
]

const RANKING = [
  { rank: 1, slug: 'byd-seal',       name: 'BYD Seal',        loss: 8,  system: 'OceanX Active Liquid', color: 'text-emerald-400' },
  { rank: 2, slug: 'lucid-air',      name: 'Lucid Air',       loss: 15, system: 'OceanX AI Cooling',    color: 'text-emerald-400' },
  { rank: 3, slug: 'tesla-model-3',  name: 'Tesla Model 3',   loss: 20, system: 'Active Liquid Gen3',   color: 'text-amber-400'   },
  { rank: 4, slug: 'mg4',            name: 'MG4 Trophy',      loss: 23, system: 'Active Liquid',        color: 'text-amber-400'   },
  { rank: 5, slug: 'kia-ev6',        name: 'Kia EV6',         loss: 36, system: 'E-GMP Standard',       color: 'text-rose-400'    },
  { rank: 6, slug: 'hyundai-ioniq6', name: 'Hyundai IONIQ 6', loss: 37, system: 'Standard TMS',         color: 'text-rose-400'    },
]

const FAQ = [
  { q: 'هل السيارات الكهربائية مناسبة لمناخ الخليج؟',    a: 'نعم، خصوصاً الموديلات ذات التبريد السائل النشط مثل BYD Seal وLucid Air التي تحتفظ بـ85-92٪ من المدى في 45°C.' },
  { q: 'كيف أحمي بطارية سيارتي في الصيف؟',              a: 'ابقَ في الظل أو مرآب، لا تشحن فوق 80٪، وفعّل التبريد المسبق قبل السفر والشحن.' },
  { q: 'ما الفرق بين التبريد السائل والهوائي للبطاريات؟', a: 'التبريد السائل يحافظ على 20-35°C حتى في الحر الشديد. التبريد الهوائي يفقد 30-40٪ من المدى في مناخ الخليج.' },
  { q: 'هل الشحن من الشبكة العامة في الصيف مفيد؟',      a: 'مقبول — تجنب الساعة 12-4 مساءً (ذروة الحرارة). الشحن من محطات AC Level 2 أفضل دائماً للبطارية.' },
]

export default async function HeatGuidePage() {
  const { tco, articles } = await getLiveData()
  const saElec = tco.find(t => t.country === 'SA')?.electricity_rate_kwh ?? 0.18
  const aeElec = tco.find(t => t.country === 'AE')?.electricity_rate_kwh ?? 0.30

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-20 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-lg mb-5">
              <Thermometer size={28} className="text-rose-400" />
            </div>
            <h1 className="font-tajawal font-black text-5xl text-[#FAF3E0] mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              دليل الحرارة
            </h1>
            <p className="text-[#A89070] text-lg max-w-2xl mx-auto mb-6" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              أداء البطاريات في الصيف الحار — مبني على بيانات حقيقية من 45-50°C
            </p>
            <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-5 py-3 text-sm text-rose-300" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              <AlertTriangle size={16} /> الحرارة قد تقلص المدى 8-37٪ حسب الموديل — اختر بذكاء
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { label: 'السعودية 🇸🇦', rate: saElec, cur: 'ر.س', cost: (saElec * 80).toFixed(1) },
              { label: 'الإمارات 🇦🇪',  rate: aeElec, cur: 'د.إ', cost: (aeElec * 80).toFixed(1) },
            ].map(c => (
              <div key={c.label} className="card-surface">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-tajawal font-black text-[#FAF3E0]" style={{ fontFamily: 'Tajawal, sans-serif' }}>{c.label}</h3>
                  <Zap size={16} className="text-[#F5A623]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0A1520] rounded-lg p-3 text-center">
                    <div className="font-tajawal font-black text-[#F5A623]" style={{ fontFamily: 'Tajawal, sans-serif' }}>{c.rate} {c.cur}/kWh</div>
                    <div className="text-xs text-[#A89070] mt-1" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>سعر الكيلوواط</div>
                  </div>
                  <div className="bg-[#0A1520] rounded-lg p-3 text-center">
                    <div className="font-tajawal font-black text-emerald-400" style={{ fontFamily: 'Tajawal, sans-serif' }}>{c.cost} {c.cur}</div>
                    <div className="text-xs text-[#A89070] mt-1" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>شحن 80kWh كامل</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-surface mb-8">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#F5A623]/10">
              <Battery size={20} className="text-[#F5A623]" />
              <h2 className="font-tajawal font-black text-xl text-[#FAF3E0]" style={{ fontFamily: 'Tajawal, sans-serif' }}>ترتيب الموديلات حسب التبريد في الحر</h2>
            </div>
            <div className="divide-y divide-[#F5A623]/5">
              {RANKING.map(m => (
                <div key={m.rank} className="flex items-center gap-4 py-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${m.rank <= 2 ? 'bg-emerald-500/20 text-emerald-400' : m.rank <= 4 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>{m.rank}</span>
                  <div className="flex-1">
                    <p className="font-tajawal font-bold text-[#FAF3E0] text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{m.name}</p>
                    <p className="text-xs text-[#A89070]">{m.system}</p>
                  </div>
                  <div className={`font-bold text-sm ${m.color}`}>-{m.loss}٪</div>
                  <Link href={`/models#${m.slug}`} className="text-xs text-[#F5A623] flex items-center gap-0.5" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                    تفاصيل <ChevronLeft size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <h2 className="font-tajawal font-black text-2xl text-[#FAF3E0] mb-6" style={{ fontFamily: 'Tajawal, sans-serif' }}>6 نصائح ذهبية للشحن في الحر</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {TIPS.map((t, i) => (
              <div key={i} className="card-surface">
                <div className="text-3xl mb-3">{t.icon}</div>
                <div className={`text-xs font-semibold mb-2 ${t.color}`} style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{t.badge}</div>
                <h3 className="font-tajawal font-black text-base text-[#FAF3E0] mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.title}</h3>
                <p className="text-[#A89070] text-sm leading-relaxed" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{t.body}</p>
              </div>
            ))}
          </div>

          <h2 className="font-tajawal font-black text-2xl text-[#FAF3E0] mb-6" style={{ fontFamily: 'Tajawal, sans-serif' }}>أسئلة شائعة</h2>
          <div className="flex flex-col gap-4 mb-10">
            {FAQ.map((f, i) => (
              <div key={i} className="card-surface">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle size={18} className="text-[#F5A623] flex-shrink-0 mt-0.5" />
                  <h3 className="font-tajawal font-bold text-[#FAF3E0]" style={{ fontFamily: 'Tajawal, sans-serif' }}>{f.q}</h3>
                </div>
                <p className="text-[#A89070] text-sm leading-relaxed pr-7" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{f.a}</p>
              </div>
            ))}
          </div>

          {articles.length > 0 && (
            <div className="mb-10">
              <h2 className="font-tajawal font-black text-xl text-[#FAF3E0] mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>مقالات ذات صلة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(articles as ArticleRow[]).map(a => (
                  <Link key={a.slug} href={'/articles/' + a.slug}
                    className="group card-surface hover:border-[#F5A623]/50 transition-all">
                    {a.category && <span className="text-xs text-[#F5A623] font-semibold mb-2 block">{a.category}</span>}
                    <p className="font-tajawal font-bold text-sm text-[#FAF3E0] group-hover:text-[#F5A623] transition-colors" style={{ fontFamily: 'Tajawal, sans-serif' }}>{a.title_ar}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: <Battery size={20} />, label: 'مقارنة الموديلات', href: '/models',       desc: 'جميع تفاصيل التبريد والمدى' },
              { icon: <Zap size={20} />,     label: 'خريطة الشحن',     href: '/charging-map', desc: 'أقرب محطة شحن إليك' },
              { icon: <Shield size={20} />,  label: 'الحوافز الحكومية', href: '/incentives',   desc: 'وفّر عند الشراء' },
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
