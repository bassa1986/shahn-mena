// scripts/scrapers/articles-generator.js
// Scrapes EV news from RSS feeds and generates Arabic articles
// Engine priority: Ollama (local free) → Groq (cloud free)

import axios from 'axios'
import * as cheerio from 'cheerio'
import sanitizeHtml from 'sanitize-html'
import { query, closePool } from '../db.js'

// body_ar comes from an LLM summarizing scraped third-party RSS/HTML content —
// treat it as untrusted and strip anything beyond a safe subset before it
// ever reaches the database. The render side (app/articles/[slug]/page.tsx)
// sanitizes again on the way out, but this stops bad markup at the source too.
const ARTICLE_SANITIZE_OPTIONS = {
  allowedTags: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'br'],
  allowedAttributes: { a: ['href', 'rel', 'target'] },
  allowedSchemes: ['https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
  },
}
import chalk from 'chalk'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../../.env.local') })

const log = {
  info:    msg => console.log(chalk.blue('ℹ'),  msg),
  success: msg => console.log(chalk.green('✅'), msg),
  warn:    msg => console.log(chalk.yellow('⚠'), msg),
  error:   msg => console.log(chalk.red('❌'),   msg),
}

const OLLAMA_URL   = process.env.OLLAMA_URL   ?? 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3.2'
const GROQ_API_KEY = process.env.GROQ_API_KEY ?? ''
const GROQ_MODEL   = process.env.GROQ_MODEL   ?? 'llama-3.3-70b-versatile'

// Anything matching these is NOT a car, regardless of what else matches.
// This is what let the Momentum e-bike through last run — "electric" and
// "battery" matched, nothing checked whether it was actually a car.
const HARD_EXCLUDE = [
  'e-bike', 'ebike', 'electric bike', 'electric bicycle',
  'scooter', 'moped', 'motorcycle', 'e-scooter',
  'drone', 'boat', 'jet ski', 'atv',
]

// Confirms the story is actually about a car/vehicle, not just "electric"
// in general (batteries, grids, and bikes are all "electric" too).
const CAR_SIGNAL = [
  'car', 'vehicle', 'sedan', 'suv', 'truck', 'pickup',
  'tesla', 'byd', 'lucid', 'hyundai', 'kia', 'rivian', 'polestar',
  'model 3', 'model y', 'model s', 'model x',
  'ev sales', 'ev market', 'automaker', 'automotive',
]

// Either the story mentions the Gulf/MENA directly, or it's substantively
// about car-industry mechanics (sales figures, pricing, policy, charging
// infrastructure) rather than a product review of something irrelevant
// to a Gulf buyer. This is what let the US-only tax-credit story through
// last run without anyone deciding on purpose that global industry news
// belongs on a Gulf-focused site — now it's an explicit yes/no instead
// of an accident of keyword overlap.
const GULF_SIGNAL = ['saudi', 'uae', 'dubai', 'abu dhabi', 'riyadh', 'gulf', 'gcc', 'mena', 'middle east']
const INDUSTRY_SIGNAL = ['charging', 'battery range', 'incentive', 'subsidy', 'tax credit', 'price', 'sales', 'market share']

function isRelevant(title, desc) {
  const text = (title + ' ' + desc).toLowerCase()

  if (HARD_EXCLUDE.some(k => text.includes(k))) return false
  if (!CAR_SIGNAL.some(k => text.includes(k))) return false

  const mentionsGulf     = GULF_SIGNAL.some(k => text.includes(k))
  const mentionsIndustry = INDUSTRY_SIGNAL.some(k => text.includes(k))

  return mentionsGulf || mentionsIndustry
}

const PROMPT = (title, desc) => `أنت كاتب محتوى متخصص في السيارات الكهربائية لمنطقة الخليج.
بناءً على هذا الخبر:
العنوان: ${title}
الملخص: ${desc}

اكتب مقالاً شاملاً باللغة العربية مع عناوين H2 وفقرات.
أعد JSON فقط بدون أي نص خارجه:
{"title_ar":"...","excerpt_ar":"ملخص في جملتين","body_ar":"<h2>...</h2><p>...</p>","category":"أخبار","seo_title":"أقل من 60 حرف","seo_description":"أقل من 155 حرف"}`

const RSS_FEEDS = [
  { url: 'https://electrek.co/feed/',                               label: 'Electrek' },
  { url: 'https://insideevs.com/feed/',                             label: 'InsideEVs' },
  { url: 'https://www.electrive.com/feed/',                         label: 'Electrive' },
  { url: 'https://cleantechnica.com/category/transportation/feed/', label: 'CleanTechnica' },
]

async function parseRSSFeed(feedUrl, label) {
  try {
    log.info(`Fetching RSS: ${label}`)
    const res = await axios.get(feedUrl, { timeout: 10000, headers: { 'User-Agent': 'ShahnMENABot/1.0' } })
    const $   = cheerio.load(res.data, { xmlMode: true })
    const items = []
    $('item').each((i, el) => {
      if (i >= 5) return false
      const title = $(el).find('title').first().text().trim()
      const desc  = $(el).find('description').first().text().replace(/<[^>]+>/g, '').trim()
      if (isRelevant(title, desc) && title)
        items.push({ title, description: desc.slice(0, 500), label })
    })
    log.success(`${label}: ${items.length} relevant items`)
    return items
  } catch (e) {
    log.warn(`Failed ${label}: ${e.message}`)
    return []
  }
}

async function generateWithOllama(title, desc) {
  log.info(`Trying Ollama (${OLLAMA_MODEL})...`)
  const res = await axios.post(`${OLLAMA_URL}/api/generate`, {
    model: OLLAMA_MODEL, prompt: PROMPT(title, desc), stream: false,
    options: { temperature: 0.6, num_predict: 1500 },
  }, { timeout: 120000 })
  const match = (res.data?.response ?? '').match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON from Ollama')
  return JSON.parse(match[0])
}

async function generateWithGroq(title, desc) {
  if (!GROQ_API_KEY) throw new Error('No GROQ_API_KEY')
  log.info(`Trying Groq (${GROQ_MODEL})...`)
  const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
    model: GROQ_MODEL, temperature: 0.6, max_tokens: 1500,
    messages: [{ role: 'user', content: PROMPT(title, desc) }],
  }, { headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 30000 })
  const match = (res.data?.choices?.[0]?.message?.content ?? '').match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON from Groq')
  return JSON.parse(match[0])
}

async function generateArticle(title, desc) {
  try   { const r = await generateWithOllama(title, desc); log.success('Ollama ✓'); return r } catch {}
  try   { const r = await generateWithGroq(title, desc);   log.success('Groq ✓');   return r } catch (e) { log.error(`Both failed: ${e.message}`) }
  return null
}

function makeSlug(title, englishFallback) {
  const ts = Date.now().toString(36)
  const clean = (str) => (str ?? '').toLowerCase().replace(/[^a-z0-9\s]/g,'').trim().split(/\s+/).filter(Boolean).slice(0,6).join('-')

  // Arabic titles get fully stripped by the regex above (Arabic
  // characters are outside a-z0-9), which is why almost every article
  // used to fall back to "article-<timestamp>" instead of a real slug.
  // Prefer the original English RSS title when we have one — it
  // survives the regex fine and makes a much more useful URL.
  const fromEnglish = clean(englishFallback)
  if (fromEnglish) return `${fromEnglish}-${ts}`

  const fromTitle = clean(title)
  return fromTitle ? `${fromTitle}-${ts}` : `article-${ts}`
}

async function saveArticle(a, englishTitle) {
  try {
    const ex = await query('SELECT id FROM articles WHERE title_ar=$1 LIMIT 1', [a.title_ar])
    if (ex.rows.length) { log.warn(`Already exists: ${a.title_ar.slice(0,40)}`); return false }
    const safeBody = sanitizeHtml(a.body_ar ?? '', ARTICLE_SANITIZE_OPTIONS)
    await query(
      `INSERT INTO articles (id,title_ar,slug,excerpt_ar,body_ar,category,seo_title,seo_description,published)
       VALUES (gen_random_uuid()::text,$1,$2,$3,$4,$5,$6,$7,false)`,
      [a.title_ar, makeSlug(a.seo_title??a.title_ar, englishTitle), a.excerpt_ar??'', safeBody,
       a.category??'أخبار', a.seo_title??a.title_ar.slice(0,60), a.seo_description??a.excerpt_ar?.slice(0,155)??'']
    )
    log.success(`Saved draft: ${a.title_ar.slice(0,50)}`)
    return true
  } catch (e) { log.error(`Save failed: ${e.message}`); return false }
}

async function run() {
  console.log(chalk.bold.cyan('\n📝 Articles Generator — شحن MENA'))
  console.log(chalk.gray('   Priority: Ollama (local) → Groq (cloud)\n'))

  const ollamaOk = await axios.get(`${OLLAMA_URL}/api/tags`,{timeout:3000}).then(()=>true).catch(()=>false)
  if (ollamaOk)    log.success('Ollama running ✓')
  else             log.warn('Ollama offline — will use Groq')
  if (GROQ_API_KEY)log.success('Groq API key found ✓')
  else             log.warn('No GROQ_API_KEY')
  if (!ollamaOk && !GROQ_API_KEY) { log.error('No AI engine available!'); return }

  const news = (await Promise.all(RSS_FEEDS.map(f => parseRSSFeed(f.url, f.label)))).flat()
  log.info(`\nTotal relevant news: ${news.length}`)
  if (!news.length) { log.warn('No news today'); return }

  let saved = 0
  for (const item of news.slice(0, 3)) {
    log.info(`\n📰 "${item.title.slice(0,60)}..."`)
    const article = await generateArticle(item.title, item.description)
    if (article && await saveArticle(article, item.title)) saved++
    await new Promise(r => setTimeout(r, 1000))
  }

  log.success(`\n✨ Done! ${saved} drafts saved`)
  // NOTE: this used to say "Publish at: /admin/articles" — that route
  // doesn't exist anywhere in this codebase (app/admin is an empty
  // directory). Drafts sit in the DB with published=false until reviewed
  // with the actual tool that does that job:
  log.info('Review with: node scripts/review-drafts.js')
  const drafts = await query('SELECT COUNT(*) FROM articles WHERE published=false')
  console.log(`📋 Pending drafts: ${drafts.rows[0].count}`)
}

run().then(()=>closePool()).catch(e=>{log.error(e.message);closePool();process.exit(1)})
