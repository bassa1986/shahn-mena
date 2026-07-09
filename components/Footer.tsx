import Link from 'next/link'
import { Zap, Mail } from 'lucide-react'

const LINKS = [
  { label: 'الموديلات',      href: '/models' },
  { label: 'دليل الحرارة',   href: '/heat-guide' },
  { label: 'خريطة الشحن',   href: '/charging-map' },
  { label: 'الحوافز',        href: '/incentives' },
  { label: 'حاسبة التوفير',  href: '/calculator' },
  { label: 'المقالات',       href: '/articles' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#F5A623]/10 bg-[#0A1520] mt-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 bg-[#F5A623] rounded-sm flex items-center justify-center">
                <Zap size={16} className="text-[#0D1B2A]" />
              </span>
              <span className="font-tajawal font-black text-[#F5A623] text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>شحن MENA</span>
            </div>
            <p className="text-[#A89070] text-sm leading-relaxed" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              دليل السيارات الكهربائية الأول في منطقة الخليج والشرق الأوسط.
            </p>
          </div>

          <div>
            <h3 className="font-tajawal font-bold text-[#FAF3E0] mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>روابط سريعة</h3>
            <nav className="flex flex-col gap-2">
              {LINKS.map(l => (
                <Link key={l.href} href={l.href}
                  className="text-sm text-[#A89070] hover:text-[#F5A623] transition-colors"
                  style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-tajawal font-bold text-[#FAF3E0] mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>تواصل معنا</h3>
            <a href="mailto:menashahan@gmail.com?subject=استفسار من شحن MENA"
              className="flex items-center gap-2 text-sm text-[#A89070] hover:text-[#F5A623] transition-colors"
              style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              <Mail size={14} /> menashahan@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-[#F5A623]/10 pt-6 text-center text-xs text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
          © 2025 شحن MENA — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  )
}
