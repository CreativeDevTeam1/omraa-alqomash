# Fix 9 (high priority): the Products gallery breaks after switching language (paste this into Claude Code)

## Bug, reported by the designer
1. Open the site in EN (or AR) and the Products gallery works.
2. Switch language with the header switch, so it's a client-side route change with no full reload. The gallery in the NEW language is broken:
   - only a few cards show, or none
   - the stage shows only the big background title («أقمشة تنجيد لمختلف الاستخدامات.»)
   - the motion is wrong
3. It happens both ways, EN→AR and AR→EN. A full page refresh fixes it.

Her screenshot: `/ar` at about 1900×900 after switching from EN, with the stage showing only the background title and no cards.

Earlier she also said the "EN gallery motion is wrong". That was very likely the same bug: she had arrived in EN from AR.

## Likely cause (confirm it first)
- The GSAP ScrollTrigger pin and track tween keep the measurements and direction from the first language: the old track width, the LTR/RTL sign, the old pin-spacer height, and the old font metrics.
- The `dir` change and the different Arabic/Latin card heights are never re-measured, so the track is translated off-screen.
- The fit calculation from Fix 3 (card width and drop vs stage height) may also be stale.

## Fix: make it robust, not a patch
1. **Remount the gallery on language change:** key the Products section (or its GSAP hook) by `lang`, so a language change fully kills the old ScrollTrigger, timeline and pin-spacer and builds new ones.
   - Clean up on unmount: `ctx.revert()` via `gsap.context`, and kill every ScrollTrigger the component created.
   - No orphaned pin-spacers may remain in the DOM.
2. **Build only after layout is final:**
   1. after `dir` / `lang` are set on `<html>`
   2. after `document.fonts.ready`
   3. after the card images have their reserved aspect-ratio boxes; don't wait for the images to load
   4. then call `ScrollTrigger.refresh()`
3. **Read the direction at build time:** derive it from `document.documentElement.dir` inside the setup function, not once at module load.
4. **Recompute everything in the refresh:** use `invalidateOnRefresh: true` and function-based values (`x: () => …`, `end: () => …`) so the track distance, the Fix 3 fit (card width, drop) and the pin length are all recomputed on every refresh and resize.
5. **Lenis:** after the rebuild, call `lenis.resize()` and make sure the ScrollTrigger ↔ Lenis sync is still wired: one ticker, no duplicate `lenis.on('scroll', ScrollTrigger.update)` listeners piling up per switch.
6. **Other pinned or scroll-triggered sections** on Home, About and Contact: check that they also rebuild correctly after a language switch, and apply the same pattern where needed.

## Test (every case without a full reload)
| Sequence | Check |
|---|---|
| Load `/en` → scroll the gallery start / middle / end → switch to AR → scroll start / middle / end | all 10 cards appear in order, the motion runs right→left as in RTL, ends on the last card |
| Load `/ar` → same → switch to EN | same, left→right direction correct |
| Switch EN→AR→EN→AR four times quickly, then scroll | no duplicated pin-spacers (count them in the DOM), no jumps, no stale listeners (log the ScrollTrigger count: it must stay constant) |
| Switch language while scrolled INTO the pinned gallery | the new page starts at the top and the gallery works |
| Go to About → back to Home, in each language | gallery works |
| Resize 1920×900 → 1366×768 after a switch | cards re-fit (Fix 3 rules), nothing clipped |

Do these at 1920×900 and 1440×900. Take screenshots of the gallery at the start, middle and end, after the switch, in both directions.

Lint and build pass. Report briefly with the screenshots, then restart `npm run preview`.
