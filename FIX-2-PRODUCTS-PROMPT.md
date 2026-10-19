# Fix 2: make "Our Products" match the Figma design exactly (paste this into Claude Code)

**Reference image:** `_source/figma/products-en.png`. Open it and keep comparing your build against it at 1440px until they match.

**Pixel sizes** below come from the Figma file (frame "Our Products — Scroll Gallery", 1440 wide).

The **pinned horizontal scroll behaviour stays**: it is already correct. What changes is how the section *looks*. Text stays verbatim from `en.ts` / `ar.ts`.

## 1. Section header: ONE row
- Section padding-top: 120px.
- Left: "Our Products" in terracotta, at the current label size.
- Right, aligned to the right edge of the content (x ≈ 1043 → 1292 at 1440): "Our available fabric range includes:" in charcoal, same size.
- REMOVE from this header the 2-column statement block and the intro paragraph ("We specialize in…"). Keep both strings in `en.ts` / `ar.ts`. Do not delete them. The statement moves to the background title (section 2).
- 40px from the header to the stage.

## 2. Background title: CLEARLY visible (this is the main difference)
- Text: the statement "Upholstery Fabrics for Every Application." / "أقمشة تنجيد لمختلف الاستخدامات."
- Two lines, centred. EN breaks as "Upholstery Fabrics for" / "Every Application."
- Cormorant 300, about 8.5vw (≈ 120px at 1440), line-height 1.
- Colour: solid espresso `#361F17` at ~90% opacity. NOT 8%. It must read clearly behind the cards, exactly like the reference.
- It does not move (it sits behind the moving track). `aria-hidden` stays because the statement is still in the DOM for screen readers (visually-hidden h2).
- Arabic: Amiri / `--font-ar`, same size logic, centred.

## 3. Cards: new style
- **Width:** 350px at 1440. Use `clamp(280px, 24.3vw, 350px)`.
- **Background:** white. Radius 10px. Soft shadow `0 24px 48px rgba(54,31,23,.14)`. Overflow hidden.
- **No inner padding around the image.** The image is full-bleed at the top of the card:
  - aspect-ratio 5 / 4
  - `object-fit: cover`
  - centred, so the polaroid in the photo stays fully visible; check all 10
- **Text block:** padding 22px 24px 28px.
  - **Name:** UPPERCASE in EN, Cormorant 500, 28px, letter-spacing .03em, espresso.
  - **Description:** 10px below the name, Cormorant 17px, line-height 1.45, charcoal.
  - **Arabic:** the name uses `--font-ar` 700, no uppercase, no letter-spacing.
- **Rotation:** fixed alternating tilt.
  - Odd cards (1, 3, 5…) `rotate(5deg)`, even cards `rotate(-5deg)`. In RTL, mirror the sign.
  - Remove the old "ease toward 0 at centre" rotation animation. The tilt is static, as in the reference.
- **Vertical stagger:** the stage is 820px tall at 1440. Odd cards sit with their top at 150px, even cards with their top at 300px (a 150px drop).
- **Horizontal rhythm:**
  - One card every 500px, so the gap is about 150px.
  - The first card's left edge sits at x ≈ 112px when the pin starts, so card 1 is fully visible and card 3 is partly cut at the right edge, as in the reference.
  - In RTL this is mirrored.
- **Hover:** keep the image scale to 1.05 and the 6px lift. The lift adds to the tilt; it doesn't reset it.
- **Remove the progress bar.** It is not in the design.

## 4. Note + actions: ONE row under the stage
- 40px below the stage. Section padding-bottom: 120px.
- **Left:** the note, italic, 17px, olive-grey as now, max-width 620px.
  - It must wrap and never run under the button. The reference shows an overlap; that is a Figma mistake, so don't copy it.
  - Leave at least 40px between the note and the button.
- **Right, in one row with gap 28px, vertically centred with the note:**
  - The primary button "Request Our Catalogue": espresso background, ivory text, height 52px, padding 0 28px, square corners as in the reference.
  - "Request Product Samples" and "Request a Quote" as text links with a 1px underline, offset 6px.
- **Remove** the top border line above this row if there is one; the reference has none.
- **Below 1024px:** stack them, with the note first and then the actions wrapping.

## 5. Tablet and mobile (< 1024px)
- The Figma design is desktop only, so keep the current native horizontal snap scroller.
- Use the NEW card style: full-bleed 5:4 image, white, uppercase name.
- Tilt ±3deg, card width 78vw, and a smaller stagger (odd 0, even 40px).
- **Background title:** about 13vw, still clearly visible behind the cards.

## 6. Keep
- The pin and the scroll distance logic.
- RTL direction.
- Lazy loading.
- Alt text, which uses the PDF names.
- Reduced motion: no pin, but the static tilt is fine.
- The `<ul>` / `<li>` / `<h3>` structure.
- Keyboard scroll-into-view.

## Check
- EN at 1440: put a screenshot of the section next to `_source/figma/products-en.png` and fix differences until it matches.
- AR at 1440: same, mirrored.
- EN and AR at 390px.
- The background title is readable and no card text is hidden by it. The cards sit above it in z-order.
- Lint and build pass.

Report briefly, with screenshots, and anything that differs from the reference.
