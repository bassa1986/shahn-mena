import type { Metadata } from 'next'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shahn-mena.vercel.app'

export const metadata: Metadata = {
  title: { default: 'شحن MENA — دليل السيارات الكهربائية', template: '%s | شحن MENA' },
  description: 'دليل شامل للسيارات الكهربائية في منطقة الخليج والشرق الأوسط',
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    siteName: 'شحن MENA',
    title: 'شحن MENA — دليل السيارات الكهربائية',
    description: 'دليل شامل للسيارات الكهربائية في منطقة الخليج والشرق الأوسط',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شحن MENA — دليل السيارات الكهربائية',
    description: 'دليل شامل للسيارات الكهربائية في منطقة الخليج والشرق الأوسط',
  },
  // Once verified in Google Search Console, drop the token in here:
  // verification: { google: 'YOUR_SEARCH_CONSOLE_TOKEN' },
  // app/opengraph-image.tsx is picked up automatically by Next.js's
  // file convention — no need to reference it manually here.
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'شحن MENA',
  url: siteUrl,
  description: 'دليل مستقل للسيارات الكهربائية في منطقة الخليج والشرق الأوسط',
  sameAs: [] as string[],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'شحن MENA',
  url: siteUrl,
  inLanguage: 'ar',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Noto+Sans+Arabic:wght@400;500;700&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
