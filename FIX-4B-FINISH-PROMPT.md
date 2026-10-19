# Fix 4b: finish Fix 4 (paste this into Claude Code)

Fix 4 approved as far as it went. Keep these as they are:
- the colour replacements
- the font roles, including the Thin role for label-style h2s
- the Anaqa drop-in plugin
- the 1X gap you added under the loader logo and on the apple-touch icon

Do these only, then report:
1. Run `npm run lint`, the type-check and `npm run build`. Fix anything that fails.
2. Open the before and after screenshots in `%TEMP%\brand` (Home, About and Contact, EN and AR, 1440px). Compare every pair and list any visible difference that is NOT a colour or font change from Fix 4.
   - Examples: a layout shift, text that got lighter or harder to read, a lost shadow, a hero that looks different.
   - Fix any unintended difference.
3. Contrast: after the colour swaps, re-check WCAG AA on:
   - the hero text over the video, now with the espresso shade on a charcoal base
   - the loader wordmark (espresso at 72%)
   - every text on olive, navy and charcoal
4. Read pages 3 to 7 of `_source/content/brand-identity-guide.pdf` (rasterise them and look at them) and confirm nothing on them applies to the website beyond what Fix 4 already covered. If something does, list it. Don't implement it.

Report briefly. Then run `npm run preview` so the designer can review it.
