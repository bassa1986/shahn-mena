# GCC Real Estate Investment Education Hub

**Bilingual (Arabic-first / English) off-plan investment education platform for UAE, KSA & Qatar**

---

## 📁 Project Structure

```
gcc-realestate-hub/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx                # Root layout — GA4, AdSense, fonts
│   ├── globals.css               # Design system, RTL, luxury tokens
│   ├── [lang]/                   # Language routing (ar / en)
│   │   ├── layout.tsx            # Navbar + disclaimer wrapper
│   │   ├── page.tsx              # Home — ISR 86400s
│   │   ├── dubai/[community]/    # Programmatic SEO pages
│   │   │   └── page.tsx
│   │   ├── riyadh/[community]/
│   │   └── doha/[community]/
│   └── api/
│       ├── cron-refresh/route.ts # ← Scraper engine (CRON_SECRET protected)
│       └── og/route.tsx          # Dynamic OG image generation
├── components/
│   ├── ui/
│   │   ├── NavBar.tsx            # Bilingual, RTL-aware sticky nav
│   │   ├── HeroSection.tsx       # Animated hero
│   │   ├── MarketOverviewGrid.tsx # Community cards with sparklines
│   │   ├── AdSenseBanner.tsx     # CLS-safe ad slots (skeleton fallback)
│   │   ├── AffiliateCTAButton.tsx # Centralized affiliate links
│   │   ├── BrokerLeadForm.tsx    # Multi-step broker bidding form
│   │   └── RegulatoryDisclaimer.tsx # Un-dismissible footer
│   ├── calculators/
│   │   ├── ROICalculatorSection.tsx # Full ROI + Golden Visa + exit milestones
│   │   └── PaymentPlanComparison.tsx # Side-by-side plan comparison
│   ├── charts/
│   │   └── AppreciationChart.tsx # 6-month trend chart
│   └── chatbot/
│       └── AIChatInterface.tsx   # RERA/REGA legal AI chatbot
├── lib/
│   ├── types.ts                  # All TypeScript interfaces
│   ├── market-data.ts            # JSON data loader (server-side)
│   ├── affiliate.ts              # Dynamic affiliate URL builder
│   ├── calculators/
│   │   └── roi.ts                # ROI calculation engine
│   ├── i18n/
│   │   ├── ar.ts                 # Arabic translations
│   │   ├── en.ts                 # English translations
│   │   └── index.ts              # Locale utilities + formatters
│   └── data/
│       ├── dubai_transactions.json  # Dubai market fallback data
│       ├── riyadh_prices.json       # Riyadh market fallback data
│       └── doha_properties.json     # Doha market fallback data
├── middleware.ts                 # Edge geofencing + currency detection
├── next.config.mjs
├── tailwind.config.ts
├── vercel.json                   # Cron schedule + security headers
├── .env.example                  # Environment variable template
└── local-dashboard/              # Standalone admin app (localhost:3001)
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx              # Analytics + scraper monitoring UI
    │   └── globals.css
    ├── package.json
    └── next.config.mjs
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Main platform
npm install

# Admin dashboard (separate)
cd local-dashboard && npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:
- `CRON_SECRET` — strong random string (run `openssl rand -hex 32`)
- `NEXT_PUBLIC_GA4_ID` — already set to `G-W0CLQ1CF9K`
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` — leave blank until AdSense approval
- `INDEXNOW_API_KEY` — register at [indexnow.org](https://indexnow.org)
- `NEXT_PUBLIC_BASE_URL` — your production domain

### 3. Development

```bash
# Main platform on localhost:3000
npm run dev

# Admin dashboard on localhost:3001
cd local-dashboard && npm run dev
```

### 4. Deploy to Vercel

```bash
vercel deploy
```

Vercel will automatically pick up `vercel.json` and schedule the weekly cron.

---

## ⚙️ Architecture

### Data Flow

```
Public Portals (Bayut / Aqar)
        ↓  (weekly scrape via cron)
/app/api/cron-refresh/route.ts
        ↓  (on success)
/lib/data/*.json  ←→  Server Components (ISR revalidate: 86400)
        ↓
Next.js Page → Client Components
        ↓
IndexNow ping + Vercel CDN cache clear
```

### Anti-Blocking Strategy

1. **User-Agent rotation** — 6 realistic browser strings (Chrome Win/Mac, Safari macOS/iOS, Firefox, Chrome Android)
2. **Random delays** — 2–5s between market requests
3. **Accept-Language headers** — Arabic locale headers (`ar-AE,ar;q=0.9`)
4. **Graceful fallback** — On WAF block (403/timeout), falls back to stored historical data silently

### Security

- `/api/cron-refresh` validates `Authorization: Bearer <CRON_SECRET>` or `?secret=` query param
- Admin dashboard runs on `localhost:3001` only — not deployed
- Security headers: HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff

---

## 💰 Monetization

### Affiliate Links
- UAE projects → `https://mpd.ae?utm_source=gcc-hub-uae&utm_campaign=<community>`
- KSA projects → `https://srco.com.sa?utm_source=gcc-hub-ksa&utm_campaign=<community>`
- Component: `<AffiliateCTAButton market="uae" entityName="Dubai Marina" />`
- GA4 event fires on every click: `affiliate_click`

### AdSense
- Slots: `hero-banner`, `mid-content`, `footer-leaderboard`, `community-{name}`
- When `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is empty → renders **zero-CLS skeleton** (no layout shift)
- When set → renders real `<ins class="adsbygoogle">` units

---

## 🌐 Localization

| Feature | Implementation |
|---|---|
| RTL Arabic | `dir="rtl"` on `<div>` wrapper, CSS `direction: rtl` |
| Font | Cairo (primary), Amiri (display) via Google Fonts |
| Currency | Edge middleware reads Vercel `request.geo.country` → sets cookie |
| Date format | `Intl.DateTimeFormat('ar-AE')` / `('en-AE')` |
| Number format | `Intl.NumberFormat('ar-AE')` for Arabic-Indic numerals |
| Emoji flags | Wrapped in `<span class="emoji-flag">` with cross-platform font stack |

---

## 📊 Admin Dashboard Features

- **Analytics tab**: Sessions, users, pageviews, device types, regional demographics, conversion funnel, top pages
- **Scraper Monitor**: Per-run logs with status, duration, metrics extracted, IndexNow ping status
- **Manual Override**: Force immediate scrape run with CRON_SECRET prompt
- **Data Files**: Visual status of all 3 market JSON files with timestamps

---

## 📋 Regulatory Compliance

The un-dismissible footer disclaimer reads:

> *"This platform provides educational information only. Off-plan real estate investment contains risks. ROI projections are estimated from historical public data. Consult a licensed RERA/REGA agent before execution. This portal is not a licensed broker."*

This disclaimer is hardcoded in `RegulatoryDisclaimer.tsx` and rendered on every page via `[lang]/layout.tsx`.

---

## 🗺️ Programmatic SEO URLs

| Route | Purpose |
|---|---|
| `/ar/dubai/dubai-marina` | Arabic Dubai Marina landing page |
| `/en/dubai/downtown-dubai` | English Downtown Dubai landing page |
| `/ar/riyadh/king-abdullah-financial-district` | KAFD Arabic page |
| `/api/og?community=palm-jumeirah&lang=ar` | Dynamic OG image |

Static params are generated at build time via `generateStaticParams()`.

---

## 📱 PWA

- `public/manifest.json` — full PWA manifest with Arabic name, RTL direction, shortcuts
- Theme color: `#c9a84c` (gold)
- Add icons to `public/icons/` at sizes: 72, 96, 128, 144, 152, 192, 384, 512px

---

*Contact: souqdzair30@gmail.com | Dubai, UAE / Riyadh, KSA*
