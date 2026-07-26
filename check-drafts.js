// check-drafts.js — run once with: node check-drafts.js
// Then delete this file.
import { query, closePool } from './scripts/db.js'

const result = await query(
  'SELECT slug, title_ar, excerpt_ar FROM articles WHERE published = false'
)

console.log(`\n${result.rows.length} unpublished draft(s):\n`)
for (const row of result.rows) {
  console.log('slug:', row.slug)
  console.log('title:', row.title_ar)
  console.log('excerpt:', row.excerpt_ar)
  console.log('---')
}

await closePool()
