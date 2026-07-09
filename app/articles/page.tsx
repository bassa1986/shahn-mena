import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'المقالات | شحن MENA',
  description: 'أحدث مقالات السيارات الكهربائية بالعربية',
}

type Article = { slug: string; title_ar: string; category: string | null; excerpt_ar: string | null }

async function getArticles(): Promise<Article[]> {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql('SELECT slug, title_ar, category, excerpt_ar FROM articles WHERE published = true ORDER BY created_at DESC LIMIT 20')
    return rows as Article[]
  } catch {
    return []
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-20 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-tajawal font-black text-4xl text-[#FAF3E0] mb-8" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقالات</h1>
          {articles.length === 0 ? (
            <div className="card-surface text-center py-16">
              <p className="text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>لا توجد مقالات منشورة بعد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(articles as Article[]).map(a => (
                <Link key={a.slug} href={'/articles/' + a.slug}
                  className="group card-surface hover:border-[#F5A623]/50 transition-all">
                  {a.category && <span className="badge-gold text-xs mb-3 inline-block">{a.category}</span>}
                  <h2 className="font-tajawal font-bold text-[#FAF3E0] group-hover:text-[#F5A623] transition-colors mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{a.title_ar}</h2>
                  {a.excerpt_ar && <p className="text-[#A89070] text-sm line-clamp-2" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{a.excerpt_ar}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
