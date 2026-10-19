# OMRAA AL QOMASH — project rules (read before every task)

Egyptian upholstery & furnishing fabric manufacturer. B2B brand website, no shop/cart. English (LTR) + Arabic (RTL).

## Hard rules

1. **Content is verbatim.** Every word comes from `_source/content/AMRAA EL QOMASH content Website.pdf`. Never write, rephrase, shorten or invent copy (no taglines, labels, alt-text marketing). Missing text → leave a `TODO(content)` and report it.
2. English brand name is **OMRAA AL QOMASH** (the PDF sometimes says "AMRAA EL QOMASH").
3. Arabic tagline **جودة تنسج المستقبل** (from the logo / identity guide) is allowed.
4. Work in phases. Finish the current phase, summarise, then STOP and wait for "go".
5. Ask before adding dependencies outside: Vite, React, TypeScript, React Router, GSAP (+ScrollTrigger), Lenis, ESLint, Prettier.
6. Design: one type family per role per language (EN: Playfair Display = display, Cormorant Garamond = text; AR: Anaqa Bold/Regular); no small uppercase "eyebrow" labels; no two-colour headings; no gradient text. Respect `prefers-reduced-motion`.
7. Use logical CSS properties (inline/block) so RTL works from one stylesheet.

## Brand tokens (identity guide)

ivory #EAE6DF · espresso #361F17 · olive #434B38 · beige #B8A38D · terracotta #9E472A (accent, sparing) · navy #1B2A3B · charcoal #2D2F2D · white #FFFFFF (an approved logo background) — 60/30/10 balance. No other colour may appear (guide: `_source/content/brand-identity-guide.pdf`).
Fonts (brand guide p.5): EN **Playfair Display 400** for display (`--font-en-display`: h1/h2, `.role-display`, hero, statements, pull-quote, Products background title, loader wordmark, 404) and **Cormorant Garamond** for everything else (`--font-en-text`), mirroring the Arabic display/light split. AR identity font "Anaqa" (client files: Regular 400 + Bold 700, no Thin; fsType 2 / Adobe EULA, client must confirm a web licence, see README): `--font-ar-display` → Bold, `--font-ar-light` and body → Regular; Amiri only supplies Latin digits/letters. Never fake a weight. Logo: vector only, never altered, clear space ≥ 1X (X = one emblem diamond), only on ivory, navy, olive, terracotta, charcoal or white.

## Approved structure (3 pages per language)

- Home: LoadingScreen → Header → Hero (video) → ProductsGallery (automatic horizontal carousel, 10 cards, pausable) → Manufacture (6 image cards) → Footer
- About: AboutIntro (h1 + lead + still-life band) → AboutHighlights (4-item strip) → AboutStory (sticky weave-macro image + 3 paragraphs; olive partnership band) → Quality (ISO 9001 on espresso) + VisionMission (swatch-fan image + olive text) → Footer. Only 3 images (still-life, weave-macro, swatch-fan).
- Contact: ContactSection (navy) → Footer
  Routes: /en, /en/about, /en/contact, /ar, /ar/about, /ar/contact. `/` → `/en`.

## Design references

- Figma: https://www.figma.com/design/qfYW3LsZLoYjJS47Oljwds — frames "Page 1 — Home (EN)", "Page 2 — About Us (EN)", "Page 3 — Contact Us (EN)" and the (AR) versions. Starter plan = very few MCP calls: read only, and only when asked.
- Asset map and known content issues: `_source/README.md`.
