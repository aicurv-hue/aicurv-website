# AICURV Website — Performance Upgrade Plan

*Created: 2026-03-23*
*Method: Vertical slices — each slice is self-contained, testable, and rollback-safe.*

---

## Projected Score Impact

| | Mobile Before | Mobile After | Desktop Before | Desktop After |
|--|--|--|--|--|
| Performance Score | ~35 | 85–95 | ~60 | 87–98 |

---

## Dependency Graph

```
Slice 1 (Images)    ──┐
Slice 2 (Favicon)   ──┤──► Slice 5 (Critical CSS) ──► Slice 7 (Preloader bypass)
Slice 3 (Fonts)     ──┤
Slice 4 (Scripts)   ──┘──► Slice 6 (Noise SVG)
```

Slices 1–4 can run in parallel. Slice 5 & 6 depend on 1–4. Slice 7 depends on 5, 6.

---

## Slice 1 — Images *(requires user-supplied WebP assets)*

**Status:** Waiting on user to supply WebP files.

**Problem:** `hero-space.png`, `hero-bg.png`, `philosophy-space.png` total ~2.4MB. Largest Contentful Paint image is unoptimised. No explicit dimensions cause layout shift (CLS).

**Tasks:**
1. User converts PNGs → WebP using Squoosh (squoosh.app) or `cwebp`:
   - `hero-space.webp` target: ~200KB (was ~800KB)
   - `hero-bg.webp` target: ~170KB (was ~700KB)
   - `philosophy-space.webp` target: ~160KB (was ~600KB)
   - Place in `assets/`
2. Add `<link rel="preload">` for hero-space.webp in `<head>`
3. Wrap all `<img>` in `<picture>` with WebP source + PNG fallback
4. Add explicit `width` + `height` attributes to all `<img>` elements

**Verification:** Run PageSpeed. LCP should drop from ~8s to ~2s. CLS should hit 0.

**Rollback:** Remove `<picture>` elements and preload hint. Original `<img>` tags restored.

---

## Slice 2 — Favicon *(requires user-supplied favicon files)*

**Status:** Waiting on user to supply favicon files.

**Problem:** `logo-icon.png` is used as favicon but is full-size PNG. Apple touch icon needs 180×180. Browser favicon needs 32×32. Missing `theme-color` meta.

**Tasks:**
1. User supplies:
   - `favicon-32.png` (32×32 px)
   - `favicon-180.png` (180×180 px)
   - Place in `assets/`
2. Update `<head>`:
   ```html
   <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png">
   <link rel="apple-touch-icon" sizes="180x180" href="assets/favicon-180.png">
   <meta name="theme-color" content="#2E4036">
   ```

**Verification:** Browser tab shows sharp favicon. Lighthouse PWA check passes.

**Rollback:** Revert `<link>` tags to `logo-icon.png`.

---

## Slice 3 — Font Loading *(no assets needed — implement immediately)*

**Status:** Ready to implement.

**Problem:** Google Fonts `<link rel="stylesheet">` is render-blocking. All 5 font variants (400–800) load even if unused. Blocks First Contentful Paint.

**Tasks:**
1. Replace blocking `<link rel="stylesheet">` with non-blocking load:
   ```html
   <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600;1,700&family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" onload="this.onload=null;this.rel='stylesheet'">
   <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?...&display=swap"></noscript>
   ```
2. Trim unused font weights — remove `800` from Plus Jakarta Sans (only headings use 700 max), remove `700` from Outfit (body uses 400–600)

**Verification:** FCP improves. FOUT visible briefly then fonts load. `display=swap` handles it.

**Rollback:** Restore original blocking `<link rel="stylesheet">`.

---

## Slice 4 — Script Deferral & CDN Pin *(no assets needed — implement immediately)*

**Status:** Ready to implement.

**Problem:** GSAP and Lucide scripts are at bottom of `<body>` without `defer`. Lucide uses `@latest` (unpinned — CDN cache miss risk, version drift risk). No Subresource Integrity.

**Tasks:**
1. Move all scripts to `<head>` with `defer`:
   ```html
   <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
   <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
   <script defer src="https://cdn.jsdelivr.net/npm/lucide@0.441.0/dist/umd/lucide.min.js"></script>
   <script defer src="script.js"></script>
   ```
2. Pin Lucide to `@0.441.0` on jsDelivr (more reliable CDN than unpkg for production)
3. Remove script tags from bottom of `<body>`

**Verification:** DevTools Network → scripts load with `defer`. No render-blocking scripts. Page loads same or faster.

**Rollback:** Move scripts back to bottom of `<body>`, restore unpkg Lucide URL.

---

## Slice 5 — Critical CSS Inline *(depends on Slices 1–4)*

**Status:** Blocked on Slices 1–4.

**Problem:** `style.css` is 33KB and fully render-blocking. Above-fold content (preloader, navbar, hero) only needs ~4KB of CSS. Full stylesheet blocks FCP.

**Tasks:**
1. Extract above-fold CSS (preloader, navbar, hero, `:root` tokens, base resets) into `<style>` block in `<head>`
2. Load full `style.css` asynchronously:
   ```html
   <link rel="preload" as="style" href="style.css" onload="this.onload=null;this.rel='stylesheet'">
   <noscript><link rel="stylesheet" href="style.css"></noscript>
   ```
3. Remove blocking `<link rel="stylesheet" href="style.css">` from `<head>`

**Verification:** FCP drops significantly. No flash of unstyled content above fold.

**Rollback:** Restore blocking `<link>`, remove inline `<style>` block.

---

## Slice 6 — Noise SVG Replacement *(depends on Slice 4)*

**Status:** Blocked on Slice 4. Requires user-supplied noise tile.

**Problem:** `feTurbulence` SVG filter runs on CPU every frame — one of the heaviest CSS effects available. Causes jank on mobile. `will-change: transform` applied to too many elements wastes GPU compositing layers.

**Tasks:**
1. User generates a 200×200px static noise tile PNG/WebP (can use Photoshop, GIMP, or online tool) → save as `assets/noise-tile.webp`
2. Replace inline `<svg class="noise-svg">` with CSS `background-image`:
   ```css
   body::before {
       content: '';
       position: fixed; inset: 0;
       background: url('assets/noise-tile.webp') repeat;
       opacity: 0.035;
       pointer-events: none;
       z-index: 0;
   }
   ```
3. Remove `.noise-svg` CSS class and the SVG element from HTML
4. Audit `will-change: transform` — remove from any element not actively animated on scroll

**Verification:** Scroll performance on mobile smooth. Chrome DevTools Performance tab shows no layout thrash.

**Rollback:** Restore SVG element and `.noise-svg` CSS, remove `body::before`.

---

## Slice 7 — Preloader Bypass *(depends on Slices 4, 5, 6)*

**Status:** Blocked on earlier slices.

**Problem:** Preloader runs for ~1.4s on every page load including return visits. This adds to LCP on all visits. Users who visited recently don't need the branded intro.

**Tasks:**
1. Add `sessionStorage` check — skip preloader if returning visitor in same session:
   ```javascript
   const skipPreloader = sessionStorage.getItem('aicurv_visited');
   if (skipPreloader) {
       preloader.style.display = 'none';
       document.body.classList.remove('preloading');
       fireHero();
   } else {
       sessionStorage.setItem('aicurv_visited', '1');
       // run tlPreload as normal
   }
   ```
2. Reduce preloader total duration from ~1.4s to ~1.0s (tighten timeline durations)

**Verification:** First visit: preloader runs. Refresh or navigate back: preloader skipped, content immediate.

**Rollback:** Remove `sessionStorage` check. Restore original timeline durations.

---

## Asset Checklist (User Action Required)

| Asset | Target Size | Tool | Used By |
|-------|-------------|------|---------|
| `assets/hero-space.webp` | ~200KB | Squoosh.app | Slice 1 |
| `assets/hero-bg.webp` | ~170KB | Squoosh.app | Slice 1 |
| `assets/philosophy-space.webp` | ~160KB | Squoosh.app | Slice 1 |
| `assets/favicon-32.png` | <5KB | Photoshop/Figma | Slice 2 |
| `assets/favicon-180.png` | <20KB | Photoshop/Figma | Slice 2 |
| `assets/noise-tile.webp` | <10KB | GIMP/Photoshop | Slice 6 |
