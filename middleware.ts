import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === 'production' && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
