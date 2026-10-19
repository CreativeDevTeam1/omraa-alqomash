# Fix 6: header nav centred, no underline (paste this into Claude Code)

The designer wants this header layout, desktop only (≥ 1024px):

| Inline start | Centre | Inline end |
|---|---|---|
| Logo, as now | The 3 page links: Home · About Us · Contact Us / الرئيسية · من نحن · تواصل معنا | Language switch pill, as now |

## Layout
- **Truly centred:** the 3 links sit centred on the PAGE, not centred in the leftover space.
  - Use a 3-column grid: `grid-template-columns: 1fr auto 1fr`. The logo is justified to start, the links in the middle, and the switch justified to end.
- **RTL:** it mirrors automatically (logo on the right, switch on the left), with the links still centred.
- **Spacing:** keep the current link spacing, font, size and colour.
- **Mobile menu (< 1024px):** unchanged.

## No underline at all
- Remove the line under the active link, and any underline or line animation on hover or focus in the header nav.
- **Active page:** keep `aria-current="page"` for accessibility, but show no visual line.
- **Hover:** a plain colour/opacity change only, using the existing nav hover colour if there is one. If none exists, no hover change.
- **Keyboard focus:** keep the `:focus-visible` ring. It is required for accessibility and only shows when tabbing.

## Check
- EN and AR at 1920px, 1440px and 1024px. The links must be exactly centred: measure the link group's centre against `innerWidth / 2` (within 1px).
- The silk loader's logo flight still lands exactly on the header logo, because the header layout changed. Re-measure it at 1440px.
- Lint and build pass.

Report briefly, then restart `npm run preview`.
