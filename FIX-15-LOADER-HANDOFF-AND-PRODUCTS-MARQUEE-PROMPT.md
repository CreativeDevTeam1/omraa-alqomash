# Fix 15: loader hand-off rebuilt + Products as an automatic horizontal carousel (paste this into Claude Code)

Work like a senior front-end engineer. Zero visual glitches, zero layout shift, 60fps, and correct behaviour in EN/AR, on desktop and mobile, with reduced motion and on slow networks. Read the whole prompt before starting.

---

## PART A: Loader: keep the thread intro, replace the ending

The designer and client do NOT like the current ending (the halves splitting with a pause, then the fabric "lifting" off with a mask). New story:
**thread → the drape video opens up → a very smooth cinematic dissolve into the hero, while the logo flies into the header** (the logo flight from the old Phase 7 "silk" loader, which they liked).

### Timeline (ms from loader start; all easings exact)
| Time | What happens |
|---|---|
| 0–2,600 | **Unchanged from Fix 14:** ivory screen with the `.cols` lines, the terracotta thread draws, the olive stitch, the needle, the logo fades up at 1100, the wordmark tightens .6em→.32em at 1400, the counter 000→100. The AR thread mirrors. |
| 2,650 | The wordmark and the counter fade out (300ms). **The logo STAYS.** |
| 2,900 | The thread SVG fades out (300ms). |
| 2,900 → 4,300 | **The screen opens onto the drape video in ONE continuous move, with no pause/hold keyframes.** Top half `translateY(0 → -101%)`, bottom half `(0 → 101%)`, 1400ms, `cubic-bezier(.76,0,.24,1)`. Add a soft 40px feathered edge on each half's inner edge (a gradient mask), so the opening edges are not hard lines. |
| 2,900 → 5,200 | The drape video (`drape-closeup-espresso`) slowly pushes in: `scale(1.18 → 1.04)`, `cubic-bezier(.22,.7,.2,1)`. |
| 2,900 | Behind the logo, a radial ivory veil fades in (0→1, 600ms): `radial-gradient(closest-side, rgba(234,230,223,.92), rgba(234,230,223,0))`, about 2.6× the logo size, centred on the logo. This keeps the logo on an approved ivory ground over the video. |
| **T = 4,700** | **Hand-off starts.** It waits here for real loading: hero video `canplaythrough` + `document.fonts.ready`, with a hard cap of 6,000ms from loader start. |
| T → T+1,500 | **Drape → hero dissolve ("push-through"):** the drape layer goes `scale(1.04 → 1.22)`, `filter: blur(0 → 12px) brightness(1 → 1.08)`, `opacity 1 → 0`, 1,500ms, `cubic-bezier(.45,0,.15,1)`. The loader's ivory remnants and the veil fade with it. |
| T → T+1,900 | **Hero under it:** the hero video wrapper goes from `scale(1.14)`, `filter: blur(10px) brightness(.8)` → `scale(1) blur(0) brightness(1)`, 1,900ms, `cubic-bezier(.22,.7,.2,1)`. The hero video is already playing from 0 since T−250ms. |
| T−100 → T+1,200 | **Logo flight (FLIP):** measure the loader logo rect and the header logo rect at T (not earlier). Animate a fixed-position clone from the first rect to the second, translate+scale only, 1,300ms, `cubic-bezier(.65,0,.2,1)`. The real header logo is `opacity:0` until the clone lands, then they swap in the same frame: no jump, no double image. In RTL the header logo is on the right; the measurement handles it. |
| T+300 → T+1,000 | The header background, nav and language switch fade in (700ms). Hidden until then. |
| T+1,000 | Call `playHeroIntro()`. |
| T+1,900 | Remove the loader from the DOM. Release the scroll lock. Remove `aria-busy`. |

### Rules
- **Animate only transform, opacity, filter and mask.** Use `will-change` only during the animation, then remove it.
- **Both videos decoding together:** the drape video is decoding during the dissolve. Make sure both videos are `playsinline muted` and that the hero has started before T, so no black frame appears.
- **Mobile:** same sequence. The header logo is smaller, so the FLIP handles it. Check at 375 and 360px.
- **Reduced motion:** skip all of it, with a 300ms ivory veil fade.
- **Show conditions, unchanged:** Home only, first visit per session, pre-paint cover with no flash.
- **Clean-up:** delete the old split-with-pause and lift-mask code. No dead code.

---

## PART B: Products: automatic horizontal motion (client request)

The client wants the product cards to **move horizontally on their own**: a continuous, elegant, auto-moving carousel. This replaces the scroll-pinned gallery.

### Behaviour
1. **Remove the ScrollTrigger pin** for Products entirely, along with its pin-spacer and the scroll distance. The section is normal height, sized to the cards, the stagger and padding.
   - This also removes the language-switch pin bugs from Fix 9 at the root.
   - Keep the Fix 9 rebuild-on-language-change pattern for the new carousel.
2. **Seamless infinite loop:**
   - Render the 10 cards, then a duplicate set for the loop. The duplicates get `aria-hidden="true"` and `inert`, and are excluded from tab order and from the accessibility tree.
   - Drive `x` with the GSAP ticker using `gsap.utils.wrap` over exactly one set width, so there is never a visible seam or jump.
   - Recompute the set width on resize, on font load and on language change.
3. **Speed:** about 45 px/s on desktop, 30 px/s below 768px. It must feel calm and luxurious, not busy.
4. **Direction:**
   - EN: cards travel right→left (content moves toward the start).
   - AR: they travel left→right (mirrored).
5. **Scroll-velocity coupling** (the "wow" layer, subtle):
   - While the page is being scrolled, add the scroll velocity to the carousel speed, clamped to ±4× the base speed and smoothed with a 0.6s ease back to base.
   - Scrolling down speeds it along its direction; scrolling up briefly reverses it.
   - Use Lenis velocity.
6. **Drag / swipe:**
   - The user can grab and drag the row with mouse or touch. Use GSAP Observer or Pointer Events with momentum.
   - Releasing continues with inertia, then eases back to the auto speed over 0.8s.
   - Use `touch-action: pan-y`, so vertical page scrolling on phones still works.
   - The cursor shows `grab` / `grabbing` on desktop.
7. **Pause:**
   - Pause smoothly (decelerate over 0.4s) on hover over a card and on keyboard focus inside the carousel.
   - Resume the same way.
   - Also pause automatically when the section is offscreen (IntersectionObserver) and when the tab is hidden, to save CPU.
8. **WCAG 2.2.2 (auto-moving content must be pausable):**
   - Add a small, discreet pause/play icon button at the section's inline-end, under the cards.
   - Use the existing icon style (Lucide `pause` / `play`, 18px, espresso).
   - `aria-label` uses NEW interface labels: "Pause" / «إيقاف» and "Play" / «تشغيل». Add them to `verified-copy.md` under "Interface labels (designer-approved)" and list them in your report.
9. **Card look (keep Fix 2):**
   - white card, full-bleed 5:4 image, uppercase EN name, ±5° alternating tilt, odd/even vertical stagger
   - the big background title behind the row, clearly visible
   - card width `clamp(260px, 24vw, 350px)`, gap about 150px desktop / 48px mobile
   - **Depth on top of that:** as cards move, apply a very subtle parallax to each card's image inside its frame: the image translates ±12px opposite to the motion, from the card's position relative to the viewport centre. No other new effects.
10. **Reduced motion:** no auto-motion and no velocity coupling. Use a native horizontal scroller with scroll-snap, as on mobile before, and hide the pause button.
11. **Performance:**
    - one `requestAnimationFrame` path via the GSAP ticker
    - transforms only
    - images lazy except the first 3
    - no layout reads inside the tick, only cached widths

### Check (both parts)
- **Record the loader** at 1440 and 375px, EN and AR. Compare frames at T−500, T, T+500, T+1,000 and T+1,900.
  - The logo lands exactly on the header logo (≤0.5px) at both widths.
  - There is no black frame, no flash and no jump.
- **Throttled cold load (Slow 4G):** the 6s cap works, and the hand-off is still smooth.
- **Carousel:**
  - No seam after 3 full loops.
  - Correct direction in EN/AR.
  - Drag, inertia, hover pause, focus pause and the pause button all work.
  - Switch language 4× quickly: still one ticker, constant listener count.
  - 360, 390, 768, 1440 and 1920px.
- **Lighthouse:** Home EN/AR. CLS must stay ≤ 0.01.
- Lint and build pass.

Then deploy to production (`npx vercel --prod`), verify on https://omraa-alqomash.vercel.app on desktop and a phone-width viewport, and report.
