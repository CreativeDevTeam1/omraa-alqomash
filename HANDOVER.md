# Handover: OMRAA AL QOMASH website

For the developer who deploys the site to the final domain. Project rules are in `CLAUDE.md`; full technical notes are in `README.md`.

## 1. Run and build

Requires Node 20+ (built with Node 24).

```bash
npm install
npm run dev       # http://localhost:5173  (/ redirects to /en)
npm run build     # type-check + production build into dist/
npm run preview   # serve the build locally (http://localhost:4173)
npm run lint
```

`npm run build` first runs `scripts/fetch-content.ts` (`prebuild`), which writes a content snapshot from Sanity into `src/content/snapshot.json`. If Sanity is unreachable, the last committed snapshot is used and the build does not fail.

Routes: `/en`, `/en/about`, `/en/contact`, `/ar`, `/ar/about`, `/ar/contact`. `/` redirects to `/en`.

## 2. Deploy on Vercel (your own account)

The repo is currently deployed from the designer's Vercel account (`omraa-alqomash.vercel.app`). To attach the final domain, **import the repo into your own Vercel account** (Add New → Project → import `tasbeehmamdouh/omraa-alqomash`; the designer must give you access to the private repo first).

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |
| Root directory | repo root (not `studio/`) |
| Production branch | `main` |

`vercel.json` already contains everything else:

- `/` redirects to `/en` (307).
- Single-page-app rewrite: every path except `assets/`, `images/`, `media/`, `fonts/`, favicons and logos falls back to `/index.html`.
- Cache headers: `/assets/*` and `/media/*` are `immutable` for one year (hashed file names); `/images/*` and `/fonts/*` 30 days; everything else `no-cache`.

`public/_headers` and `public/_redirects` are the same rules for Netlify / Cloudflare Pages, and are ignored by Vercel.

Add the final domain under Project → Settings → Domains, then follow the steps in sections 4 and 5 below.

## 3. Environment variables

None are required. The Sanity dataset is public and read-only, so the site needs no token.

- `VITE_CMS_OFF=1` (optional, build time): builds a purely static site that never contacts Sanity.
- `SANITY_WRITE_TOKEN` is only for the seed script (see `.env.example`). **Never commit it and never add it to Vercel.**

## 4. Sanity (content management)

- Project ID: `f4el6clm`
- Dataset: `production` (public, read-only for the site)
- Studio: https://omraa-alqomash.sanity.studio (source in `studio/`, its own `package.json`)
- Client guide (Arabic): `CMS-GUIDE-AR.md`

```bash
cd studio
npm install
npm run dev          # local Studio
npx sanity deploy    # publish the Studio
```

How the site uses it: it renders from the build-time snapshot, and 3.5 s after load it fetches the same query from the Sanity CDN and swaps changed text in place. So an edit shows in the browser without a rebuild, but a redeploy refreshes the snapshot.

**Required after the final domain is live:** add it to the Sanity CORS origins. Go to https://www.sanity.io/manage → project `f4el6clm` → API → CORS origins → Add CORS origin. Add `https://<final-domain>` (and `https://www.<final-domain>` if used). Do **not** tick "Allow credentials". Without it the live refresh from Sanity fails in browsers, and the site falls back to the last build's snapshot. Keep the existing `omraa-alqomash.vercel.app` origin until you retire that URL.

## 5. Update the URLs to the final domain

The public origin is hard-coded in two places. Change both to the final domain, then redeploy:

1. `src/site.ts`: `SITE_URL`. This drives the absolute `og:image` (injected by `vite.config.ts`), and the `canonical`, `og:url` and `hreflang` tags that `src/i18n/LangLayout.tsx` sets for each page.
2. `index.html`: the static `og:url`, `canonical` and the three `hreflang` links (`en`, `ar`, `x-default`) in `<head>` still point at `https://omraa-alqomash.vercel.app`. Replace every occurrence.

Then check on the live site (View Source on `/en` and `/ar`): `og:image` is an absolute URL on the final domain, `canonical` and `og:url` match the page, and `hreflang` lists both `/en` and `/ar` on the final domain. Also check `public/robots.txt` for any absolute URL.

## 6. Arabic font licence (Anaqa): read before launch

The Arabic identity font Anaqa is committed in `public/fonts/anaqa/` (and the originals in `_source/`) because the designer chose to proceed. Both files declare `OS/2.fsType = 2` (restricted-licence embedding), the copyright is Canada Type, and the licence URLs point to Adobe Fonts EULAs. Self-hosting on a public site may need a web licence. **The client must confirm they hold a web licence before the site goes public.** If not, the Arabic stack falls back to Amiri (`--font-ar` in `src/styles/fonts.css`). Details: "Arabic font: Anaqa" in `README.md`.

## 7. Other open items for the client

- See "Client TODO" in `README.md` (footer link destinations, higher-resolution exhibition photo, product-name mismatch on photos, spelling to confirm, etc.).
- The products carousel has no pause button (removed at the client's request). It still pauses on keyboard focus, when offscreen, and in reduced-motion mode. WCAG 2.2.2 normally asks for a pause control on auto-moving content.
- Prompt files (`PHASE-*`, `FIX-*`, …) are git-ignored on purpose; do not commit them.
