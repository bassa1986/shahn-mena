import type { Metadata } from 'next'
import { Mail, Zap, Target, Users } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'من نحن',
  description: 'شحن MENA هو دليل مستقل للسيارات الكهربائية في دول الخليج والشرق الأوسط — بيانات شحن، حوافز حكومية، ومقارنات موديلات محدثة باستمرار.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-28 pb-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-tajawal font-black text-4xl text-[#FAF3E0] mb-6" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            من نحن
          </h1>

          <div className="space-y-8 text-[#A89070] leading-relaxed" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
            <section>
              <p>
                <strong className="text-[#FAF3E0]">شحن MENA</strong> هو مصدر مستقل ومجاني باللغة العربية
                لكل ما يخص السيارات الكهربائية في منطقة الخليج والشرق الأوسط — من مقارنة الموديلات ومداها
                الفعلي في حرارة الصيف، إلى خرائط محطات الشحن العامة، والحوافز الحكومية المتاحة في كل دولة،
                وحاسبة تقارن تكلفة تشغيل السيارة الكهربائية بسيارة الوقود التقليدية.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Target size={20} /> لماذا أنشأنا هذا الموقع
              </h2>
              <p>
                أغلب المحتوى المتوفر عن السيارات الكهربائية موجّه للأسواق الغربية ولا يأخذ بعين الاعتبار
                تحديات مناخ الخليج — كتأثير الحرارة الشديدة على عمر البطارية، أسعار الكهرباء المحلية،
                وتوفر محطات الشحن الفعلي في كل مدينة. نجمع هذه البيانات ونحدّثها بشكل دوري لنقدّم صورة
                واقعية تساعد القارئ العربي على اتخاذ قرار شراء مبني على معلومات دقيقة، لا على ترجمة حرفية
                لمحتوى أجنبي.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Zap size={20} /> كيف نجمع بياناتنا
              </h2>
              <p>
                بيانات محطات الشحن وأسعار الوقود والحوافز الحكومية تُجمع وتُحدَّث بشكل دوري من مصادر عامة
                ورسمية، وتُراجَع دورياً للتأكد من دقتها. مقالات الأخبار تُلخَّص من مصادر إخبارية معروفة
                ثم تُراجَع قبل نشرها. أي معلومة نشك في دقتها لا نُنشرها.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Users size={20} /> من يقف وراء الموقع
              </h2>
              <p>
                شحن MENA مشروع مستقل يُدار ويُحرَّر بواسطة فريق صغير مهتم بالتنقل الكهربائي في المنطقة.
                لسنا وكلاء لأي شركة سيارات ولا نتلقى مقابلاً لذكر أي موديل أو محطة شحن بعينها في المحتوى
                التحريري.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Mail size={20} /> تواصل معنا
              </h2>
              <p>
                لأي استفسار، تصحيح لمعلومة، أو اقتراح تعاون، راسلنا مباشرة على{' '}
                <a href="mailto:menashahan@gmail.com" className="text-[#F5A623] hover:underline">
                  menashahan@gmail.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
