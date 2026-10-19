# Fix 14: hero video background + the approved "Thread + Video" loader (paste this into Claude Code)

Client feedback after the deploy:
1. The hero video was shot on pure black, meant to sit on a background. The client called it "alpha". The approved background is **Espresso #361F17**.
2. The approved loader is concept **07 — "Thread + Video"** (الخيط + الفيديو), NOT the silk/push loader currently built.

## A. Hero and loader videos on espresso (already rendered for you)
The designer's assistant composited both original `.mov` files onto Espresso with a screen blend. Black becomes espresso, the fabric keeps its colours, and there are no keying holes. The new masters are in `_source/videos/espresso/`:
- `hero-fabric-espresso.mp4` (1920×1080, 30fps, 8s, no audio) and `hero-fabric-espresso-poster.jpg`
- `drape-closeup-espresso.mp4` and `drape-closeup-espresso-poster.jpg`

Steps:
1. Replace the current hero and drape sources with these masters. Regenerate EVERY variant your Phase 8 pipeline produces from them (1080p and 720p, MP4 H.264 + WebM VP9, no audio, faststart, plus the WebP posters at full and 800px) and keep the same output file names, so nothing else has to change. Size targets: same as Phase 8 (hero ≤ 3MB at 1080p, drape ≤ 2MB).
2. Set the hero section background to `#361F17` so any letterbox or edge matches the video, and the poster too.
3. Re-check:
   - the hero shade: it may now be lighter than needed, so keep the text at AA contrast over the brightest frames
   - the mobile `object-position` from Fix 13. The empty area is now espresso, not black, so choose whatever shows the fabric best at 375px.
4. Before/after screenshots of the hero at 1440 and 375px, EN and AR.

## B. Replace the loader with concept 07 "Thread + Video", built EXACTLY like the approved reference
- **Reference:** `_source/loader-reference/index.html`. Open it in the browser, choose tab **07 الخيط + الفيديو**, and read the function `threadVideo()` plus the helpers `A()`, `counter()`, `maskAnim()` and `settle()`, and the CSS for `.thread`, `.main`, `.stitch`, `.needle`, `.center`, `.thread-logo`, `.wordmark`, `.counter` and `.cols`.
- **Port it 1:1 into React + GSAP:** same paths, timings, easings, colours and order. Use `drape-closeup-espresso` (the new variant) as the video.

**Sequence (times in ms from the start, all from the reference):**

| Time | What happens |
|---|---|
| 0 | Ivory screen. The drape video plays underneath at `scale(1.15)`. Top and bottom ivory halves (50.2% each) with the faint 5-column `.cols` lines cover it. |
| 150 | The terracotta thread (`.main` path) draws left→right over 1900ms, `cubic-bezier(.6,0,.3,1)`. The olive dashed stitch is revealed by clip-path from 400ms for 1900ms. The needle follows the path tip with easeInOutCubic and fades out at the end. |
| 150 | The counter runs 000→100 over 2400ms. |
| 1100 | The logo fades up from 10px over 800ms. |
| 1400 | The wordmark "OMRAA AL QOMASH" fades in with letter-spacing .6em → .32em over 900ms. |
| 2650 | The logo/wordmark group and the counter fade out over 300–350ms. |
| 2900 | The thread SVG fades out over 300ms. |
| 2900 | The screen opens along the thread. Top half: 0 → −30% (at 45%), holds to 60%, then → −101%. Bottom half mirrors (+30% → +101%). Duration 1600ms, `cubic-bezier(.7,0,.2,1)`. At the same time the video goes from scale 1.15 → 1 over 2600ms. |
| 4600 | The fabric lifts away from the bottom. The video wrapper gets a feathered mask `linear-gradient(0deg, transparent y−14%, #000 y+14%)` with y going from 110 → −30 over 1700ms. The video also moves `translateY(-6%)`. |
| 4600 | **Hero settle:** the hero video wrapper eases in from `translateY(7%) scale(1.06)`, `filter: blur(8px) brightness(.85)`, to normal over 2100ms. Call `playHeroIntro()` 1100ms after that point (as `settle(…, 2100, 1100)` does). Then remove the loader. |

**Keep from Phase 7:**
- It shows only on Home, on the first visit per session.
- Pre-paint cover, so there is no flash.
- Scroll is locked while it shows.
- `aria-hidden`, and `aria-busy` on `<main>`.
- Reduced motion: skip it, with a 300ms veil.
- Hero video restart and the hidden-tab retry.

**Real loading:**
- The opening at 2900ms waits until the hero video can play through and `document.fonts.ready` has resolved, with a hard cap of 6s.
- If it has to wait, hold the counter at 100 with the thread fully drawn, then continue.

**RTL (AR):**
- Mirror the thread drawing direction: right→left, by flipping the SVG with `scaleX(-1)`, along with the needle path.
- The wordmark stays LTR.
- The counter sits at the inline-end corner.

**Remove** the old silk and push hand-offs, the `LOADER_TRANSITION` switch and the logo FLIP flight code, so no dead code remains.

**Mobile:** the same sequence. The thread SVG spans the full width. Check 375 and 360px.

## Check
- Record the loader in EN and AR at 1440 and 375px. Compare frame by frame with the reference tab 07 at these times: 500, 1500, 2600, 3500, 4800 and 6000ms. Report any difference.
- Throttled cold load (Fast 4G): the sequence stays smooth and the 6s cap works.
- Lighthouse on Home EN and AR.
- Lint and build pass.

Then redeploy to Vercel production (`npx vercel --prod`), confirm the live URL shows the new loader and video, and report.
