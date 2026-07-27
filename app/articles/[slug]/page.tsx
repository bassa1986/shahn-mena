import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import sanitizeHtml from 'sanitize-html'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'

export const revalidate = 3600

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shahn-mena.vercel.app'

type Article = {
  title_ar: string
  body_ar: string
  category: string | null
  created_at: string
  seo_description: string | null
  json_ld: Record<string, unknown> | null
  featured_image_url: string | null
}

type RelatedArticle = { slug: string; title_ar: string; featured_image_url: string | null }

async function getRelatedArticles(category: string | null, currentSlug: string): Promise<RelatedArticle[]> {
  if (!category) return []
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql(
      'SELECT slug, title_ar, featured_image_url FROM articles WHERE published = true AND category = $1 AND slug != $2 ORDER BY created_at DESC LIMIT 3',
      [category, currentSlug]
    )
    return rows as RelatedArticle[]
  } catch (err) {
    console.error('Failed to load related articles:', err)
    return []
  }
}

// article.body_ar is written by an LLM (scripts/scrapers/articles-generator.js)
// summarizing scraped third-party RSS/HTML content. That makes it untrusted
// input as far as rendering is concerned, even though it isn't user-submitted
// directly — strip it down to a safe subset before it ever reaches the DOM.
const ARTICLE_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'br'],
  allowedAttributes: { a: ['href', 'rel', 'target'] },
  allowedSchemes: ['https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
  },
}

function sanitizeArticleBody(html: string): string {
  return sanitizeHtml(html, ARTICLE_SANITIZE_OPTIONS)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql('SELECT seo_title, seo_description, featured_image_url FROM articles WHERE slug = $1 AND published = true LIMIT 1', [params.slug])
    if (!rows[0]) return { title: 'مقال | شحن MENA' }
    const row = rows[0] as { seo_title: string | null; seo_description: string | null; featured_image_url: string | null }
    return {
      title: row.seo_title ?? 'مقال',
      description: row.seo_description ?? '',
      alternates: { canonical: `/articles/${params.slug}` },
      openGraph: {
        type: 'article',
        title: row.seo_title ?? 'مقال',
        description: row.seo_description ?? '',
        url: `${siteUrl}/articles/${params.slug}`,
        images: row.featured_image_url ? [{ url: row.featured_image_url }] : undefined,
      },
    }
  } catch (err) {
    console.error(`generateMetadata failed for slug "${params.slug}":`, err)
    return { title: 'مقال | شحن MENA' }
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  let article: Article | null = null
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql(
      'SELECT title_ar, body_ar, category, created_at, seo_description, json_ld, featured_image_url FROM articles WHERE slug = $1 AND published = true LIMIT 1',
      [params.slug]
    )
    if (rows[0]) article = rows[0] as Article
  } catch (err) {
    console.error(`Failed to load article for slug "${params.slug}":`, err)
  }
  if (!article) notFound()

  const relatedArticles = await getRelatedArticles(article.category, params.slug)
  const safeBody = sanitizeArticleBody(article.body_ar)
  const articleUrl = `${siteUrl}/articles/${params.slug}`

  // Prefer a json_ld value set at generation time; otherwise compute a
  // reasonable Article schema on the fly so every published article has
  // structured data either way.
  const articleJsonLd = article.json_ld ?? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title_ar,
    description: article.seo_description ?? undefined,
    image: article.featured_image_url ?? undefined,
    datePublished: article.created_at,
    inLanguage: 'ar',
    author: { '@type': 'Organization', name: 'شحن MENA' },
    publisher: { '@type': 'Organization', name: 'شحن MENA', url: siteUrl },
    mainEntityOfPage: articleUrl,
  }

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <main dir="rtl" className="pt-20 pb-24 min-h-screen">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <Breadcrumbs items={[{ label: 'المقالات', href: '/articles' }, { label: article.title_ar, href: `/articles/${params.slug}` }]} />
          {article.featured_image_url && (
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-6">
              <Image
                src={article.featured_image_url}
                alt={article.title_ar}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}
          {article.category && <span className="badge-gold mb-4 inline-block" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{article.category}</span>}
          <h1 className="font-tajawal font-black text-4xl text-[#FAF3E0] mb-6" style={{ fontFamily: 'Tajawal, sans-serif' }}>{article.title_ar}</h1>
          <div className="text-[#A89070] leading-relaxed" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: safeBody }} />

          {relatedArticles.length > 0 && (
            <div className="mt-14 pt-8 border-t border-[#F5A623]/10">
              <h2 className="font-tajawal font-black text-xl text-[#FAF3E0] mb-5" style={{ fontFamily: 'Tajawal, sans-serif' }}>مقالات ذات صلة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map(r => (
                  <Link key={r.slug} href={`/articles/${r.slug}`}
                    className="group card-surface hover:border-[#F5A623]/50 transition-all overflow-hidden">
                    {r.featured_image_url && (
                      <div className="relative w-full aspect-[16/9] -mx-5 -mt-5 mb-3" style={{ width: 'calc(100% + 2.5rem)' }}>
                        <Image src={r.featured_image_url} alt={r.title_ar} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                      </div>
                    )}
                    <p className="font-tajawal font-bold text-sm text-[#FAF3E0] group-hover:text-[#F5A623] transition-colors" style={{ fontFamily: 'Tajawal, sans-serif' }}>{r.title_ar}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
