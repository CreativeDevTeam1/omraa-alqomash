# Phase 2 — Review fixes + Hero (paste this into Claude Code)

Phase 1 approved. Thank you — good report. Do part A, then part B, then STOP and report.

## A. Fixes from your Phase 1 report
1. **Arabic text check.** I added `_source/content/verified-copy.md` (EN + AR copy as approved in the design). Diff it against `en.ts` / `ar.ts`. Where they differ, use the verified file, and list every change you made.
2. **Interface strings** (menu open/close, skip link, 404, language labels): your placeholders are approved. Keep language labels exactly "English" and "العربية". Keep them in the content files, not hard-coded.
3. **Footer logo:** remove the CSS filter. The footer sits on ivory, so use the original logo with its terracotta emblem.
4. **"Based In" (Arabic):** the heading is "مقرنا" and the value is "مدينة بدر، مصر".
5. **Footer links without sections:** your mapping is fine (Custom Manufacturing → Contact, Quality → About#quality, Export Markets → About). Keep them as TODO in the README for the client.
6. **exhibition-booth.jpg (480×640):** use it no larger than ~480px wide on screen. Add a TODO in the README asking the client for a higher-resolution photo.
7. Don't touch anything else from Phase 1.

## B. Hero (Home)
Section height: 860px desktop, 640px mobile. The Header sits ABOVE the hero on the ivory background. It is not transparent and does not overlay the video.

**Background**
- `hero-fabric.mp4` with `hero-fabric-poster.jpg` as the poster.
- `autoplay muted loop playsinline`, `object-fit: cover`, behind everything, on `#141110`.
- `preload="auto"` on desktop and `preload="metadata"` on mobile.
- Pause the video when the hero leaves the viewport (IntersectionObserver), and play it again when it comes back.

**Shade over the video** (one element):
```
radial-gradient(ellipse 60% 45% at 50% 58%, rgba(15,10,8,.55), rgba(15,10,8,0) 100%),
linear-gradient(0deg, rgba(20,14,11,.6) 0%, rgba(20,14,11,0) 40%)
```

**Text** — centred block, vertical centre at about 58% of the hero, colour ivory `#EAE6DF`, `text-shadow: 0 2px 40px rgba(0,0,0,.4)`.
- **EN title:** "OMRAA AL QOMASH" — Cormorant Garamond 300, `clamp(40px, 7.4vw, 112px)`, `letter-spacing: .05em`, `line-height: 1`, `white-space: nowrap` on desktop (allowed to wrap below 720px).
- **AR title:** "أمراء القماش" — `--font-ar` 700, `clamp(48px, 8.9vw, 128px)`, `letter-spacing: 0`, `line-height: 1.3`.
- **Rule:** 72px × 1px, `rgba(234,230,223,.6)`, 26px margin above and below.
- **EN line:** "Egyptian Upholstery & Furnishing Fabric Manufacturer" — `clamp(16px, 1.7vw, 24px)`, `letter-spacing: .04em`, opacity .85.
- **AR line:** "جودة تنسج المستقبل" — `--font-ar` 400, `clamp(20px, 2.1vw, 30px)`.
- Use a real `<h1>` (EN: put `aria-label` on the h1 when it is split into letters).

**Animation** (GSAP; plays once the page is ready. Later the loading screen will trigger it, so expose a `playHeroIntro()` and make it callable):
1. **Title:**
   - EN reveals letter by letter. Each letter goes from `opacity 0, blur(10px), y .25em` to normal over 1.1s, with a 0.05s stagger, starting at 0.5s, ease `cubic-bezier(.2,.7,.2,1)`.
   - AR reveals word by word instead. Don't split Arabic letters: it breaks the joins.
2. **Rule:** `scaleX 0 → 1`, 1s, starting at 1.5s, ease `cubic-bezier(.6,0,.2,1)`.
3. **Line:** fades up 10px over 1s, starting at 1.8s.
4. **Video wrapper:** `scale 1.08 → 1` over 2.2s while the text appears.
5. **Reduced motion:** with `prefers-reduced-motion`, show the final state with no animation, and show the poster image instead of autoplaying the video.

**Accessibility & performance**
- Give the video `aria-hidden="true"`.
- The text must keep 4.5:1 contrast over the shade. Check the brightest frame.
- No layout shift: reserve the hero height.
- Load only the hero video on Home. Do not import `drape-closeup` here.

## Report when done
- Before/after for part A (the list of text changes).
- Screenshots or a description of EN and AR hero at desktop width and 390px.
- Anything you couldn't match exactly.
Then wait for "go" (next: Products gallery).
