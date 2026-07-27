import { query, closePool } from './scripts/db.js'

const result = await query(
  'SELECT slug, published, created_at FROM articles ORDER BY created_at DESC'
)

console.log(`Total articles in DB: ${result.rows.length}\n`)
for (const row of result.rows) {
  console.log(`[${row.published ? 'PUBLISHED' : 'draft    '}]  ${row.slug}`)
}

await closePool()
