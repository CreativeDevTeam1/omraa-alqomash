# Phase 4 — What We Manufacture (paste this into Claude Code)

Phase 3 approved. All your judgement calls are accepted:
- The stage pins below the sticky header.
- The background statement drifts.
- The cards tilt −4° / +3° and straighten at the centre.
- Arabic uses weight 400.
- No mobile counter.

Next, build the Manufacture section (Home, `#manufacture`, right after Products). STOP and report when done.

## Content (verbatim from en.ts / ar.ts)
- Label: "What We Manufacture" / "ماذا نصنع؟"
- Statement: "Upholstery & Furnishing Fabrics" / "أقمشة التنجيد والمفروشات"
- Intro: "Our core product offering is focused on fabrics for upholstery and furnishing applications." and its Arabic version.
- 6 items, in PDF order. Each has a title and a description.

## Images (one per item, same order)
| item | image |
|---|---|
| Sofas & Chairs | uses/sofas-chairs |
| Beds & Headboards | uses/beds-headboards |
| Furniture Upholstery | uses/furniture-upholstery |
| Residential Projects | uses/residential-projects |
| Commercial Projects | uses/commercial-projects |
| Hospitality & Interior Projects | uses/hospitality-interior-projects |

## Layout
- **Background:** white `#FFFFFF`. This is a deliberate step lighter than the ivory Products section, so the two sections read as separate. Padding: 136px top and bottom on desktop, 88px on mobile.
- **Header:** reuse `SectionIntro` (terracotta label + statement + intro), same as Products.
- **Grid:** 72px below the intro.
  - Columns: 3 on desktop (≥ 1024px), 2 on tablet (≥ 640px), 1 on mobile.
  - Gaps: 56px row, 24px column.
  - In RTL the grid flows right to left, so item 1 sits at the top right.
- **Card:** no background, no border, no radius on the image.
  - Image: 4:3, `object-fit: cover`, `overflow: hidden`.
  - Title: 14px below the image. Cormorant 500, 26px, line-height 1.3, espresso. In Arabic use `--font-ar` 700, line-height 1.5.
  - Description: 8px below the title. 18px, line-height 1.55, charcoal.
- **Hover (desktop):** the image scales to 1.05 over 0.8s, `cubic-bezier(.2,.7,.2,1)`. The title underline grows from 0 to the title's width (1px, terracotta) over 0.5s. The cards are not links, so this is decoration only.
- **Scroll reveal:** use ScrollTrigger and play it once.
  - Each card fades up 48px, with a 0.08s stagger per row.
  - At the same time its image settles from scale 1.12 to 1, over 1.2s.
  - Trigger when the top of the card reaches 85% of the viewport.
  - Reduced motion: no reveal, everything visible.
- **Images:** the responsive set, with `sizes` matching the 3/2/1 columns. Lazy-load them. Reserve the 4:3 box so nothing shifts.

## Also
- Make sure there is no visual seam between the end of the pinned Products stage, its CTA row, and this section.
- Check that Lenis + ScrollTrigger still behave after this section is added. The pin start and end must not shift.

## Report when done
- EN and AR at 1440px, 768px and 390px (a description is enough).
- Anything you couldn't match.

Then wait for "go" (next: About page).
