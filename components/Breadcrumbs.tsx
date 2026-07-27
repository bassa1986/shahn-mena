import Link from 'next/link'
import { ChevronLeft, Home } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shahn-mena.vercel.app'

type Crumb = { label: string; href: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: siteUrl },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.label,
        item: `${siteUrl}${item.href}`,
      })),
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="مسار التنقل" className="flex items-center gap-1.5 text-xs text-[#A89070] mb-6 flex-wrap" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
        <Link href="/" className="flex items-center gap-1 hover:text-[#F5A623] transition-colors">
          <Home size={12} /> الرئيسية
        </Link>
        {items.map((item, i) => (
          <span key={item.href} className="flex items-center gap-1.5">
            <ChevronLeft size={12} className="opacity-50" />
            {i === items.length - 1 ? (
              <span className="text-[#FAF3E0]">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-[#F5A623] transition-colors">{item.label}</Link>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
