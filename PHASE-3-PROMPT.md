# Phase 3 — Products gallery (paste this into Claude Code)

Phase 2 approved. Notes on your report:
- Copyright, the footer labels and the ivory footer: all correct, keep them.
- Contrast: keep the shade as specified. The title is large text, so 3:1 applies.
- Please check the **AR hero at 390px** now and fix anything you find.

Then build the Products section (Home, `#products`). STOP and report when done.

## Content (verbatim from en.ts / ar.ts)
- Section label "Our Products" / "منتجاتنا".
- Statement "Upholstery Fabrics for Every Application." / "أقمشة تنجيد لمختلف الاستخدامات."
- The intro paragraph, then "Our available fabric range includes:".
- 10 fabrics in PDF order, each with its name and description.
- The note.
- 3 CTAs: "Request Our Catalogue" (primary), "Request Product Samples", "Request a Quote" (text links). All three go to the Contact page.

## Layout: Etro-style sticky horizontal gallery (shorter than Etro)
Reference: etrotextiles.etro.com, section "Discover New Fabrics".

**Desktop (≥ 1024px):**
1. **Intro block**, normal flow, ivory background, 136px top padding.
   - Left column (~200px): the label in terracotta, 21px.
   - Right column: the statement in Cormorant 400, `clamp(30px, 3.2vw, 44px)`, line-height 1.2. Below it, the intro and "includes:" lines at 19–21px in charcoal.
   - Use the same two-column header pattern as the other sections.
2. **Pinned stage**, 100vh tall, pinned with GSAP ScrollTrigger.
   - Total scroll distance: about 2.2 × viewport height. Shorter than Etro on purpose.
   - **Behind the cards:** the statement again, very large, as decoration: Cormorant 300, about 16vw, espresso at 8% opacity, centred vertically, on one line, `aria-hidden`.
   - **Track:** a horizontal row of the 10 cards. As you scroll, it moves from fully right of the content start to the last card plus a 20vw end spacer. Use a linear map from scroll position to x. Smooth it with Lenis, not with a scrub delay over about 0.5s.
   - **RTL:** the track moves the opposite way. The first card starts on the right.
   - **Card:** 340px wide, ivory-white background `#F5F2EC`, radius 10px, soft shadow `0 20px 40px rgba(54,31,23,.12)`, padding 14px.
     - Image: square 1:1, radius 6px, `object-fit: cover`, using the product photo.
     - Name: 26px, Cormorant 500, or `--font-ar` 700 in Arabic.
     - Description: 17px, line-height 1.5, charcoal.
     - Card gap: 56px.
   - **Rhythm:** cards alternate tilt and offset. Odd cards: `rotate(-4deg)`, `translateY(-40px)`. Even cards: `rotate(3deg)`, `translateY(30px)`. Small, not dramatic.
   - **Motion on scroll:** each card eases its rotation toward 0 as it passes the centre of the viewport, then back. Use a subtle 0 → ±2deg range.
   - **Hover:** the image scales to 1.05 over 0.8s, `cubic-bezier(.2,.7,.2,1)`, and the card lifts 6px.
   - **Progress:** a thin 1px bar at the bottom of the stage, 120px wide, centred, fills 0 → 100% with the scroll. Use espresso at 30%.
3. **After the pin**, in normal flow:
   - The note in italic olive, 17px.
   - Then the CTAs: primary button with espresso background and ivory text, height 52px, padding 0 28px. On hover it turns terracotta.
   - The two text links have a 1px underline offset 6px.
   - Top border `1px rgba(54,31,23,.22)`, 32px padding.

**Tablet and mobile (< 1024px):**
- No pinning.
- The track becomes a native horizontal scroller: `overflow-x: auto`, `scroll-snap-type: x mandatory`, cards about 78vw wide and snapping to start, hidden scrollbar.
- Keep a small tilt (±2deg).
- Show a "1 / 10"-style counter only if it needs no new copy. Otherwise skip it.

**Images**
- Use the responsive AVIF/WebP/JPG set with proper `sizes`.
- Lazy-load every card after the 3rd.
- Reserve the aspect ratio so there is no layout shift.
- Remember: the names printed on the photos differ from the PDF. Show the PDF names only, and put the PDF name in the alt text.

**Reduced motion**
- No pinning and no tilt animation. The track is a normal horizontal scroller.

**Accessibility**
- The track is a list (`<ul>`). Each card is an `<li>` containing an `<h3>`.
- Keyboard: when a card is focused, scroll it into view.
- With pinning, the content must still be reachable by tabbing.

## Report when done
- What you built.
- EN and AR at 1440px and 390px (screenshots or a description).
- The scroll length you ended up with.
- Anything you couldn't match.

Then wait for "go" (next: What We Manufacture).
