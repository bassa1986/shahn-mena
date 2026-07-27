import type { Metadata } from 'next'
import Link from 'next/link'
import { Thermometer, Battery, Zap, Shield, ChevronLeft, AlertTriangle, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'
import FaqJsonLd from '@/components/FaqJsonLd'
import { queryWithRetry } from '@/lib/db'

export const revalidate = 86400
export const metadata: Metadata = {
  title: 'دليل الحرارة والسيارات الكهربائية | شحن MENA',
  description: 'تأثير الحرارة الشديدة على بطاريات السيارات الكهربائية في السعودية والإمارات',
  alternates: { canonical: '/heat-guide' },
}

type TCORow     = { country: string; electricity_rate_kwh: number }
type ArticleRow = { slug: string; title_ar: string; category: string | null }

async function getLiveData(): Promise<{ tco: TCORow[]; articles: ArticleRow[] }> {
  try {
    const [tco, articles] = await Promise.all([
      queryWithRetry('SELECT country, electricity_rate_kwh FROM tco_params ORDER BY country'),
      queryWithRetry('SELECT title_ar, slug, category FROM articles WHERE published = true ORDER BY created_at DESC LIMIT 4'),
    ])
    return { tco: tco as TCORow[], articles: articles as ArticleRow[] }
  } catch (err) {
    console.error('Failed to load heat-guide data:', err)
    return { tco: [], articles: [] }
  }
}

const TIPS = [
  { icon: '🌡', title: 'افهم حدود البطارية',          body: 'تعمل البطاريات بكفاءة مثلى بين 20-35°C. في الحرارة الشديدة (+40°C) مع قيادة سريعة، تُظهر بيانات ميدانية حقيقية فقدان مدى يصل إلى 30-44٪.',                         badge: 'علم التقنية',   color: 'text-sky-400'     },
  { icon: '☀️', title: 'لا تترك السيارة تحت الشمس',   body: 'الحرارة الداخلية تتجاوز 70°C تحت الشمس المباشرة. فعّل وضع حماية البطارية دائماً قبل الخروج.',                  badge: 'نصيحة ذهبية',  color: 'text-amber-400'   },
  { icon: '⚡', title: 'تجنب الشحن السريع في الحر',    body: 'فوق 42°C يُفضَّل الشحن الليلي AC لإعطاء البطارية وقتاً كافياً للتبريد الطبيعي.',                              badge: 'تحذير مهم',    color: 'text-rose-400'    },
  { icon: '🔋', title: 'ابقَ بين 20-80٪',             body: 'الشحن لـ80٪ يطيل عمر البطارية 2-3 أضعاف في مناخ الخليج مقارنة بالشحن الكامل.',                                badge: 'ذهبية',         color: 'text-emerald-400' },
  { icon: '❄️', title: 'فعّل التبريد المسبق',          body: 'ميزة متوفرة في Tesla وBYD وLucid — تبرد البطارية قبل الشحن السريع مما يرفع الكفاءة ويحمي الخلايا.',           badge: 'احترافي',       color: 'text-violet-400'  },
  { icon: '🏠', title: 'فضّل الشحن المنزلي الليلي',   body: 'الشحن ليلاً عند 22-28°C يمنح أفضل كفاءة وأطول عمر للبطارية مع أقل تكلفة.',                                    badge: 'توفير',         color: 'text-amber-400'   },
]

const HEAT_FINDINGS = [
  { stat: '<5٪',    label: 'فقدان المدى عند 32°C (90°F)',  note: 'تأثير محدود جداً — لا يكاد يُلاحظ في القيادة اليومية.' },
  { stat: '17-18٪', label: 'فقدان المدى عند 37°C (100°F)',  note: 'المتوسط عبر عشرات آلاف السيارات الكهربائية المسجّلة في بيانات Recurrent Auto.' },
  { stat: '30-44٪', label: 'فقدان المدى في حرارة شديدة (+40°C) مع قيادة سريعة على الطرق السريعة', note: 'من اختبار ميداني حقيقي لثلاث سيارات كهربائية في جنوب إسبانيا (InsideEVs / What Car?) — الجزء الأكبر من هذا الفقدان سببه السرعة العالية بقدر ما هو الحرارة نفسها.' },
]

const FAQ = [
  { q: 'هل السيارات الكهربائية مناسبة لمناخ الخليج؟',    a: 'نعم بشكل عام — بيانات حقيقية من عشرات آلاف السيارات (Recurrent Auto) تُظهر فقدان مدى محدود جداً (أقل من 5٪) عند 32°C، ويرتفع إلى 17-18٪ في المتوسط عند 37°C. الفرق الأكبر بين الموديلات يعتمد على وجود نظام تبريد سائل نشط للبطارية بدل الاعتماد على الهواء فقط.' },
  { q: 'كيف أحمي بطارية سيارتي في الصيف؟',              a: 'ابقَ في الظل أو مرآب، لا تشحن فوق 80٪ في الاستخدام اليومي، وفعّل التبريد المسبق (Preconditioning) إن كانت سيارتك تدعمه قبل السفر والشحن السريع.' },
  { q: 'ما الفرق بين التبريد السائل والهوائي للبطاريات؟', a: 'التبريد السائل (Liquid Cooling) ينظّم حرارة الخلايا بدقة أعلى في الحر الشديد مقارنة بالتبريد الهوائي البسيط، وهو موجود في أغلب السيارات الكهربائية الحديثة المخصصة أصلاً (وليس محوّلة من سيارة وقود). التفاصيل التقنية الدقيقة تختلف بين الشركات المصنّعة ويصعب تعميم رقم واحد على كل الموديلات.' },
  { q: 'هل الشحن من الشبكة العامة في الصيف مفيد؟',      a: 'مقبول — تجنب الساعة 12-4 مساءً (ذروة الحرارة) إن أمكن. الشحن من محطات AC البطيئة أقل إجهاداً على البطارية من الشحن السريع المتكرر في الحر.' },
]

export default async function HeatGuidePage() {
  const { tco, articles } = await getLiveData()
  const saElec = tco.find(t => t.country === 'SA')?.electricity_rate_kwh ?? 0.18
  const aeElec = tco.find(t => t.country === 'AE')?.electricity_rate_kwh ?? 0.30

  return (
    <>
      <Navbar />
      <FaqJsonLd items={FAQ.map(f => ({ q: f.q, a: f.a }))} />
      <main dir="rtl" className="pt-20 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'دليل الحرارة', href: '/heat-guide' }]} />
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-lg mb-5">
              <Thermometer size={28} className="text-rose-400" />
            </div>
            <h1 className="font-tajawal font-black text-5xl text-[#FAF3E0] mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              دليل الحرارة
            </h1>
            <p className="text-[#A89070] text-lg max-w-2xl mx-auto mb-6" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              أداء البطاريات في الصيف الحار — مبني على بيانات ميدانية حقيقية من آلاف السيارات
            </p>
            <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-5 py-3 text-sm text-rose-300" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              <AlertTriangle size={16} /> الحرارة الشديدة قد تقلص المدى بشكل ملحوظ — تعرف على الأرقام الحقيقية
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
              <h2 className="font-tajawal font-black text-xl text-[#FAF3E0]" style={{ fontFamily: 'Tajawal, sans-serif' }}>ماذا تقول البيانات الحقيقية عن الحرارة؟</h2>
            </div>
            <div className="divide-y divide-[#F5A623]/5">
              {HEAT_FINDINGS.map((f, i) => (
                <div key={i} className="flex items-start gap-4 py-4">
                  <span className="font-tajawal font-black text-2xl text-[#F5A623] flex-shrink-0 w-20 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>{f.stat}</span>
                  <div>
                    <p className="font-tajawal font-bold text-[#FAF3E0] text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{f.label}</p>
                    <p className="text-xs text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{f.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#A89070]/60 mt-3 pt-3 border-t border-[#F5A623]/5" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              المصادر: Recurrent Auto (بيانات ميدانية من آلاف السيارات)، واختبار ميداني من InsideEVs/What Car? في جنوب إسبانيا.
              لا تتوفر بيانات موثوقة تفصيلية بعد لكل موديل سيارة على حدة في مناخ الخليج تحديداً.
            </p>
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
