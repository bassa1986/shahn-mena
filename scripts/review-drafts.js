// scripts/review-drafts.js
//
// The Generate Articles workflow inserts new articles with published: false
// and there is currently no admin UI in this codebase to review them —
// app/admin, app/api/admin, and components/admin are all empty directories.
// Rather than build a web admin dashboard (which would need auth, cookies,
// and a decision about whether it's ever exposed on Vercel — you already
// said you want admin tooling local-only), this does the same job as a
// plain interactive script you run from your own machine.
//
// Usage:
//   cd scripts
//   node review-drafts.js
//
// For each unpublished draft it shows the title, excerpt, and category,
// then asks what to do with it. Nothing happens to a row until you
// answer for it — this never bulk-publishes or bulk-deletes silently.

import { neon } from '@neondatabase/serverless'
import readline from 'readline/promises'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const sql = neon(process.env.DATABASE_URL)
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

async function getDrafts() {
  return sql`
    SELECT id, title_ar, slug, excerpt_ar, category, created_at
    FROM articles
    WHERE published = false
    ORDER BY created_at ASC
  `
}

async function publish(id) {
  await sql`UPDATE articles SET published = true WHERE id = ${id}`
}

async function deleteDraft(id) {
  await sql`DELETE FROM articles WHERE id = ${id}`
}

function printDivider() {
  console.log('─'.repeat(60))
}

async function run() {
  const drafts = await getDrafts()

  if (drafts.length === 0) {
    console.log('No unpublished drafts waiting for review.')
    rl.close()
    return
  }

  console.log(`${drafts.length} draft article(s) waiting for review.\n`)
  console.log('For each one: [p]ublish, [s]kip (leave as draft), [d]elete, [q]uit\n')

  let published = 0, deleted = 0, skipped = 0

  for (const [i, draft] of drafts.entries()) {
    printDivider()
    console.log(`(${i + 1}/${drafts.length}) ${draft.title_ar}`)
    console.log(`slug: ${draft.slug}`)
    console.log(`category: ${draft.category ?? '(none)'}`)
    console.log(`created: ${new Date(draft.created_at).toLocaleString('en-GB')}`)
    if (draft.excerpt_ar) console.log(`\n${draft.excerpt_ar}\n`)

    const answer = (await rl.question('[p]ublish / [s]kip / [d]elete / [q]uit > ')).trim().toLowerCase()

    if (answer === 'q') {
      console.log('\nStopping. Remaining drafts left untouched.')
      break
    } else if (answer === 'p') {
      await publish(draft.id)
      published++
      console.log('→ published')
    } else if (answer === 'd') {
      await deleteDraft(draft.id)
      deleted++
      console.log('→ deleted')
    } else {
      skipped++
      console.log('→ left as draft')
    }
  }

  printDivider()
  console.log(`\nDone. Published: ${published}  Deleted: ${deleted}  Left as draft: ${skipped}`)
  rl.close()
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Review failed:', err)
    rl.close()
    process.exit(1)
  })
