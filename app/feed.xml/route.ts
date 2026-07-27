import { NextResponse } from 'next/server'
import { queryWithRetry } from '@/lib/db'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shahn-mena.vercel.app'

export const revalidate = 3600

type Article = { slug: string; title_ar: string; excerpt_ar: string | null; created_at: string }

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function getArticles(): Promise<Article[]> {
  try {
    const rows = await queryWithRetry(
      'SELECT slug, title_ar, excerpt_ar, created_at FROM articles WHERE published = true ORDER BY created_at DESC LIMIT 30'
    )
    return rows as Article[]
  } catch (err) {
    console.error('Failed to load articles for RSS feed:', err)
    return []
  }
}

export async function GET() {
  const articles = await getArticles()

  const items = articles.map(a => `
    <item>
      <title>${escapeXml(a.title_ar)}</title>
      <link>${siteUrl}/articles/${encodeURIComponent(a.slug)}</link>
      <guid isPermaLink="true">${siteUrl}/articles/${encodeURIComponent(a.slug)}</guid>
      <pubDate>${new Date(a.created_at).toUTCString()}</pubDate>
      ${a.excerpt_ar ? `<description>${escapeXml(a.excerpt_ar)}</description>` : ''}
    </item>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>شحن MENA — المقالات</title>
    <link>${siteUrl}/articles</link>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>أحدث مقالات السيارات الكهربائية بالعربية من شحن MENA</description>
    <language>ar</language>${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
