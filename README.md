# OMRAA AL QOMASH — website

> **Font licence note:** the Arabic identity font Anaqa (`public/fonts/anaqa/`, `_source/`) is committed because the designer chose to proceed. Its files declare `fsType 2` (Adobe EULA); the client must confirm a web licence before the site goes public. Details below.

B2B brand website for an Egyptian upholstery & furnishing fabric manufacturer. English (LTR) + Arabic (RTL).
Vite + React + TypeScript · React Router · CSS custom properties + CSS Modules · GSAP/ScrollTrigger + Lenis.

> Project rules: `CLAUDE.md`. Source assets and known content issues: `_source/README.md`. Approved copy: `_source/content/verified-copy.md`.

## Run

```bash
npm install
npm run dev       # http://localhost:5173  (/ redirects to /en)
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally (http://localhost:4173)
npm run lint      # ESLint
npm run format    # Prettier
npm run images    # regenerate public/images from _source (needs ffmpeg on PATH)
```

Routes: `/en`, `/en/about`, `/en/contact`, `/ar`, `/ar/about`, `/ar/contact`. `/` redirects to `/en`.
Any other path (e.g. `/en/nope`, `/fr`) shows the 404 page inside the header and footer, in the language of the URL (English when none).

## Stack

Vite + React + TypeScript, React Router, GSAP (+ScrollTrigger), Lenis, Sanity (headless CMS).

## Studio

```bash
cd studio
npm install
npm run dev          # local Studio
npx sanity deploy    # publish to https://omraa-alqomash.sanity.studio
```

## Environment variables

See `.env.example`. The site needs none (the dataset is public and read-only). `SANITY_WRITE_TOKEN` is only for the seed script; never commit it. `VITE_CMS_OFF=1` builds a purely static site.

## Deployment (Vercel)

Project `omraa-alqomash`, connected to this GitHub repo: production branch `main`, framework Vite, build `npm run build`, output `dist`, root directory = repo root. Every push to `main` deploys automatically. Live: https://omraa-alqomash.vercel.app

CMS: project ID `f4el6clm`, dataset `production`.

## Hosting

Upload the contents of `dist/` (after `npm run build`) to any static host.

- It is a single-page app: every path must fall back to `index.html`. Ready-made files are included:
  `public/_redirects` + `public/_headers` (Netlify, also work on Cloudflare Pages) and `vercel.json` (Vercel).
- Files in `dist/assets/` have hashed names and are cached for a year (`immutable`). `images/` and `media/` are cached for 30 days.
- Turn on gzip/brotli on the host (Netlify, Vercel and Cloudflare do this by default).
- `og:image` is the content-hashed `/media/og-image.<hash>.jpg` (absolute URL injected into `index.html` by `vite.config.ts` from `src/media-manifest.json`).

## Folder structure

```
_source/                 original assets + PDF (never imported at runtime)
public/
  images/{products,uses,photos}/name-{width}.{avif,webp,jpg}   480 / 800 / 1200 / 1800 (never above the source)
  media/                 hero-fabric + drape-closeup: 1080p and 720p, WebM + MP4, plus posters
  omraa-logo.svg, favicon.svg, favicon-32.png, apple-touch-icon.png, robots.txt
  _redirects, _headers   Netlify / Cloudflare Pages
scripts/                 optimize-images.mjs (+ optional subset-arabic-font.mjs)
src/
  assets/fonts/          self-hosted woff2 files
  content/               ALL copy: types.ts, en.ts, ar.ts, channels.ts
  i18n/                  language from the route (LangLayout), context, path helpers, LocalizedLink
  styles/                tokens.css, reset.css, fonts.css, globals.css
  components/{layout,home,about,contact,ui}
  pages/                 Home, About, Contact, NotFound (About and Contact are lazy-loaded chunks)
  lib/                   images, loader sequence/state, smooth scroll, scroll reveal, text split
vercel.json              Vercel rewrites + cache headers
```

## Where content lives

Every string is in `src/content/en.ts` and `src/content/ar.ts`, typed by one interface in `types.ts`
(TypeScript fails the build if the two files' keys differ). Components never contain copy.
`channels.ts` holds the phone / WhatsApp / email / social links. Page titles and meta descriptions are built in
`src/i18n/LangLayout.tsx` from the same strings (no extra copy).

## Language & direction

The language comes from the first URL segment. `index.html` sets `lang`/`dir` before first paint for `/ar…` (no layout flip),
and `LangLayout` keeps them, the title and the meta in sync. The language switch keeps the current page, query and hash.
CSS uses logical properties only (`inline`/`block`), so one stylesheet serves LTR and RTL. Numbers, emails, handles and
Latin words inside Arabic text are isolated with `dir="ltr"` / `<bdi>`.

## English fonts: Playfair Display + Cormorant Garamond (brand guide, page 5)

The guide names both Latin families for "luxury editorial text" without assigning roles, so English mirrors the Arabic split:

| Role                                                                                                                            | Token               | Font                                                       |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------- |
| Display: h1/h2, `.role-display` statements, hero title and tagline, pull-quote, Products background title, loader wordmark, 404 | `--font-en-display` | **Playfair Display 400** (+ italic 400 for the pull-quote) |
| Text: h3/h4, labels, `.role-light`, cards, body, nav, buttons, footer, contact, loader counter                                  | `--font-en-text`    | **Cormorant Garamond** (300–500)                           |

Rule: wherever Arabic uses `--font-ar-display` / `.role-display`, English uses `--font-en-display`; where Arabic uses `--font-ar-light` / `.role-light`, English uses `--font-en-text` (rules in `src/styles/globals.css`).
Playfair Display: `@fontsource/playfair-display` 5.3.0 (OFL), Latin subset, self-hosted in `public/fonts/playfair/`; the 400 face is preloaded on non-Arabic pages by `vite.config.ts`.
Playfair is wider and taller than Cormorant, so each switched element has an English-only size rule (`:root[lang='en'] .x`) in its module; Arabic sizes are untouched.

## Arabic font: Anaqa (identity font, client-supplied)

Supplied as two **static** files (no variable "VF" file, **no Thin weight**): `Anaqa-Regular.ttf` (400) and `ArbFONTS-Anaqa-Bold.ttf` (700; `ArbFONTS-Anaqa-Regular.ttf` is a byte-identical duplicate of Regular and is not used).
Both have Arabic glyphs only (109 of the Arabic block, presentation forms, ASCII punctuation) — **no Latin digits or letters** —
so phone numbers, "ISO 9001", English words and © come from Amiri's small Latin subset (the only Amiri files left, ~40 KB).

| Role (identity guide)                                                     | Token               | Weight used                                                          |
| ------------------------------------------------------------------------- | ------------------- | -------------------------------------------------------------------- |
| "Anaqa VF Bold": headings, slogans, statements, Products background title | `--font-ar-display` | 700 → **Anaqa Bold**                                                 |
| "Anaqa VF Thin": subheadings, labels, h3/h4, product cards                | `--font-ar-light`   | 400 — **Thin was not supplied, Regular is the lightest real weight** |
| Body text, nav, buttons, contact values (not assigned by the guide)       | `--font-ar`         | 400 (Anaqa)                                                          |

`font-synthesis: none` is set for Arabic, so the browser never fakes bold or thin.

**Files** (all in `public/fonts/anaqa/`): `Anaqa-Regular.woff2` (subset, 43 KB, all shaping features kept) is declared in `src/styles/fonts.css`.
The Bold face (`Anaqa-Bold.woff2`, subset, 42 KB) is declared by `vite.config.ts` (it is declared only when the file exists); the same plugin preloads the hero face (Bold) on `/ar` pages.
To regenerate: `npm i --no-save subset-font fontkit && node scripts/subset-anaqa.mjs Regular` (or `Bold`).

**Licence note (read before launch):** both font files declare `OS/2.fsType = 2` (restricted-licence embedding), the copyright is Canada Type, and their licence URLs point to Adobe Fonts EULAs (`https://fonts.adobe.com/eulas/00000000000000007735e554` Regular, `…7735e557` Bold). Self-hosting on a public site may need a web licence. The designer was informed and chose to proceed; **the client must confirm they hold a web licence before the site goes public.**

## Images and video

- Add or replace a file in `_source/{products,uses,photos}` and run `npm run images`. It writes AVIF, WebP and JPG at 480/800/1200/1800
  (never above the source) and the manifest used by `<Picture>`. Photos not used by the site are skipped (list in the script).
- The hero and loader videos are the client's v2 files in `_source/videos/client-v2/` (848×464, used exactly as delivered: no effects, no upscaling; the loader video is the ping-pong version, played with `loop`). `node scripts/encode-videos.mjs` outputs the native size only (MP4 H.264 + WebM VP9, the hero MP4 is the client's stream copied as is, WebP posters) and **content-hashes every file in `public/media`** (`hero-fabric.3f9a2c1d.mp4`), writing `src/media-manifest.json`. All code gets media URLs from `src/media.ts` (the manifest); never hardcode a `/media/…` name. Hashed `/media` and `/assets` are `immutable` for a year; `index.html` and routes are `no-cache`. The older glass / espresso versions stay in `_source/videos/`.
- Videos are in `public/media`: H.264 (MP4) and VP9 (WebM), no audio track, faststart, 1080p (≤3 MB hero, ≤2 MB loader) and
  720p for screens up to 768px wide. `<VideoSources>` picks the right file.
- `exhibition-booth.jpg` (only 480×640) is no longer used on any page (removed from About in Fix 12); the file is kept in `_source`.

## Loading screen

Plays only when a browser session starts on Home (`/`, `/en`, `/ar`), once per session (`sessionStorage` key `omraa-loader-seen`).
Loader: the "Thread + Video" intro (concept 07, `_source/loader-reference`) for 0–2.6s, then the screen opens onto the drape video in one move, and a push-through dissolve into the hero while the logo flies (FLIP) into the header (≈6.6s). The hand-off at 4.7s waits for the hero video and fonts (6s cap from the start). Arabic mirrors the thread right→left.
With reduced motion the sequence is skipped and the hero fades in over 300ms. Logic: `src/lib/loaderSequence.ts`;
the inline script in `index.html` decides before first paint so nothing flashes.
To replay it: `sessionStorage.removeItem('omraa-loader-seen')` and reload Home.

## Content management (Sanity)

The client edits products, contact details, all texts (EN/AR), images and the hero / loader videos in a Sanity Studio:
**https://omraa-alqomash.sanity.studio** (project `f4el6clm`, dataset `production`, public read-only). Guide for the client: `CMS-GUIDE-AR.md`.

- **Studio:** `studio/` (own `package.json`). `cd studio && npm run dev` to run it, `npx sanity deploy` to publish it. Schemas in `studio/schemaTypes`; bilingual `{ en, ar }` fields side by side, length warnings (longest current text + 30%), image ≥ 1600 px warning, video MP4 ≤ 8 MB + required poster.
- **Seed:** `cd studio && npx sanity exec scripts/seed.ts --with-user-token` writes the current site content (from `en.ts` / `ar.ts` / `channels.ts`, the `_source` images, the 1080p hero/loader videos) and diffs every string back (0 differences). It also writes `src/content/seeded-assets.json`. No token is typed: it uses the CLI login (or `SANITY_WRITE_TOKEN`, see `.env.example`; never commit it).
- **Site side:** `src/content/fromSanity.ts` (GROQ query + CMS → content; shared by the site, the build script and the seed check), `src/content/cms.ts` (store). The site renders from a **build-time snapshot** (`src/content/snapshot.json`, written by `scripts/fetch-content.ts` in `prebuild`; if Sanity is unreachable the last committed snapshot is used and the build never fails). Only what differs from `en.ts` / `ar.ts` is stored. After load (+3.5 s) the page fetches the same query from the Sanity CDN (4 s timeout) and swaps changed text in place; the newest result is also kept in `localStorage` for the next visit.
- **Images / videos:** the seeded images and videos keep using the local optimised files (matched by Sanity asset id); once the client replaces one, it is served from the Sanity CDN (WebP/JPEG via `@sanity/image-url`, hotspot respected) or, for videos, from the Sanity file URL.
- **Kill switch:** `VITE_CMS_OFF=1` at build time gives a purely static site.
- Products: any count from 3 to 30 works (the carousel repeats the set as needed; an odd count repeats twice so the tilt never breaks at the seam).

## Products carousel

Automatic, seamless horizontal carousel (`ProductsGallery.tsx`): 10 cards plus an `aria-hidden` + `inert` duplicate set, moved by one GSAP-ticker callback and wrapped over exactly one set width. 45px/s (30px/s below 768px), right→left in English and left→right in Arabic. Scroll velocity (Lenis) adds up to ±4× the speed; drag/swipe with inertia; pauses on hover, keyboard focus, the pause/play button (WCAG 2.2.2), offscreen and hidden tabs. `data-carousel-tickers` on `<html>` counts live tickers (should be 1).

## Reduced motion

With `prefers-reduced-motion: reduce`: no loading screen, no Lenis smooth scroll, no auto-moving Products carousel (a plain horizontal scroller with snap, no pause button),
no scroll reveals or tilt, and the hero shows its poster instead of the video.

## Client TODO (content / assets)

- **Anaqa web licence** — confirm the client holds a web/self-hosting licence (fsType 2, Adobe EULA); confirm whether a Thin weight exists.
- **Footer links without a section:** Custom Manufacturing → Contact, Quality → About#quality, Export Markets → About.
  Confirm these destinations or supply the content.
- **Higher-resolution exhibition photo:** `exhibition-booth.jpg` is only 480×640.
- **Product names printed on the photos** differ from the PDF names (e.g. GEORLAN vs Gobelin); the site shows the PDF names.
  New photos without printed names would remove the mismatch.
- **Arabic spelling "فنخ ستان"** (Satin Fenkh) — to be confirmed.
- **Email and social links** (not in the PDF): confirmed values live in `src/content/channels.ts`.
- **Prices:** none are shown; the site only offers "Request a Quote".
- **Interface strings not in `verified-copy.md`** (menu, close, skip link, "Page not found") — approved placeholders in `en.ts` / `ar.ts`.

