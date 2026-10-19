# Fix 1: simplify the header nav (paste this into Claude Code)

The designer wants the header to have ONLY three page links, plus the language switch.

## New nav (desktop and mobile menu)
| EN | AR | Route |
|---|---|---|
| Home | الرئيسية | `/en` · `/ar` |
| About Us | من نحن | `/en/about` · `/ar/about` |
| Contact Us | تواصل معنا | `/en/contact` · `/ar/contact` |

- Keep the language switch ("العربية" / "English") exactly as it is now.
- Remove these from the header and the mobile menu: Vision & Mission / رؤيتنا ورسالتنا, Our Products / منتجاتنا, What We Manufacture / ماذا نصنع؟.
- Do NOT delete those strings from `en.ts` / `ar.ts` if anything else uses them (section titles, footer). Only remove them from the nav.
- **Copy:** "Home" / "الرئيسية" are new labels approved by the designer. Add them to `_source/content/verified-copy.md` under a new "Interface labels (designer-approved)" heading, along with the 4 interface labels from Phase 2 (menu, close, skip link, "Page not found").
- **Current page:** the link for the page you're on gets `aria-current="page"` and a subtle active state that uses the existing nav hover style, not a new design. No underline animation or dot unless it already exists.
- **Logo:** the header logo still links to Home.
- **Spacing:** with three links, re-balance the desktop nav spacing so it doesn't look empty. Keep the current layout, font, size and colours.
- **Footer:** do not change the footer.
- **Anchor scrolling:** if any code scrolled to section anchors from the nav (#vision, #products, #manufacture), remove that code and leave the section ids in place.

## Check
- EN and AR at 1440px and 390px, including the mobile menu (focus trap, Esc, body lock still work).
- `aria-current` is correct on all 3 pages.
- The silk loader's logo flight still lands exactly on the header logo, because the header layout changed. Re-measure it at 1440px and 390px.
- Lint and build pass.

Report briefly, with what changed and screenshots if you can.
