// check-one.js — run once with: node check-one.js
import { query, closePool } from './scripts/db.js'

const result = await query(
  "SELECT slug, published, featured_image_url IS NOT NULL AS has_image FROM articles WHERE slug LIKE '%استخدام%' OR slug LIKE '%محطات%'"
)

console.log(result.rows)
await closePool()
