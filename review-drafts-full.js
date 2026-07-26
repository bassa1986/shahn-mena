// review-drafts-full.js — run once with: node review-drafts-full.js
// Prints the full body_ar for the 4 legitimate scraper-generated drafts
// so you can read them properly before deciding whether to publish.
// Delete this file when done.
import { query, closePool } from './scripts/db.js'

const slugs = [
  'byd-denza-z-mrkjebtt',
  'byds-new-qin-max-ev-with-mrlwymt2',
  'the-16-cheapest-electric-cars-in-mrlwyow7',
  'jlr-switches-charging-service-from-plugsurfing-mrlwyr9u',
]

const placeholders = slugs.map((_, i) => `$${i + 1}`).join(', ')

const result = await query(
  `SELECT slug, title_ar, body_ar FROM articles WHERE slug IN (${placeholders})`,
  slugs
)

for (const row of result.rows) {
  console.log('='.repeat(70))
  console.log('SLUG:', row.slug)
  console.log('TITLE:', row.title_ar)
  console.log('-'.repeat(70))
  console.log(row.body_ar)
  console.log('')
}

await closePool()
