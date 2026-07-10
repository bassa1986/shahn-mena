import { query, closePool } from '../db.js'

const INCENTIVES = [
  { country: 'SA', title_ar: 'إعفاء رسوم الجمارك على السيارات الكهربائية', description_ar: 'تُعفى السيارات الكهربائية بالكامل من رسوم الاستيراد الجمركية في إطار رؤية 2030.', value: 'إعفاء 100٪', valid_until: '2026-12-31', source_url: 'https://www.zatca.gov.sa' },
  { country: 'SA', title_ar: 'دعم تركيب شواحن المنازل', description_ar: 'دعم مالي من وزارة الطاقة لتركيب محطات الشحن المنزلية ضمن المبادرة الوطنية للمركبات الكهربائية.', value: 'دعم حتى 5,000 ر.س', valid_until: '2025-12-31', source_url: 'https://www.energy.gov.sa' },
  { country: 'SA', title_ar: 'إعفاء رسوم التسجيل والترخيص', description_ar: 'إعفاء السيارات الكهربائية من رسوم الترخيص السنوية لمدة خمس سنوات من تاريخ أول تسجيل.', value: 'إعفاء 5 سنوات', valid_until: '2027-12-31', source_url: 'https://www.moi.gov.sa' },
  { country: 'SA', title_ar: 'تخفيض رسوم الفحص الدوري', description_ar: 'تخفيض 50٪ على رسوم الفحص الدوري في مراكز الفحص الحكومية لجميع المركبات الكهربائية.', value: 'خصم 50٪', valid_until: null, source_url: 'https://www.moi.gov.sa' },
  { country: 'AE', title_ar: 'تصاريح وقوف مجانية للسيارات الكهربائية', description_ar: 'وقوف مجاني في مواقف البلديات والمراكز التجارية المعتمدة في دبي وأبوظبي.', value: 'وقوف مجاني', valid_until: '2026-06-30', source_url: 'https://www.dm.gov.ae' },
  { country: 'AE', title_ar: 'شحن مجاني عبر شبكة DEWA', description_ar: 'شحن مجاني في 300+ محطة DEWA للمركبات الكهربائية المسجلة في دبي.', value: 'شحن مجاني', valid_until: '2025-12-31', source_url: 'https://www.dewa.gov.ae' },
  { country: 'AE', title_ar: 'إعفاء رسوم التسجيل السنوي في أبوظبي', description_ar: 'هيئة أبوظبي للنقل تُعفي أصحاب السيارات الكهربائية من رسوم التسجيل السنوية بشكل دائم.', value: 'إعفاء دائم', valid_until: null, source_url: 'https://www.abudhabi.ae' },
  { country: 'AE', title_ar: 'خصم على رسوم الاستيراد بالإمارات', description_ar: 'المركبات الكهربائية تستفيد من تخفيض على رسوم الجمارك عند الاستيراد للاستخدام الشخصي.', value: 'خصم 25٪ جمارك', valid_until: '2026-12-31', source_url: 'https://www.moei.gov.ae' },
  { country: 'MA', title_ar: 'إعفاء ضريبة القيمة المضافة على السيارات الكهربائية', description_ar: 'خفض ضريبة القيمة المضافة على اقتناء السيارات الكهربائية الجديدة في المغرب.', value: 'خفض TVA 20٪', valid_until: '2026-12-31', source_url: 'https://www.finances.gov.ma' },
  { country: 'MA', title_ar: 'قرض بفائدة مخفّضة لشراء سيارة كهربائية', description_ar: 'قروض بنكية بضمان حكومي بفائدة 2٪ سنوياً لمدة حتى 7 سنوات لتمويل شراء السيارات الكهربائية.', value: 'فائدة 2٪ سنوياً', valid_until: '2025-12-31', source_url: null },
]

async function run() {
  console.log('\n🎁 Incentives Scraper\n')
  let inserted = 0, updated = 0

  for (const inc of INCENTIVES) {
    try {
      const existing = await query('SELECT id FROM incentives WHERE country=$1 AND title_ar=$2', [inc.country, inc.title_ar])
      if (existing.rows.length > 0) {
        await query('UPDATE incentives SET description_ar=$1, value=$2, valid_until=$3, source_url=$4 WHERE id=$5',
          [inc.description_ar, inc.value, inc.valid_until, inc.source_url, existing.rows[0].id])
        updated++
      } else {
        await query('INSERT INTO incentives (id,country,title_ar,description_ar,value,valid_until,source_url) VALUES (gen_random_uuid()::text,$1,$2,$3,$4,$5,$6)',
          [inc.country, inc.title_ar, inc.description_ar, inc.value, inc.valid_until, inc.source_url])
        inserted++
      }
    } catch (e) {
      console.error('Failed:', inc.title_ar, e.message)
    }
  }
  console.log(`✅ Done: ${inserted} inserted, ${updated} updated`)
}

run().then(() => closePool()).catch(e => { console.error(e); closePool(); process.exit(1) })
