# Fix 8b: phone icon next to the phone number in the footer (paste this into Claude Code)

**Scope:** the Footer "Contact" / «تواصل معنا» column only, in EN and AR.

- Put a phone-handset icon directly next to the phone number "01208000040":
  - before the number in reading order (on its left in EN, on its right in AR)
  - in the same row, vertically centred with the number
- **Glyph:** Lucide's `phone` icon (ISC licence), as inline SVG. Don't draw your own.
- **Size, stroke and colour:**
  - 18px with Lucide's default stroke width
  - espresso `#361F17`, the same colour as the number
  - 10px gap to the number
- The icon is decorative: `aria-hidden="true"`. The whole row (icon + number) stays one `tel:` link, exactly as now.
- **The number stays LTR** inside `<bdi dir="ltr">` as it is now.
- **Hover:** nothing moves, same as the rest of the footer.
- If Fix 8 is done, match its icon visual weight so the phone icon and the 3 social icons look like one family.

## Check
- EN and AR at 1440px and 390px.
- Lint and build pass.

Report briefly, then restart `npm run preview`.
