# Phase 7 — Loading screen + hand-off into the Hero (paste this into Claude Code)

Phase 6 approved. Wrapping the email after the "@" was a good call.

Build the loading screen and its transition into the Hero. We approved TWO hand-off styles. Build both behind one config constant so the client can pick:
`src/config/loader.ts → export const LOADER_TRANSITION: 'silk' | 'push' = 'silk'`

STOP and report when done.

## When it shows
- Only when entering the **Home** route, and only on the first visit in a browser session (`sessionStorage`). About and Contact never show it.
- It covers everything, including the header. Scroll is locked while it shows: `lenis.stop()`, then `lenis.start()` afterwards.
- `prefers-reduced-motion`: skip the whole sequence. Show the hero in its final state with a 300ms fade.
- The loader container gets `aria-hidden="true"` and `role="presentation"`. Set `aria-busy` on `<main>` until it finishes.

## The loading screen (same for both styles)
- **Base:** fixed, full screen, z-index above the header, background ivory `#EAE6DF`.
- **Video:** `drape-closeup.mp4` with `drape-closeup-poster.jpg` as the poster. `muted autoplay playsinline loop`, `object-fit: cover`.
- **Overlay over the video:** `radial-gradient(ellipse 55% 50% at 50% 50%, rgba(234,230,223,.82), rgba(234,230,223,.25) 100%)`
- **Centre stack:**
  - The logo SVG, height `clamp(96px, 11vw, 160px)`.
  - 16px below it, the wordmark "OMRAA AL QOMASH": 11–14px, letter-spacing .32em, colour `#6E5E54`, always LTR. It is the brand name, so the same text appears on both languages.
- **Counter** at the bottom inline-end corner, 3.4vw from the edges:
  - "000" style, zero-padded, tabular numbers.
  - Cormorant 300, `clamp(40px, 6.4vw, 92px)`, espresso.
  - A small "%" in terracotta at 0.4em, top-aligned.
  - Always LTR.
- **Progress bar:** 2px high, bottom edge, full width, terracotta, `scaleX 0 → 1` from the inline start.
- **Intro timeline:**
  - The video layer fades in over 0.7s.
  - The logo fades up 12px over 0.8s, starting at 0.3s.
  - The wordmark fades in while its letter-spacing goes from .6em to .32em, over 0.9s, starting at 0.6s.
- **Progress is real but smooth:**
  - The counter and bar ease (easeInOutCubic) toward 90 over 2.6s.
  - They finish to 100 once the hero video has `canplaythrough` and `document.fonts.ready` has resolved.
  - Minimum total time is 2.8s. Hard cap is 6s: if loading takes longer, finish anyway.
- **At 100:**
  - The counter and bar fade out over 0.3s.
  - The wordmark fades out over 0.35s.
  - The logo stays only for `silk` and fades out for `push`.
  - Then the hand-off starts (call this moment T).
- Start the hero video (`currentTime = 0`, `play()`) 250ms before T.

## Hand-off A — `push` (camera pushes into the fabric)
- **Loader video:** `scale 1 → 1.9`, `filter: blur(0) → blur(14px)`, `brightness(1) → .55`. Duration 1.7s, starting at T, ease `cubic-bezier(.55,0,.35,1)`.
- **Overlay:** fades out over 0.9s, starting at T.
- **Whole loader:** opacity 1 → 0 over 1.1s, starting at T + 0.7s, ease `cubic-bezier(.4,0,.2,1)`. Remove it from the DOM after that.
- **Hero video wrapper:**
  - It starts at `scale(1.45) blur(16px) brightness(.6)`. Hold that state from the moment the loader appears.
  - It animates to normal over 2.2s, starting at T + 0.5s, ease `cubic-bezier(.16,.7,.2,1)`.
- **Hero text:** `playHeroIntro()` starts at T + 1.5s.

## Hand-off B — `silk` (default: the logo flies into the header while the fabric slides away)
- **Logo flight (FLIP):**
  - Measure the loader logo's rect and the header logo's rect.
  - Animate a clone from the first rect to the second (translate + scale) over 1.3s, starting at T − 0.15s, ease `cubic-bezier(.65,0,.2,1)`.
  - The real header logo stays at `opacity 0` until the flight lands, then swaps in with no visible jump.
- **Header nav:**
  - Hidden while the loader shows.
  - Fades in over 0.7s, starting at T + 0.3s.
- **Soft wipe on the loader:**
  - Animate a CSS mask with rAF:
    `mask-image: linear-gradient(100deg, transparent X−18%, #000 X+18%)`
  - X runs from −25 to 125 over 1.8s, easeInOutCubic, starting at T.
  - At the same time the loader video drifts `translateX 0 → 8%` and `scale 1 → 1.08`.
  - Add the `-webkit-mask-image` prefix too.
- **RTL:** mirror the wipe (it goes right to left, using `260deg` with the same stops) and mirror the drift (`translateX 0 → -8%`).
- **Hero video wrapper:**
  - It starts at `translateX(-6%) scale(1.12) blur(10px)`. Use +6% in RTL.
  - It animates to normal over 2.2s, starting at T, ease `cubic-bezier(.22,.7,.2,1)`.
- **Hero text:** `playHeroIntro()` starts at T + 1.2s.

## Quality bar
- No flash of the hero, header, or footer before the loader paints. Render the loader in the first paint: put the critical CSS inline in `index.html` or use a pre-hydration class.
- No layout shift when the loader is removed.
- 60fps: animate only transform, opacity, filter and mask. Use `will-change` only during the animation.
- If the drape video fails, the poster still shows and the sequence still completes.
- Mobile:
  - Same sequence.
  - The video uses `preload="auto"`. Neither video is big (about 2MB each).
  - The header logo is smaller there, so the FLIP target must be measured at runtime.
  - Check iOS Safari behaviour for `mask-image`. If it isn't supported, fall back to `push`.

## Report when done
- Both styles in EN and AR at 1440px and 390px (a description, or frame captures at T−0.5s, T+0.5s, T+1.2s and T+2.5s).
- Total time to interactive feel on a cold load.
- Anything you couldn't match.

Then wait for "go" (next and last: polish + performance + final QA).
