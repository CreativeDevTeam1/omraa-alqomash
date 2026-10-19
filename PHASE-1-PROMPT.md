# Phase 1 — Foundation (paste this into Claude Code)

Read `CLAUDE.md` and `_source/README.md` first. This is PHASE 1 ONLY. Do not build page sections yet. When done, summarise and STOP until I say "go".

## Stack

Vite + React + TypeScript · React Router · plain CSS with custom properties + CSS Modules (no Tailwind) · GSAP (+ScrollTrigger) and Lenis installed now, used later · ESLint + Prettier.
Scaffold in this folder (keep `_source/` as is; do not import from it at runtime — copy what you need into `src/assets` or `public/`).

## Deliverables, in this order

1. **Scaffold** with scripts: dev, build, preview, lint.
2. **Styles** — `src/styles/tokens.css` (colours from CLAUDE.md, type scale, spacing scale, container 1240px with 48px side padding desktop / 20px mobile, easing tokens), `reset.css`, `globals.css`, `fonts.css` (Google Fonts, `font-display: swap`, real fallbacks; `--font-ar` = Amiri for now).
3. **Content** — `src/content/types.ts` (one shared interface), `en.ts`, `ar.ts`. Extract EVERY section from the PDF verbatim: About Us, Our Vision, Our Mission, Our Products (intro, 10 fabrics with descriptions, note, 3 CTAs), What We Manufacture (intro + 6 items), Contact Us, Footer. Plus the approved hero lines from `_source/README.md`. Both files must have identical keys.
4. **i18n + routing** — language from the route; set `<html lang>` and `dir`; language switch keeps the current page (`/en/about` ↔ `/ar/about`).
5. **Layout** — real, working `Header` (logo SVG, nav: About Us · Vision & Mission · Our Products · What We Manufacture · Contact Us · language switch) and `Footer` (all columns from the PDF + contact details), both languages, RTL correct, responsive with a mobile menu.
6. **Skeletons** — empty placeholder components for every section in CLAUDE.md ("Approved structure"), each rendering just its name, wired into the 3 pages, so I can click through the skeleton.
7. **Assets** — copy from `_source` with the same kebab-case names; generate WebP/AVIF + JPG fallback for images (responsive sizes); use the already-compressed MP4s and posters as they are. Report final sizes.
8. **README.md** — run instructions, folder structure, where content lives, how to swap the Arabic font.

## Your final message must include

- What you built (short).
- Every place the PDF lacked text (TODO list).
- Every inconsistency you found in the PDF (names, spelling, numbers) + the list in `_source/README.md` confirmed.
- A proposed Phase 2+ plan (one section per phase: Hero → Products gallery → Manufacture → About → Contact → Loading screen → polish/performance).
  Then wait for "go".

## Context for later phases (do NOT implement now)

- Loading: `drape-closeup.mp4` full-screen with logo and a 000→100 counter, then a smooth hand-off into the Hero (no slide-up; final animation chosen from our prototypes).
- Hero: `hero-fabric.mp4` autoplay/muted/loop/playsinline; centred very large "OMRAA AL QOMASH" (Light, wide tracking) revealed letter by letter from blur, thin rule, then the descriptor line. Arabic: "أمراء القماش" + "جودة تنسج المستقبل". Header sits on ivory above the hero.
- Products: Etro-style sticky horizontal-scroll gallery (shorter than Etro), cards with slight alternating rotation.
- Manufacture: 3-column image cards, image zoom on hover.
- About: big title + statement, full-width band, text with overlapping images (alternating sides), olive pull-quote band, "ISO 9001" huge on espresso, Vision & Mission.
- Scroll reveals throughout; everything respects prefers-reduced-motion; Lighthouse mobile 90+.
