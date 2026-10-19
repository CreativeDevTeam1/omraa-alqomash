# Fix 7: "What We Manufacture" / «ماذا نصنع؟» fully static (paste this into Claude Code)

The designer wants this section completely still on hover, with no lines under anything. EN and AR.

## Remove
- Every underline or line in this section:
  - text-decoration
  - border-bottom
  - ::after / ::before lines
  - the animated underline under card names (the terracotta name underline on hover from Fix 4)
  - lines under the label or the statement
- Every hover effect on the 6 cards and their contents:
  - no image zoom or scale
  - no card lift or translate
  - no shadow change
  - no colour or opacity change
  - no cursor change
- Remove the hover transitions too, so nothing animates.
- If the cards are links or have `tabindex` only for the hover effect, make them plain non-interactive elements (`<article>` / `<li>`), so they don't take keyboard focus for nothing. If a card links somewhere, keep the link but with no visual hover change, and keep a `:focus-visible` ring for keyboard users.

## Keep
- The layout, images, text, sizes and colours exactly as they are.
- The scroll-in reveal (the cards appearing as you scroll down) stays for now. Do NOT remove it; the designer will decide separately.

## Check
- Hover every card in EN and AR at 1440px. Nothing moves or changes (compare screenshots before and during hover).
- No line appears anywhere in the section.
- Lint and build pass.

Report briefly, then restart `npm run preview`.
