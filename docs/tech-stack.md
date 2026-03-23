# AICURV Website — Tech Stack & Language Reference

*Last updated: 2026-03-23*

---

## Overview

AICURV is a **static frontend website** with no backend. All pages are server-rendered HTML served via Vercel's CDN. There is no database, no server-side logic, and no API layer at this stage.

---

## Frontend

### Core Languages

| Language | Version | Role |
|----------|---------|------|
| HTML5 | — | Page structure and semantic markup |
| CSS3 | — | Styling, layout, animations, responsive design |
| JavaScript (ES6+) | — | Interactivity, animations, form validation |

### JavaScript Features Used
- `const` / `let`, arrow functions, template literals
- `document.querySelectorAll`, `addEventListener`, `classList`
- `IntersectionObserver`-equivalent via GSAP ScrollTrigger
- `document.fonts.ready` (font loading API)
- `window.matchMedia` (media query checks in JS)
- `window.addEventListener('scroll', ..., { passive: true })`
- `setTimeout`, `setInterval`, `clearInterval`

---

## Libraries & Dependencies

All loaded via CDN — no build tool, no npm, no bundler.

| Library | Version | CDN | Purpose |
|---------|---------|-----|---------|
| **GSAP** | 3.12.2 | cdnjs.cloudflare.com | Animation engine — timelines, tweens |
| **GSAP ScrollTrigger** | 3.12.2 | cdnjs.cloudflare.com | Scroll-linked animations, sticky cards |
| **Lucide Icons** | latest | unpkg.com | SVG icon set (zap, cpu, calendar, etc.) |

---

## Fonts

Loaded via **Google Fonts** (`fonts.googleapis.com`).

| Font Family | Weights | Usage |
|-------------|---------|-------|
| **Plus Jakarta Sans** | 400, 500, 600, 700, 800 | Primary heading font (`--font-heading`) |
| **Outfit** | 400, 500, 600, 700 | Body text, UI elements (`--font-sans`) |
| **Cormorant Garamond** | italic 500, 600, 700 | Serif accent / display (`--font-serif`) |
| **JetBrains Mono** | 400, 500 | Code, labels, mono data (`--font-mono`) |

---

## CSS Architecture

No framework. Pure custom CSS with:

- **CSS custom properties** (design tokens in `:root`)
- **Flexbox** — nav, cards, footer columns
- **CSS Grid** — features grid, pricing grid, stats grid, footer
- **`clamp()`** — fluid responsive typography
- **`@media` queries** — breakpoints at `768px` and `480px`
- **`@media (prefers-reduced-motion)`** — accessibility
- **`@media (hover: hover)`** — touch device guard for JS effects
- **CSS animations** (`@keyframes`) — spin, scanAnim, iconPulse, pulse, blink, mobileLinkIn

### Design Tokens (`:root`)

```css
--moss:     #2E4036   /* Primary dark green */
--moss-tint:#41584B   /* Lighter moss */
--clay:     #CC5833   /* Accent orange-red */
--cream:    #F2F0E9   /* Background / light text */
--muted:    #E8E6DF   /* Subtle background */
--charcoal: #1A1A1A   /* Dark background / dark text */
```

---

## Hosting & Deployment

| Service | Role |
|---------|------|
| **Vercel** | Hosting & CDN — auto-deploys on every GitHub push to `main` |
| **GitHub** | Version control — repo: `github.com/aicurv-hue/aicurv-website` |
| **Custom Domain** | `aicurv.com` — connected via Vercel DNS |

### Deploy Flow
```
Local edit → git commit → git push origin main → Vercel auto-deploy (~60s) → live on aicurv.com
```

---

## Backend

**None currently.** The site is fully static.

### Planned / Future Backend Needs
- Contact form submission → needs an endpoint (options: Formspree, Resend, custom API)
- Analytics tracking → Google Analytics 4 or Plausible
- CMS for blog/case studies → Contentlayer, Sanity, or Notion API

---

## File Structure

```
aicurv-website/
├── index.html          # Single-page app — all sections
├── style.css           # All styles (~1000+ lines)
├── script.js           # All JS (~300+ lines)
├── assets/
│   ├── hero-space.png
│   ├── hero-bg.png
│   ├── philosophy-space.png
│   └── logo-icon.png
└── docs/
    └── tech-stack.md   # This file
```

---

## Browser Support

Targets modern evergreen browsers. Key features used:

| Feature | Support |
|---------|---------|
| CSS custom properties | Chrome 49+, Firefox 31+, Safari 9.1+ |
| CSS Grid | Chrome 57+, Firefox 52+, Safari 10.1+ |
| `clamp()` | Chrome 79+, Firefox 75+, Safari 13.1+ |
| `backdrop-filter` | Chrome 76+, Firefox 103+, Safari 9+ |
| `document.fonts.ready` | Chrome 35+, Firefox 41+, Safari 10+ |
| GSAP ScrollTrigger | All modern browsers |

**Not supported:** IE11 (not targeted).

---

## Performance Notes

- No build step — zero JS bundling overhead
- All scripts loaded at bottom of `<body>` (non-blocking)
- Google Fonts use `display=swap` for fast text render
- Philosophy image uses `loading="lazy"`
- GSAP `will-change: transform` applied only to animated elements
- Scroll listener uses `{ passive: true }` flag
