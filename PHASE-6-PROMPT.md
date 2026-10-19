# Phase 6 — Contact page (paste this into Claude Code)

Phase 5 approved:
- Empty alt text on the decorative About photos: correct.
- A once-only reveal (not scrubbed): correct.
- Vision & Mission as a list of paragraphs: fine. Double-check that the Arabic split matches `_source/content/verified-copy.md`. Vision is 2 paragraphs ("نسعى إلى…" and "كما نطمح…"). Mission is 1 paragraph.
- Also check AR at 390px and EN at 768px on About, which you skipped.

Then build the Contact page (`/en/contact`, `/ar/contact`). STOP and report when done.

## Content (verbatim from en.ts / ar.ts)
- **Section text:** the label "Contact Us" / "تواصل معنا", then the statement "Let's Build Your Next Supply Partnership." / "لنبدأ شراكة التوريد القادمة.", then the intro paragraph.
- **Details:** Phone, WhatsApp, Based In, Email, Instagram, Facebook, each with its value.
- **Business Inquiries:** the heading and its paragraph.

## Links (confirmed by the client — add them to `channels.ts`)
| channel | href | shown value |
|---|---|---|
| Phone | `tel:+201208000040` | 01208000040 |
| WhatsApp | `https://wa.me/201203406666` | 012 03406666 |
| Email | `mailto:omaraatextiles@gmail.com` | omaraatextiles@gmail.com |
| Instagram | `https://www.instagram.com/omraa_textiles/` | omraa_textiles |
| Facebook | `https://www.facebook.com/profile.php?id=61594206881800` | Omraa textiles |

- External links open in a new tab with `rel="noopener"`.
- Remove the "missing Facebook URL" TODO from the README.

## Layout
**Desktop:** a full-height split, `min-height: calc(100svh - header)`.
- **Text half:**
  - **Container:** navy `#1B2A3B` with ivory text, padding 120px top and bottom.
  - **Label:** 21px, beige `#B8A38D`.
  - **Statement (an `<h1>` on this page):** EN Cormorant 400, `clamp(40px, 4.4vw, 64px)`, line-height 1.1. AR `--font-ar` 700, line-height 1.5.
  - **Intro:** max-width 560px, 20px, ivory at 80%.
- **Details grid:** a 3-column `<dl>`, 2 columns on tablet and 1 on mobile, with gaps of 36px row and 40px column.
  - Each item has a 1px top border `rgba(234,230,223,.22)` and 16px top padding.
  - `dt`: 15px, beige, letter-spacing .02em.
  - `dd`: 24px, ivory.
  - Phone and WhatsApp numbers are always LTR, even on the Arabic page (`dir="ltr"` with unicode-bidi isolate).
- **Business Inquiries:** below the grid, 56px gap.
  - Heading: 15px, beige.
  - Paragraph: max-width 560px, 19px.
- **Image half:** `photos/linen-drape`, cover, sticky so it stays in view while the text scrolls on tall content.
- **Mobile:** the image stacks above the text, 320px tall.

## Interactions
- Hovering a link value turns it beige, and a 1px underline grows from the inline start over 0.4s.
- On load, the label, statement, intro and grid items fade up 24px in sequence, staggered 0.06s, starting at 0.2s. The image settles from scale 1.08 to 1 over 1.6s. Reduced motion: no animation.

## Also
These must all lead to this page:
- the 3 Products CTAs on Home
- the header "Contact Us"
- the footer "Custom Manufacturing" and footer Business links
- the footer Contact column (show its values as links using the same hrefs)

## Report when done
- EN and AR at 1440px, 768px and 390px.
- Confirm every link opens the right target.

Then wait for "go" (next: Loading screen).
