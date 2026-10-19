# Fix 11: English typography exactly as the brand guide (paste this into Claude Code)

Brand guide, page 5 ("منظومة الخطوط"):
- Arabic: **Anaqa VF Bold** for main headings and slogans; **Anaqa VF Thin** for subheadings, technical specs and product cards. This is already applied in Fix 4 and Fix 10. Thin is waiting for the client's VF file; do not touch Arabic in this fix.
- Latin: **Cormorant Garamond** and **Playfair Display**, "for the accompanying luxury editorial text".

The designer wants BOTH Latin fonts used. The guide doesn't assign them roles, so mirror the Arabic system exactly:

| Role (same split as Arabic) | Arabic | English |
|---|---|---|
| Main headings and slogans | Anaqa Bold | **Playfair Display** |
| Subheadings, specs, product cards, body | Anaqa Thin (Regular for now) | **Cormorant Garamond** (current weights, unchanged) |

## 1. Install Playfair Display (OFL, free)
- Self-host it like Cormorant: woff2, Latin subset, `font-display: swap`.
- Source: the official Google Fonts files (e.g. `@fontsource/playfair-display` or the google/fonts repo). Report the version.
- Weights: **400** (the guide names the family only, with no weight). Add 400 italic only if an existing italic heading needs it.
- Preload only the face used in the EN hero.

## 2. Tokens
Mirror the Arabic token names:
- `--font-en-display` → "Playfair Display", with a serif fallback stack
- `--font-en-text` → "Cormorant Garamond" (as now)

## 3. Apply Playfair Display (`--font-en-display`) to EXACTLY these (EN pages only)
This is the same element list that uses `--font-ar-display` in Arabic:
- the hero title "OMRAA AL QOMASH" and the hero tagline "Egyptian Upholstery & Furnishing Fabric Manufacturer"
- every h1/h2
- the section statements ("Upholstery Fabrics for Every Application.", "Upholstery & Furnishing Fabrics" statement, etc.)
- the Products background title
- the About pull-quote
- the loader wordmark "OMRAA AL QOMASH"
- the 404 heading

Rule: wherever an Arabic element uses `--font-ar-display`, its English twin uses `--font-en-display`. Wherever Arabic uses `--font-ar-light`, English uses `--font-en-text`. Generate a list of both from the code and confirm the pairs match 1:1.

## 4. Keep on Cormorant Garamond
- the card names and descriptions (Products and Manufacture)
- section labels
- h3/h4
- body paragraphs
- the nav, buttons and the footer
- the contact details
- the loader counter

## 5. Re-tune the sizes of the elements that switch font, without changing the layout
Playfair is wider and taller than Cormorant at the same size. For each switched element, adjust only `font-size`, `letter-spacing` and `line-height` so it takes about the same width and height as before:
- **The hero title** still fits on one line at 1440, 1024, 768, 390 and 360px. Its letter-by-letter blur reveal still works.
- **The Products background title** is still on 2 lines at desktop, centred behind the cards.
- **No new line breaks:** none in headings at 1440px, and no orphans.

Report each element: old size → new size.

## 6. Re-check things that measure text
Because the metrics change:
- the hero intro timing
- the silk loader flight (the wordmark)
- the Products gallery fit (Fix 3) and the language-switch rebuild (Fix 9)

## Check
- EN screenshots of every section at 1920, 1440, 1024, 390 and 360px.
- In DevTools, check the rendered fonts on one element of each role.
- AR is completely unchanged: diff the AR screenshots before and after.
- Lighthouse on the 3 EN pages.
- Lint and build pass.

Report briefly, then restart `npm run preview`.
