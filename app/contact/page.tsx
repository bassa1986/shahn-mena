'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// This page exists only as a fallback for anyone who lands on /contact
// directly (bookmark, old link, typed URL). Nothing in the Navbar or
// Footer links here — the Footer uses a direct mailto: anchor instead,
// which doesn't depend on this route at all.
//
// This MUST stay a client component. An earlier version used a
// server-side redirect() with an Arabic-encoded mailto URL, which broke
// `next build` on Vercel with a ByteString header conversion error
// (Arabic characters aren't valid in HTTP headers, which is what
// server-side redirect() ultimately writes to). Doing the redirect in
// the browser via window.location.href sidesteps that entirely, since
// it never touches an HTTP header.

export default function ContactPage() {
  const router = useRouter()

  useEffect(() => {
    window.location.href = 'mailto:menashahan@gmail.com?subject=%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D9%85%D9%86%20%D8%B4%D8%AD%D9%86%20MENA'
    const t = setTimeout(() => router.push('/'), 1200)
    return () => clearTimeout(t)
  }, [router])

  return (
    <main
      dir="rtl"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0D1B2A',
      }}
    >
      <div style={{ textAlign: 'center', color: '#FAF3E0', fontFamily: 'Tajawal, sans-serif' }}>
        <div style={{ fontSize: '40px', marginBottom: '14px' }}>✉️</div>
        <p style={{ fontSize: '18px', color: '#F5A623', marginBottom: '6px' }}>جاري فتح بريدك الإلكتروني...</p>
        <p style={{ fontSize: '13px', color: '#A89070' }}>menashahan@gmail.com</p>
      </div>
    </main>
  )
}
