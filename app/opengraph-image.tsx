import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Shahn MENA — EV Guide for the Gulf'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Colors and layout intentionally match the real brand tokens already
// used everywhere else in this project (Navbar.tsx, globals.css) —
// #0D1B2A background, #F5A623 gold, #FAF3E0 cream — rather than
// inventing a new palette for just this one image.
//
// Uses Latin text, not Arabic. next/og renders through Satori, which
// doesn't reliably shape Arabic script (letters change form based on
// position in a word — Satori's text layout doesn't handle that).
// Untested Arabic here risks a garbled share-preview card, which is
// worse than the plain English version. Revisit if Satori's Arabic
// support improves, but verify by actually looking at the rendered
// output before trusting it, not by assuming a library update fixed it.

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0D1B2A',
          backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(245,166,35,0.12) 0%, transparent 60%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 110,
            height: 110,
            backgroundColor: '#F5A623',
            borderRadius: 16,
            marginBottom: 36,
          }}
        >
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="#0D1B2A" />
          </svg>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 84,
            fontWeight: 900,
            color: '#FAF3E0',
            letterSpacing: -2,
          }}
        >
          Shahn <span style={{ color: '#F5A623', marginLeft: 20 }}>MENA</span>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: '#A89070',
            marginTop: 20,
          }}
        >
          EV Guide for Saudi Arabia, UAE &amp; Morocco
        </div>
      </div>
    ),
    { ...size }
  )
}
