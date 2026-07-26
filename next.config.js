/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    const csp = [
      "default-src 'none'",
      "base-uri 'none'",
      // AdSense requires a tiny inline `(adsbygoogle = window.adsbygoogle || []).push({})`
      // snippet per ad slot. A header-based CSP like this one has no nonce/hash wiring,
      // so 'unsafe-inline' is the pragmatic tradeoff here — script-src is still locked
      // down to 'self' plus Google's own ad domains, nothing else.
      "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagservices.com https://adservice.google.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://images.unsplash.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.google.com https://www.gstatic.com",
      "connect-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.google.com https://fundingchoicesmessages.google.com",
      "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://fundingchoicesmessages.google.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "object-src 'none'",
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },
        ],
      },
    ]
  },
}
module.exports = nextConfig
