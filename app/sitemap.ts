import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shahn-mena.vercel.app'

type ArticleRow = { slug: string; created_at: string }

async function getArticleSlugs(): Promise<ArticleRow[]> {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql('SELECT slug, created_at FROM articles WHERE published = true ORDER BY created_at DESC')
    return rows as ArticleRow[]
  } catch (err) {
    console.error('Failed to load article slugs for sitemap:', err)
    // If the DB is unreachable at build time, still ship a sitemap with
    // the static routes rather than failing the whole build over this.
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`,              changeFrequency: 'daily',   priority: 1.0 },
    { url: `${siteUrl}/models`,        changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${siteUrl}/heat-guide`,    changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/charging-map`,  changeFrequency: 'daily',   priority: 0.8 },
    { url: `${siteUrl}/incentives`,    changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${siteUrl}/calculator`,    changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/articles`,      changeFrequency: 'daily',   priority: 0.8 },
    { url: `${siteUrl}/about`,         changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${siteUrl}/privacy`,       changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${siteUrl}/terms`,         changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const articles = await getArticleSlugs()
  const articleRoutes: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${siteUrl}/articles/${a.slug}`,
    lastModified: new Date(a.created_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...articleRoutes]
}
