import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const revalidate = 3600

type Article = { title_ar: string; body_ar: string; category: string | null }

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql('SELECT seo_title, seo_description FROM articles WHERE slug = $1 AND published = true LIMIT 1', [params.slug])
    if (!rows[0]) return { title: 'مقال | شحن MENA' }
    const row = rows[0] as { seo_title: string | null; seo_description: string | null }
    return { title: row.seo_title ?? 'مقال', description: row.seo_description ?? '' }
  } catch { return { title: 'مقال | شحن MENA' } }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  let article: Article | null = null
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql('SELECT title_ar, body_ar, category FROM articles WHERE slug = $1 AND published = true LIMIT 1', [params.slug])
    if (rows[0]) article = rows[0] as Article
  } catch {}
  if (!article) notFound()

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-20 pb-24 min-h-screen">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          {article.category && <span className="badge-gold mb-4 inline-block" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{article.category}</span>}
          <h1 className="font-tajawal font-black text-4xl text-[#FAF3E0] mb-6" style={{ fontFamily: 'Tajawal, sans-serif' }}>{article.title_ar}</h1>
          <div className="text-[#A89070] leading-relaxed" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: article.body_ar }} />
        </article>
      </main>
      <Footer />
    </>
  )
}
