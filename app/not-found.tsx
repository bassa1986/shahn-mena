import Link from 'next/link'
import { Zap, Battery, MapPin, Shield, Home } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-32 pb-24 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-lg mb-6">
            <Zap size={32} className="text-[#F5A623]" />
          </div>
          <h1 className="font-tajawal font-black text-5xl text-[#FAF3E0] mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            404
          </h1>
          <p className="text-[#A89070] text-lg mb-10" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
            هذه الصفحة غير موجودة، أو تم نقلها. جرّب أحد الروابط أدناه:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
            {[
              { icon: <Home size={20} />,    label: 'الرئيسية',       href: '/',             desc: 'العودة للصفحة الرئيسية' },
              { icon: <Battery size={20} />, label: 'الموديلات',      href: '/models',       desc: 'مقارنة السيارات الكهربائية' },
              { icon: <MapPin size={20} />,  label: 'خريطة الشحن',    href: '/charging-map', desc: 'أقرب محطة شحن إليك' },
              { icon: <Shield size={20} />,  label: 'الحوافز',        href: '/incentives',   desc: 'الإعفاءات الحكومية' },
            ].map(c => (
              <Link key={c.href} href={c.href}
                className="group flex items-center gap-4 card-surface hover:border-[#F5A623]/50 transition-all">
                <div className="text-[#F5A623] flex-shrink-0">{c.icon}</div>
                <div>
                  <p className="font-tajawal font-bold text-[#FAF3E0] group-hover:text-[#F5A623] transition-colors" style={{ fontFamily: 'Tajawal, sans-serif' }}>{c.label}</p>
                  <p className="text-xs text-[#A89070]" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
