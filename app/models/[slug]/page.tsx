import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Zap, Battery, Thermometer, ExternalLink, ChevronLeft } from 'lucide-react'
import { queryWithRetry } from '@/lib/db'

// Dynamic (not ISR-cached): a transient DB hiccup on one render must never
// get "stuck" as a cached 404 for up to an hour. Combined with the retry
// logic in lib/db.ts, every request now gets a fresh attempt.
export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shahn-mena.vercel.app'

type Model = {
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
  image_url: string | null
  reviewed_at: string | null
}

async function getModel(slug: string): Promise<Model | null> {
  try {
    const rows = await queryWithRetry(
      'SELECT slug, brand, name_ar, badge_ar, range_km, range_hot_km, charge_speed_kw, heat_loss_pct, price_sar, pros_ar, cons_ar, syarah_url, dubizzle_url, image_url, reviewed_at FROM ev_models WHERE slug = $1 AND active = true LIMIT 1',
      [slug]
    )
    return (rows[0] as Model) ?? null
  } catch (err) {
    console.error(`Failed to load model for slug "${slug}":`, err)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const model = await getModel(params.slug)
  if (!model) return { title: 'موديل | شحن MENA' }
  const title = `${model.brand} ${model.name_ar} — المواصفات والسعر`
  const description = `مواصفات ${model.brand} ${model.name_ar}: مدى ${model.range_km} كم، سعر ${model.price_sar.toLocaleString('en-US')} ر.س، وأداء البطارية في حرارة الخليج.`
  return {
    title,
    description,
    alternates: { canonical: `/models/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/models/${params.slug}`,
      images: model.image_url ? [{ url: model.image_url }] : undefined,
    },
  }
}

export default async function ModelPage({ params }: { params: { slug: string } }) {
  const model = await getModel(params.slug)
  if (!model) notFound()

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${model.brand} ${model.name_ar}`,
    brand: { '@type': 'Brand', name: model.brand },
    image: model.image_url ?? undefined,
    description: `مدى ${model.range_km} كم رسمي، شحن حتى ${model.charge_speed_kw} kW`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'SAR',
      price: model.price_sar,
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/models/${params.slug}`,
    },
  }

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <main dir="rtl" className="pt-20 pb-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <Breadcrumbs items={[{ label: 'الموديلات', href: '/models' }, { label: `${model.brand} ${model.name_ar}`, href: `/models/${params.slug}` }]} />

          {model.image_url && (
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-6">
              <Image src={model.image_url} alt={`${model.brand} ${model.name_ar}`} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
            </div>
          )}

          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-sm text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{model.brand}</span>
            {model.badge_ar && <span className="badge-gold text-xs" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{model.badge_ar}</span>}
          </div>
          <h1 className="font-tajawal font-black text-4xl text-[#FAF3E0] mb-6" style={{ fontFamily: 'Tajawal, sans-serif' }}>{model.name_ar}</h1>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="card-surface text-center py-4">
              <div className="text-[#FAF3E0] font-black text-xl">{model.range_km}</div>
              <div className="text-xs text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>كم رسمي</div>
            </div>
            <div className="card-surface text-center py-4">
              <div className="text-[#FAF3E0] font-black text-xl flex items-center justify-center gap-1"><Thermometer size={14} className="text-[#F5A623]" />{model.range_hot_km}</div>
              <div className="text-xs text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>كم في الحر</div>
            </div>
            <div className="card-surface text-center py-4">
              <div className="text-[#FAF3E0] font-black text-xl flex items-center justify-center gap-1"><Zap size={14} className="text-[#F5A623]" />{model.charge_speed_kw}</div>
              <div className="text-xs text-[#A89070]">kW شحن</div>
            </div>
          </div>

          <div className="card-surface mb-6">
            <div className="text-sm text-rose-400 mb-4" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              فقدان {model.heat_loss_pct}٪ من المدى في الحر الشديد
            </div>
            {model.pros_ar.length > 0 && (
              <ul className="text-sm text-[#A89070] mb-3 space-y-1.5" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                {model.pros_ar.map((p, i) => <li key={i}>✓ {p}</li>)}
              </ul>
            )}
            {model.cons_ar.length > 0 && (
              <ul className="text-sm text-[#A89070]/70 space-y-1.5" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                {model.cons_ar.map((c, i) => <li key={i}>✗ {c}</li>)}
              </ul>
            )}
          </div>

          <div className="card-surface mb-8">
            <div className="font-tajawal font-black text-2xl text-[#F5A623] mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {model.price_sar.toLocaleString('en-US')} ر.س
            </div>
            <div className="flex gap-3">
              {model.syarah_url && (
                <a href={model.syarah_url} target="_blank" rel="noopener noreferrer nofollow sponsored"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#F5A623] text-[#0D1B2A] font-bold py-3 rounded-lg" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                  سيارة <ExternalLink size={14} />
                </a>
              )}
              {model.dubizzle_url && (
                <a href={model.dubizzle_url} target="_blank" rel="noopener noreferrer nofollow sponsored"
                  className="flex-1 flex items-center justify-center gap-2 border border-[#F5A623]/40 text-[#F5A623] font-bold py-3 rounded-lg" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                  دوبيزل <ExternalLink size={14} />
                </a>
              )}
            </div>
            {model.reviewed_at && (
              <div className="mt-3 text-xs text-[#A89070]/60" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                آخر مراجعة للسعر: {new Date(model.reviewed_at).toLocaleDateString('en-GB')}
              </div>
            )}
          </div>

          <Link href="/models" className="inline-flex items-center gap-1 text-sm text-[#A89070] hover:text-[#F5A623] transition-colors" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
            <ChevronLeft size={14} /> عرض كل الموديلات
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
