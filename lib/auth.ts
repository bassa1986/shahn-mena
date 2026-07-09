import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? 'fallback-secret-change-this-in-production'
)
const COOKIE = 'admin_token'

export async function signAdminToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyAdminToken(req: NextRequest): Promise<{ valid: boolean }> {
  const token = req.cookies.get(COOKIE)?.value
  if (!token) return { valid: false }
  try {
    await jwtVerify(token, SECRET)
    return { valid: true }
  } catch {
    return { valid: false }
  }
}

export async function setAdminCookie(token: string) {
  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function clearAdminCookie() {
  const jar = await cookies()
  jar.delete(COOKIE)
}

export function checkAdminPassword(password: string): boolean {
  const adminPw = process.env.ADMIN_PASSWORD
  if (!adminPw) return false
  return password === adminPw
}
