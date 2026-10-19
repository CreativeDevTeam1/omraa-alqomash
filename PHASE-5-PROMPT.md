# Phase 5 — About page (paste this into Claude Code)

Phase 4 approved. Moving `SectionIntro` to take props, and moving the padding into the sections, are both good changes.

Build the full About page (`/en/about`, `/ar/about`). STOP and report when done.

## Content (verbatim from en.ts / ar.ts)
- **About Us:** the label/title, then the opening sentence ("OMRAA AL QOMASH is an Egyptian textile manufacturing and export company"), then paragraphs P1–P6 in PDF order.
- **Our Vision:** the heading, the statement, and 2 paragraphs.
- **Our Mission:** the heading, the statement, and 1 paragraph.
- The text is NOT split differently from the PDF. Each paragraph stays whole. Only placement changes.

## Images
| place | image |
|---|---|
| Intro band | photos/still-life |
| Story row 1, large | photos/weave-macro |
| Story row 1, small overlap | photos/fabric-fan |
| Story row 2, large | photos/swatch-book |
| Story row 2, small overlap | photos/exhibition-booth |
| Vision & Mission | photos/swatch-fan |

`exhibition-booth` is only 480×640, so it goes in the SMALL overlapping slot (about 260×300), never large.

## Sections, top to bottom (light and dark alternate on purpose)

**1. AboutIntro** — ivory
- Flex row, wrapping, bottom-aligned, space-between. Padding: 150px top, 96px bottom.
- **Title:** "About Us" / "من نحن"
  - EN: Cormorant 300, `clamp(72px, 9.4vw, 136px)`, line-height .9, letter-spacing −.02em.
  - AR: `--font-ar` 700, line-height 1.3.
  - Use a real `<h1>`.
- **Opening sentence:** max-width 500px, `clamp(26px, 2.5vw, 36px)`, line-height 1.22. In Arabic use `--font-ar` 700, line-height 1.6.

**2. Band** — full width
- `still-life`, 620px tall (360px on mobile), `object-fit: cover`.
- The image settles from scale 1.12 to 1 as it enters, scrubbed with the scroll.

**3. AboutStory row 1** — ivory, padding 140px top and bottom
- **Collage, 620×780:**
  - Large image (`weave-macro`): 540×700 at the start corner.
  - Small image (`fabric-fan`): 260×300 at the end-bottom corner, with a 12px ivory border, overlapping the large one.
- **Copy, max-width 540px:**
  - P1 at `clamp(24px, 2.1vw, 30px)`, line-height 1.36.
  - Then P2 at 20px, line-height 1.6, charcoal.
  - 36px gap between them.
- 110px gap between the collage and the copy. Vertically centred.
- RTL mirrors it automatically through logical properties.

**4. Pull-quote band** — olive `#434B38`, ivory text, centred, padding 160px top and bottom
- P3 first: max-width 760px, 21px, line-height 1.65, opacity .82.
- 56px below it, P4 as the pull quote:
  - EN: Cormorant italic, `clamp(36px, 4.4vw, 64px)`, line-height 1.12, max-width 1000px.
  - AR: `--font-ar` 700, not italic, line-height 1.5.

**5. AboutStory row 2** — ivory
- Copy first: P5 at the large size.
- Then the collage, mirrored: the large image (`swatch-book`) at the END corner, and the small image (`exhibition-booth`) at the START-bottom corner.

**6. Quality** — espresso `#361F17`, ivory text, `id="quality"` (the footer link points here)
- Flex row, space-between, centred, padding 120px top and bottom.
- **"ISO 9001":**
  - Cormorant 300, `clamp(88px, 12vw, 176px)`, line-height .9, beige `#B8A38D`, nowrap.
  - Always Latin and always LTR, even on the Arabic page (`dir="ltr"`, `lang="en"`).
  - This is decorative typography taken from P6, so it gets `aria-hidden`.
- **P6:** max-width 520px, 24px, line-height 1.5.

**7. VisionMission** — olive `#434B38`, ivory text, `id="vision"` (the nav links "Vision & Mission" here)
- Two halves.
  - **Image half:** `swatch-fan`, min-height 760px, cover.
  - **Text half:** padding 104px 72px.
- **Vision block:**
  - Heading "Our Vision" / "رؤيتنا": 21px, beige.
  - Statement: `clamp(28px, 2.6vw, 38px)`, line-height 1.2.
  - The 2 paragraphs.
- **Mission block:**
  - A 1px border-top in `rgba(234,230,223,.25)`, with 40px padding-top and a 72px gap from the Vision block.
  - The same structure.
- **Mobile:** stack, with the image 380px tall.

## Motion (ScrollTrigger, play once, reduced motion = static)
- Every text block and collage fades up 48px with opacity, from entry to about 28% of the viewport.
- Large collage images settle from scale 1.12 to 1.
- The small overlapping image moves about 40px slower than the large one (gentle parallax), desktop only.
- The pull quote reveals line by line. Use a mask, so no letters are split. In Arabic, reveal word by word.
- "ISO 9001" slides in from 4% letter-spacing to its final spacing while fading in.

## Also
- Header nav on this page:
  - "About Us" → top of the page.
  - "Vision & Mission" → `#vision`. Smooth scroll through Lenis, offset by the sticky header.
  - "Our Products" and "What We Manufacture" → `/xx#products` and `/xx#manufacture` on Home, landing correctly even with the Products pin.
- The page ends with the Footer only. There is no contact section here, because Contact is its own page.

## Report when done
- EN and AR at 1440px, 768px and 390px.
- How the Home anchors behave when arriving from About (pinned section offsets).
- Anything you couldn't match.

Then wait for "go" (next: Contact page).
