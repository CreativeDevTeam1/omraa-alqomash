# Phase 8 (final): QA, polish and performance (paste this into Claude Code)

Phase 7 approved. The hidden-tab video retry was a good catch. Keep `LOADER_TRANSITION = 'silk'`.

This is the last phase. Do NOT add new sections, new copy or new design ideas. Fix, verify and optimise only. Every piece of visible text, alt text and meta text must come from `_source/content/verified-copy.md`. If something needs text that isn't there, leave it empty and list it in the report.

STOP and report when done.

## 1. Finish the checks left open in Phase 6 and Phase 7
- **Silk hand-off in AR (RTL):**
  - Run it at 1440px and at 390px.
  - The wipe goes right to left, the drift is mirrored, and the hero starts from +6%.
  - The logo lands exactly on the header logo, with no jump at the swap.
- **Push hand-off in EN** at 1440px.
- **`prefers-reduced-motion`**, on all 3 pages × 2 languages:
  - the loader is skipped
  - the hero shows in its final state
  - no scroll-triggered motion; content appears in place
  - Lenis smooth scroll is off, so native scroll is used
- **Contact AR at 768px:** layout, the sticky image, the details grid, and the email wrap.
- **Loader timing:**
  - Check the loader on a cold load with DevTools network throttling at "Fast 4G" and at "Slow 4G".
  - Confirm the 6s hard cap fires on Slow 4G and the hand-off is still smooth there (a frozen video is acceptable, a jump is not).
- **iOS mask support:** you can't test a real iPhone. Make sure the check you used is `CSS.supports('mask-image','linear-gradient(#000,#000)') || CSS.supports('-webkit-mask-image','linear-gradient(#000,#000)')`, and that the fallback to push really runs when both are false. Force it to false once to prove it.

## 2. Responsive and RTL sweep
Check every page in EN and AR at these widths: 1920, 1440, 1280, 1024, 768, 390 and 360.

At every width:
- No horizontal scroll.
- No text overflow or clipped glyphs. Watch the Arabic diacritics and line-height at 360px.
- No orphan single word on the hero lines.
- Images keep their crop focus.
- Header and mobile menu:
  - open and close
  - focus is trapped while it's open
  - Esc closes it
  - the body is locked while it's open
- The language switch keeps you on the same page (`/en/about` ↔ `/ar/about`).
- Numbers, phone, email and the "OMRAA AL QOMASH" wordmark stay LTR inside RTL text. Use `<bdi>` or `dir="ltr"`.
- Only logical properties are used. Grep for `left:`, `right:`, `margin-left`, `padding-right` and `text-align: left`, and fix any that should mirror.

## 3. Accessibility
- One `<h1>` per page, and no skipped heading levels.
- `<html lang>` and `dir` update on language change.
- A skip link to `<main>` comes first in the tab order and is visible on focus.
- `:focus-visible` styles show on every link and button, in brand colours (terracotta or espresso). No browser-default blue.
- Alt text:
  - Product and use images get alt text equal to their exact name from verified-copy (EN or AR to match the page).
  - Decorative images and both videos get `alt=""` or `aria-hidden`.
  - Videos have no controls and are muted. Make sure they don't trap focus.
- Contrast: the ivory/beige text on photos and on olive, and the terracotta on ivory, must meet WCAG AA. Where they don't, darken the shade or overlay. Do not change the brand colours.
- External links (WhatsApp, Instagram, Facebook) get `target="_blank" rel="noopener noreferrer"`.

## 4. Performance (target: Lighthouse mobile Performance ≥ 90, Accessibility / Best Practices / SEO ≥ 95, on all pages and both languages)
- **Images:**
  - Generate AVIF and WebP at 480, 800, 1200 and 1800w with JPG fallback. Use `<picture>`, `srcset` and real `sizes`.
  - Set `width`/`height` or `aspect-ratio` on every image, so CLS stays under 0.05.
  - Above the fold: `fetchpriority="high"`. Everything else: `loading="lazy"`, `decoding="async"`.
  - `exhibition-booth.jpg` is only 480×640. Never render it wider than its native size; report where it appears.
- **Videos:**
  - Re-encode `hero-fabric.mp4` and `drape-closeup.mp4` to H.264 (+ a WebM/VP9 source), no audio track, faststart. Size targets: hero ≤ 3MB, drape ≤ 2MB at 1080p.
  - Add a 720p source for widths ≤ 768 (a `media` attribute, or a JS pick before setting `src`).
  - Preload the posters.
- **Fonts:**
  - Self-host Cormorant Garamond (only the weights used) and Amiri as woff2.
  - `font-display: swap`, and preload the hero weight only.
  - Subset: Latin for Cormorant, Arabic + Latin digits for Amiri.
- **JS:**
  - Lazy-load the About and Contact routes.
  - Import only the GSAP plugins used.
  - No console logs in the build.
  - Report the final JS size (gzip) per route.
- **Caching:** hashed filenames for assets.

## 5. Production polish
- **Per-page `<title>` and meta description**, in EN and AR, taken from verified-copy text only:
  - Title: "OMRAA AL QOMASH" / "أمراء القماش", plus the page name exactly as it appears in the nav.
  - If no suitable description sentence exists in verified-copy, leave it out and list it.
- **Favicon and apple-touch-icon** from `omraa-emblem.svg`, made as SVG + 32px + 180px PNG.
- **Open Graph:** title and image only. The image is the hero poster cropped to 1200×630.
- **A 404 route** for both languages:
  - It uses existing UI: the header, the footer and a link back to Home.
  - No new copy. If a sentence is needed, list it in the report and leave it blank.
- **`/` redirect:** `/` sends visitors to `/en`. Keep the current behaviour and confirm what it is.
- **SPA fallback files** for deep links: `public/_redirects` (Netlify) and `vercel.json` (Vercel).
- **Remove** unused assets, dead code and the test or debug helpers.
- **Arabic font swap (Anaqa VF):**
  - Add a short "Swapping the Arabic font" section to `README.md`. It should cover where to drop the `.woff2` files, and that the `@font-face` + `--font-ar` change is the only edit needed.
  - Make sure no component hardcodes `Amiri`.

## 6. Final report
- Lighthouse scores, as a table: page × language × (Perf / A11y / BP / SEO).
- Bundle and media sizes, before and after.
- The responsive / RTL / a11y checks, each marked pass or fixed (and what was fixed).
- Any text that was needed but is missing from verified-copy.
- Client items still open:
  - Anaqa VF font files
  - product name mismatch on the photos
  - the "فنخ ستان" spelling
  - email and social links
  - prices (the site currently shows "Request a Quote" only)
- How to run the production build locally, and what to upload for hosting.
