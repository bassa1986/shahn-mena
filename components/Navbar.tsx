'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Menu, X, ChevronLeft } from 'lucide-react'

const NAV_LINKS = [
  { href: '/articles',     label: 'المقالات' },
  { href: '/models',       label: 'الموديلات' },
  { href: '/heat-guide',   label: 'الحرارة' },
  { href: '/charging-map', label: 'الشحن' },
  { href: '/incentives',   label: 'الحوافز' },
]

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0D1B2A]/95 backdrop-blur-md border-b border-[#F5A623]/15 shadow-lg' : 'bg-transparent'}`} dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <span className="w-8 h-8 bg-[#F5A623] rounded-sm flex items-center justify-center">
              <Zap size={16} className="text-[#0D1B2A]" strokeWidth={2.5} />
            </span>
            <span className="font-tajawal font-black text-[#F5A623] text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>شحن MENA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link key={link.href} href={link.href}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${active ? 'text-[#F5A623] bg-[#F5A623]/10' : 'text-[#A89070] hover:text-[#FAF3E0]'}`}
                  style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/calculator" className="btn-primary hidden sm:inline-flex text-sm px-4 py-2" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              <Zap size={14} /> احسب توفيرك
            </Link>
            <button onClick={() => setOpen(v => !v)} className="md:hidden p-2 text-[#A89070] hover:text-[#FAF3E0]">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#F5A623]/15 bg-[#0D1B2A]/98 backdrop-blur-md">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded text-sm font-medium transition-colors ${pathname === link.href ? 'text-[#F5A623] bg-[#F5A623]/10' : 'text-[#A89070] hover:text-[#FAF3E0]'}`}
                style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                {link.label} <ChevronLeft size={14} className="text-[#A89070]" />
              </Link>
            ))}
            <Link href="/calculator" className="btn-primary mt-2 text-sm py-3 justify-center" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              <Zap size={14} /> احسب توفيرك
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
