import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { queryWithRetry } from '@/lib/db'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'المقالات | شحن MENA',
  description: 'أحدث مقالات السيارات الكهربائية بالعربية',
  alternates: { canonical: '/articles' },
}

type Article = { slug: string; title_ar: string; category: string | null; excerpt_ar: string | null; featured_image_url: string | null }

async function getArticles(): Promise<Article[]> {
  try {
    const rows = await queryWithRetry('SELECT slug, title_ar, category, excerpt_ar, featured_image_url FROM articles WHERE published = true ORDER BY created_at DESC LIMIT 20')
    return rows as Article[]
  } catch (err) {
    console.error('Failed to load articles list:', err)
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
                  className="group card-surface hover:border-[#F5A623]/50 transition-all overflow-hidden">
                  {a.featured_image_url && (
                    <div className="relative w-full aspect-[16/9] -mx-5 -mt-5 mb-4" style={{ width: 'calc(100% + 2.5rem)' }}>
                      <Image
                        src={a.featured_image_url}
                        alt={a.title_ar}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
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
