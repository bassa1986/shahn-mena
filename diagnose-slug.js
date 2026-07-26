// diagnose-slug.js — run once with: node diagnose-slug.js
import { query, closePool } from './scripts/db.js'

const testSlugs = [
  'استخدام-محطات-الشحن-العامة-بذكاء',
  'الحفاظ-على-بطارية-السيارة-الكهربائية-في-الحر',
]

for (const slug of testSlugs) {
  console.log('='.repeat(60))
  console.log('Testing slug:', slug)
  console.log('Byte length:', Buffer.byteLength(slug, 'utf8'))
  console.log('Char codes (first 10):', [...slug].slice(0, 10).map(c => c.codePointAt(0).toString(16)))

  const exact = await query('SELECT slug, published FROM articles WHERE slug = $1', [slug])
  console.log('Exact match (slug = $1):', exact.rows.length, 'row(s)', exact.rows)

  const exactPublished = await query('SELECT slug FROM articles WHERE slug = $1 AND published = true', [slug])
  console.log('Exact match + published=true:', exactPublished.rows.length, 'row(s)')
}

// Also dump the raw bytes of what's actually stored in the DB for comparison
const stored = await query(
  "SELECT slug FROM articles WHERE slug LIKE '%استخدام%' OR slug LIKE '%الحفاظ%'"
)
console.log('='.repeat(60))
console.log('Raw stored slugs (via LIKE):')
for (const row of stored.rows) {
  console.log('  slug:', row.slug)
  console.log('  byte length:', Buffer.byteLength(row.slug, 'utf8'))
  console.log('  char codes (first 10):', [...row.slug].slice(0, 10).map(c => c.codePointAt(0).toString(16)))
}

await closePool()
