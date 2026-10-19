# Fix 4: apply the brand identity guide literally (paste this into Claude Code)

**Source of truth:** `_source/content/brand-identity-guide.pdf` (7 pages). Read it before you start.

Rules:
- Nothing visual on the site may use a colour, font or logo treatment that the guide doesn't list.
- Where the guide is silent, don't invent: list it in the report.

## A. Colours: audit EVERY colour in `src/` and `index.html`
The guide allows ONLY these:

| Name | Hex | Role (from the guide) |
|---|---|---|
| Ivory | #EAE6DF | backgrounds and spaces (60%) |
| Beige | #B8A38D | backgrounds and spaces (60%) |
| Navy | #1B2A3B | structure and text (30%) |
| Olive | #434B38 | structure and text (30%) |
| Charcoal | #2D2F2D | structure and text (30%) |
| Terracotta | #9E472A | the distinctive accent only (10%) |
| Espresso Roast | #361F17 | primary ink colour (text) |
| White | #FFFFFF | allowed only because it is one of the six approved logo backgrounds |

1. Grep every hex, rgb(), hsl() and named colour.
   - Any colour NOT in this list must be replaced by the closest guide colour. A guide colour with opacity is allowed (for example `rgba(54,31,23,.12)` for shadows).
   - Known offenders to check: `#141110` (hero-dark), `#F5F2EC` (old card colour), `#6E5E54` (loader wordmark), and any greys or off-whites.
   - For the video shade, use Espresso or Charcoal with opacity instead of `#141110`.
2. Remove `hero-dark` from the tokens and from `CLAUDE.md`.
3. Terracotta is the 10% accent only: the section labels, the "%" in the loader, the progress bar, focus rings and the primary hover. If it's used for large areas or body text anywhere, list it.
4. Report a table: old colour → new colour → where.

## B. Logo
- Use `omraa-logo.svg` / `omraa-emblem.svg` as vectors only.
  - Never recolour, stretch, add effects or crop them.
  - The emblem colours stay as designed: centre 4 terracotta diamonds surrounded by olive and beige.
- **Clear space:** keep at least **1X** of empty space around the logo on every side, everywhere it appears (header, footer, loader, the 404 page). X = the height of one emblem diamond, measured from the SVG. Fix any place where text, borders or edges come closer.
- **Backgrounds:** the logo may sit ONLY on the 6 approved backgrounds: ivory, navy, olive, terracotta, charcoal, white.
  - Check every placement. The loader places it over the video, so the ivory veil behind it must be solid enough to count as ivory.
  - The silk flight passes over the hero; that is a transition, so it's OK.
  - List every placement and its background.

## C. Typography
**Latin (EN):** the guide allows Cormorant Garamond and Playfair Display. Keep Cormorant Garamond only. It is allowed, and the designer wants one Latin font. No other Latin font anywhere, including buttons, the nav, the counter and the 404.

**Arabic, per the guide:**

| Face | Use it for |
|---|---|
| **Anaqa VF Bold** | main headings and slogans: the hero «أمراء القماش», «جودة تنسج المستقبل», every h1/h2, section statements, the background title in Products |
| **Anaqa VF Thin** | subheadings, technical specifications, and **product cards**: card names AND descriptions in Products and in What We Manufacture, the section labels, h3/h4 |

1. Create two tokens: `--font-ar-display` (the Bold role) and `--font-ar-light` (the Thin role). Apply them by role as above.
2. The **Anaqa VF font files have NOT arrived yet.** Until they do, both tokens fall back to Amiri: 700 for display and 400 for light. Amiri has no thin weight; note that in the report.
3. Prepare `@font-face` for Anaqa VF as a variable font:
   - `font-weight: 100 900`
   - files expected at `public/fonts/anaqa/AnaqaVF.woff2` (and `.ttf` as a fallback)
   - the face only loads if the file exists; the build must not break while it's missing
4. Write the exact drop-in steps in the README.
5. **Body paragraphs in Arabic:** the guide does NOT assign a face to long body text. Leave them on the current setting and list them in the report. The designer will decide.
6. No other Arabic font anywhere.

## D. 60 / 30 / 10 check
Estimate per page (Home, About, Contact) the share of ivory/beige vs navy/olive/charcoal vs terracotta. Report the numbers. Fix only an obvious violation: terracotta well over 10%, or dark areas dominating a page. Don't redesign sections.

## E. Don't
- Don't change layout, copy, motion or images in this fix.
- Don't add the signature pattern or any element from the guide's "applications" page. Those are print and catalogue uses, not website sections.

## Check and report
- Before/after screenshots of Home, About and Contact in EN and AR at 1440px.
- The colour table, the logo placement list, the font role list, and the 60/30/10 numbers.
- Anything the guide doesn't cover.
- Lint and build pass.
