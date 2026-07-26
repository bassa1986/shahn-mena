import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'الشروط والأحكام',
  description: 'الشروط والأحكام الخاصة باستخدام موقع شحن MENA.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-28 pb-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-tajawal font-black text-4xl text-[#FAF3E0] mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الشروط والأحكام
          </h1>
          <p className="text-sm text-[#A89070] mb-8">آخر تحديث: يوليو 2026</p>

          <div className="space-y-8 text-[#A89070] leading-relaxed" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
            <section>
              <p>
                باستخدامك لموقع <strong className="text-[#FAF3E0]">شحن MENA</strong> (shahn-mena.vercel.app)
                فإنك توافق على الشروط والأحكام التالية. إذا كنت لا توافق على أي جزء منها، يُرجى عدم استخدام
                الموقع.
              </p>
            </section>

            <section>
              <h2 className="font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                طبيعة المحتوى
              </h2>
              <p>
                المحتوى المنشور في هذا الموقع — بما يشمل بيانات محطات الشحن، أسعار الكهرباء والوقود،
                الحوافز الحكومية، مواصفات الموديلات، ونتائج حاسبة التوفير — يُقدَّم لأغراض معلوماتية عامة
                فقط، ولا يُعد استشارة مالية أو قانونية أو فنية. نبذل جهداً معقولاً لتحديث هذه البيانات
                بشكل دوري، إلا أننا لا نضمن دقتها الكاملة في كل لحظة نظراً لتغيّر الأسعار والسياسات بشكل
                متكرر.
              </p>
            </section>

            <section>
              <h2 className="font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                عدم المسؤولية عن القرارات
              </h2>
              <p>
                أي قرار شراء أو استخدام يتعلق بسيارة كهربائية، محطة شحن، أو برنامج حوافز حكومي يجب التحقق
                منه مباشرة من المصدر الرسمي (الوكيل، الجهة الحكومية، أو مزود الخدمة) قبل الاعتماد عليه.
                لا يتحمل شحن MENA مسؤولية أي قرار أو خسارة مالية مبنية فقط على المعلومات المنشورة هنا.
              </p>
            </section>

            <section>
              <h2 className="font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الملكية الفكرية
              </h2>
              <p>
                جميع النصوص والتصاميم الأصلية في هذا الموقع محمية بحقوق النشر. يُسمح بمشاركة الروابط
                والاقتباس المحدود مع الإشارة إلى المصدر، ولا يُسمح بإعادة نشر المحتوى كاملاً دون إذن مسبق.
              </p>
            </section>

            <section>
              <h2 className="font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الإعلانات
              </h2>
              <p>
                قد يعرض هذا الموقع إعلانات من شبكات إعلانية خارجية مثل Google AdSense. لا يعني ظهور أي
                إعلان تأييد شحن MENA للمنتج أو الخدمة المعلن عنها. راجع{' '}
                <a href="/privacy" className="text-[#F5A623] hover:underline">سياسة الخصوصية</a>{' '}
                لمزيد من التفاصيل حول كيفية عمل هذه الإعلانات.
              </p>
            </section>

            <section>
              <h2 className="font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                روابط خارجية
              </h2>
              <p>
                يحتوي الموقع على روابط لمواقع طرف ثالث (وكلاء، منصات بيع، جهات حكومية، مصادر إخبارية).
                لسنا مسؤولين عن محتوى أو سياسات هذه المواقع الخارجية.
              </p>
            </section>

            <section>
              <h2 className="font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تعديل الشروط
              </h2>
              <p>
                يجوز لنا تحديث هذه الشروط في أي وقت، وسيُعتبر استمرارك في استخدام الموقع بعد أي تعديل
                موافقة ضمنية على الشروط المحدَّثة.
              </p>
            </section>

            <section>
              <h2 className="font-tajawal font-bold text-xl text-[#F5A623] mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التواصل
              </h2>
              <p>
                لأي استفسار بخصوص هذه الشروط، راسلنا على{' '}
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
