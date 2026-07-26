import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
  description: 'سياسة الخصوصية الخاصة بموقع شحن MENA — كيفية استخدام ملفات تعريف الارتباط والإعلانات وبيانات الزوار.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-28 pb-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-tajawal font-black text-4xl text-[#FAF3E0] mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            سياسة الخصوصية
          </h1>
          <p className="text-sm text-[#A89070] mb-8">آخر تحديث: يوليو 2026</p>

          <div className="space-y-8 text-[#A89070] leading-relaxed" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
            <section>
              <p>
                نحترم خصوصية زوار موقع <strong className="text-[#FAF3E0]">شحن MENA</strong> (shahn-mena.vercel.app)
                وتوضح هذه الصفحة نوع البيانات التي نجمعها، وكيف تُستخدم، ومن يشاركها معنا — بما يشمل شركاء
                الإعلانات مثل Google.
              </p>
            </section>

            <section>
              <h2 className="font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                ملفات تعريف الارتباط (Cookies)
              </h2>
              <p>
                يستخدم هذا الموقع، أو قد يستخدم مستقبلاً، ملفات تعريف ارتباط لتحسين تجربة التصفح وقياس
                الزيارات، ولعرض إعلانات مناسبة عبر شبكة Google AdSense. تتيح هذه الملفات لشركاء الإعلان
                عرض إعلانات بناءً على زياراتك لهذا الموقع ومواقع أخرى.
              </p>
            </section>

            <section>
              <h2 className="font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إعلانات Google وطرف ثالث
              </h2>
              <p>
                نستخدم أو نعتزم استخدام Google AdSense لعرض الإعلانات على هذا الموقع. تستخدم Google، بصفتها
                طرفاً ثالثاً، ملفات تعريف ارتباط (بما في ذلك ملف تعريف الارتباط DoubleClick DART) لعرض
                إعلانات بناءً على زيارات المستخدم السابقة لهذا الموقع أو مواقع أخرى على الإنترنت.
              </p>
              <p className="mt-3">
                يمكن للمستخدمين إلغاء الاشتراك في استخدام ملف تعريف الارتباط DART للإعلانات المخصصة عبر
                زيارة{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F5A623] hover:underline"
                >
                  سياسة إعلانات Google
                </a>
                . كما يمكن إدارة تفضيلات الإعلانات من خلال{' '}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F5A623] hover:underline"
                >
                  إعدادات إعلانات Google
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                بيانات التحليلات
              </h2>
              <p>
                قد نستخدم أدوات تحليل زيارات (مثل Google Analytics أو ما شابهها) لفهم كيفية استخدام الزوار
                للموقع بشكل مجمّع وغير شخصي، بهدف تحسين المحتوى وتجربة الاستخدام. لا نقوم ببيع أو مشاركة
                بيانات الزوار الشخصية مع أي طرف لغرض تجاري خارج نطاق الإعلانات وتحليلات الأداء الموضحة هنا.
              </p>
            </section>

            <section>
              <h2 className="font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                روابط لمواقع خارجية
              </h2>
              <p>
                يحتوي الموقع على روابط لمصادر خارجية (مواقع حكومية للحوافز، منصات بيع سيارات، مصادر إخبارية).
                لا نتحمل مسؤولية سياسات الخصوصية أو المحتوى الخاص بهذه المواقع الخارجية.
              </p>
            </section>

            <section>
              <h2 className="font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                موافقتك
              </h2>
              <p>
                باستخدامك لهذا الموقع، فإنك توافق على سياسة الخصوصية هذه. قد نقوم بتحديث هذه الصفحة من وقت
                لآخر، وسيُشار إلى تاريخ آخر تحديث أعلى الصفحة.
              </p>
            </section>

            <section>
              <h2 className="font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التواصل بخصوص الخصوصية
              </h2>
              <p>
                لأي استفسار بخصوص هذه السياسة أو بياناتك، راسلنا على{' '}
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
