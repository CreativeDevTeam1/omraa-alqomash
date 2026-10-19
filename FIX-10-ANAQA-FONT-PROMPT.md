> **Licence note:** the designer was told the supplied files declare a restricted licence (`fsType = 2`, an Adobe Fonts EULA URL) and decided to proceed. Record this in the README under "Fonts" so the client is aware.
>
> **Before starting:** `_source/fonts/anaqa/` must contain BOTH `Anaqa-Regular.ttf` and the Bold file. If the Bold file is missing, STOP and report. Do not fake bold.
>
> **English stays exactly as it is:** Cormorant Garamond with the current weights. Do not use the files in `_source/fonts/Cormorant-Garamond-SemiBold/` and change nothing in the Latin typography.
>
> **Digits:** Anaqa has no digits. Make sure digits inside Arabic text (phone numbers, "9001", the loader counter in AR) fall back cleanly to the next font in the stack, with matching size and baseline.

# Fix 10: install the Anaqa Arabic font (paste this into Claude Code)

The designer has placed the client-supplied Anaqa font files in `_source/fonts/anaqa/`. They are from the ZIP linked in the client's Word file:
- `Anaqa-Regular.ttf`
- the Bold file, probably `Anaqa-Bold.ttf`

List the folder first and report the exact file names and their internal names and weights, read with fontTools.

**Important:** these are two static files (Regular and Bold). There is no "VF" variable file and no Thin weight. Do not fake weights: no `font-synthesis`, no faux bold or faux thin.

## Steps
1. **Inspect each file** with fontTools:
   - family and style names
   - `usWeightClass`
   - whether it is a variable font (an `fvar` table)
   - glyph coverage: Arabic, Arabic presentation forms, Latin digits, «،» «؟» «ـ», and the diacritics used in our copy
   - Run every Arabic string in `ar.ts` through the font and list any missing glyphs.
2. **Convert to woff2 and subset:**
   - keep Arabic, Arabic Presentation Forms A/B, basic Latin digits and punctuation, and the characters actually used in `ar.ts`
   - keep the `kern`, `liga`, `calt`, `rlig`, `init`, `medi`, `fina`, `isol` and `mark`/`mkmk` features, so Arabic shaping stays correct
   - output to `public/fonts/anaqa/Anaqa-Regular.woff2` and `public/fonts/anaqa/Anaqa-Bold.woff2`
   - report the sizes
3. **Replace the VF-only plugin** from Fix 4 with two normal `@font-face` rules:
   - `font-family: "Anaqa"`, weight 400 → Regular, weight 700 → Bold
   - `font-display: swap`
   - Preload only the face used in the hero (Bold).
4. **Map the guide's roles to the files that exist:**
   - `--font-ar-display` (guide: "Anaqa VF Bold": headings and slogans) → Anaqa 700
   - `--font-ar-light` (guide: "Anaqa VF Thin": subheadings, specs, product cards) → Anaqa 400. Thin does not exist in the supplied files, so Regular is the lightest real weight. Note this in the README.
   - Arabic body paragraphs, nav, buttons and contact values (not assigned by the guide) → Anaqa 400, so the whole Arabic site is one family as the guide intends. Amiri stays only as the fallback in the stack.
5. **Remove Amiri files from the build** if nothing uses them as a primary face anymore. Keep it in the fallback stack via `local()`, or drop it if unused.
6. **Re-check Arabic layout everywhere,** because the metrics change:
   - the hero (title letter reveal, tagline), the header nav, the loader
   - the Products cards and the background title, including the gallery fit from Fix 3 and the language-switch rebuild from Fix 9
   - Manufacture, About, Contact, the footer and the 404
   - line-heights, clipping of tall letters and dots (ascenders/descenders), and buttons that changed width
   - Fix anything that clips or overflows.
7. Run Lighthouse on the 3 AR pages and report the scores.

## Check
- AR at 1920, 1440, 1024, 390 and 360px. Take screenshots of every section.
- The hero «أمراء القماش» and «جودة تنسج المستقبل» render in Anaqa Bold. Verify in DevTools → Computed → Rendered fonts.
- Lint and build pass.

Report briefly, with the screenshots, then restart `npm run preview`.
