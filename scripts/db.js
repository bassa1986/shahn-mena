import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon presents a valid, publicly-trusted certificate, so there's no
  // reason to disable verification here — rejectUnauthorized: false would
  // make this connection vulnerable to a man-in-the-middle attack despite
  // still being "encrypted".
  ssl: { rejectUnauthorized: true },
})

export async function query(text, params) {
  const client = await pool.connect()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}

export async function closePool() {
  await pool.end()
}
