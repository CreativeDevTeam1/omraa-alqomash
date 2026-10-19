# Fix 8: social links as icons in the footer (paste this into Claude Code)

**Scope:** the Footer "Contact" / «تواصل معنا» column only, in EN and AR. Do NOT change the Contact page.

## Change
1. Remove these three text lines from the column:
   - "WhatsApp: 012 03406666" / «واتساب: 012 03406666»
   - "Instagram" / «إنستجرام»
   - "Facebook" / «فيسبوك»
2. Add one row of 3 icons in their place, at the end of the column, after the email:
   - **Order:** WhatsApp, Instagram, Facebook. In RTL the row mirrors naturally.
   - **Links:** each icon uses the SAME link it has now. WhatsApp → the existing `wa.me` link, Instagram and Facebook → the existing URLs in `channels.ts`. Keep `target="_blank" rel="noopener noreferrer"`.
   - **Glyphs:** the official monochrome glyph of each platform, from Simple Icons (CC0), as inline SVG.
     - Don't draw your own versions.
     - No circles or boxes around them.
   - **Size and spacing:** 22px icons, 20px gap, on a 40×40px tap target each. Vertically aligned with the column text.
   - **Colour:** espresso `#361F17`, the same as the column text. No brand colours, so it stays inside the brand guide palette.
   - **Hover:** nothing moves. At most the same colour change other footer links already have; otherwise none.
   - **Accessibility:** each link gets `aria-label` from the existing strings: "WhatsApp: 012 03406666" / «واتساب: 012 03406666», "Instagram" / «إنستجرام», "Facebook" / «فيسبوك». The SVG is `aria-hidden="true"`. Keep the `:focus-visible` ring.
3. **Keep unchanged:** the phone number, the address «مدينة بدر، مصر» / "Badr City, Egypt", the email, and the column title.

## Check
- EN and AR at 1440px and 390px. The icons line up on one row, aligned with the text above, and each link opens the right destination.
- Lint and build pass.

Report briefly, then restart `npm run preview`.
