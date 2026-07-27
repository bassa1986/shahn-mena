import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Shield, ExternalLink, Clock } from 'lucide-react'
import { queryWithRetry } from '@/lib/db'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'الحوافز الحكومية للسيارات الكهربائية | شحن MENA',
  description: 'أحدث الإعفاءات والحوافز الحكومية في السعودية والإمارات والمغرب',
  alternates: { canonical: '/incentives' },
}

type Incentive = { id: string; country: string; title_ar: string; description_ar: string; value: string; valid_until: string | null; source_url: string | null; reviewed_at: string | null }

async function getIncentives(): Promise<Incentive[]> {
  try {
    const rows = await queryWithRetry('SELECT id, country, title_ar, description_ar, value, valid_until, source_url, reviewed_at FROM incentives ORDER BY country, title_ar')
    return rows as Incentive[]
  } catch (err) {
    console.error('Failed to load incentives:', err)
    return []
  }
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function isExpired(validUntil: string | null): boolean {
  if (!validUntil) return false
  return new Date(validUntil) < new Date()
}

export default async function IncentivesPage() {
  const allIncentives = await getIncentives()
  const active = allIncentives.filter(i => !isExpired(i.valid_until))
  const expired = allIncentives.filter(i => isExpired(i.valid_until))

  const groupByCountry = (list: Incentive[]) => {
    const countries: Record<string, Incentive[]> = {}
    list.forEach(i => {
      if (!countries[i.country]) countries[i.country] = []
      countries[i.country].push(i)
    })
    return countries
  }

  const activeCountries = groupByCountry(active)
  const flags: Record<string, string> = { SA: '🇸🇦', AE: '🇦🇪', MA: '🇲🇦' }
  const names: Record<string, string> = { SA: 'السعودية', AE: 'الإمارات', MA: 'المغرب' }

  function IncentiveCard({ inc, expired }: { inc: Incentive; expired: boolean }) {
    return (
      <div className={`card-surface ${expired ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-tajawal font-bold text-[#FAF3E0]" style={{ fontFamily: 'Tajawal, sans-serif' }}>{inc.title_ar}</h3>
          {expired ? (
            <span className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              <Clock size={11} /> منتهي
            </span>
          ) : (
            <span className="badge-gold flex-shrink-0" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{inc.value}</span>
          )}
        </div>
        <p className="text-[#A89070] text-sm leading-relaxed mb-3" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{inc.description_ar}</p>
        <div className="flex items-center justify-between text-xs">
          {inc.valid_until && (
            <span
              className={expired ? 'text-rose-400 font-medium' : 'text-[#A89070]'}
              style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}
            >
              {expired ? 'انتهى في: ' : 'صالح حتى: '}
              {new Date(inc.valid_until).toLocaleDateString('en-GB')}
            </span>
          )}
          {inc.source_url && (
            <a href={inc.source_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#F5A623] hover:text-[#E09510]"
              style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              المصدر <ExternalLink size={10} />
            </a>
          )}
        </div>
        {(() => {
          const age = daysSince(inc.reviewed_at)
          if (age === null) return null
          const stale = age > 120
          return (
            <div
              className={`mt-2 pt-2 border-t border-[#F5A623]/5 text-[11px] ${stale ? 'text-amber-400' : 'text-[#A89070]/70'}`}
              style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}
            >
              {stale ? '⚠ ' : ''}آخر مراجعة يدوية: {new Date(inc.reviewed_at!).toLocaleDateString('en-GB')}
              {stale ? ' — يحتاج تحقق' : ''}
            </div>
          )
        })()}
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-20 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-6"><Breadcrumbs items={[{ label: 'الحوافز', href: '/incentives' }]} /></div>          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-lg mb-4">
              <Shield size={28} className="text-[#F5A623]" />
            </div>
            <h1 className="font-tajawal font-black text-4xl text-[#FAF3E0] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحوافز الحكومية</h1>
            <p className="text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>وفّر عند شراء سيارتك الكهربائية</p>
          </div>

          {Object.entries(activeCountries).map(([country, items]) => (
            <div key={country} className="mb-10">
              <h2 className="font-tajawal font-black text-2xl text-[#FAF3E0] mb-5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {flags[country]} {names[country]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map(inc => <IncentiveCard key={inc.id} inc={inc} expired={false} />)}
              </div>
            </div>
          ))}

          {allIncentives.length === 0 && (
            <div className="card-surface text-center py-16">
              <p className="text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>لا توجد بيانات بعد</p>
            </div>
          )}

          {active.length === 0 && allIncentives.length > 0 && (
            <div className="card-surface text-center py-12 mb-10">
              <p className="text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                لا توجد حوافز سارية حالياً — جميع الحوافز المسجلة منتهية الصلاحية
              </p>
            </div>
          )}

          {expired.length > 0 && (
            <details className="mb-4">
              <summary className="cursor-pointer text-sm text-[#A89070] hover:text-[#F5A623] transition-colors mb-5 select-none" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                عرض الحوافز المنتهية ({expired.length})
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                {expired.map(inc => <IncentiveCard key={inc.id} inc={inc} expired={true} />)}
              </div>
            </details>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
