# Fix 5: hero tagline contrast on mobile only (paste this into Claude Code)

Fix 4b approved.

**Problem:** on mobile (< 768px) the hero tagline is about 16px, and over the brightest video frames it drops to about 3.4:1. It must pass AA (4.5:1).

**Fix (mobile only; desktop stays exactly as it is now):**
- Below 768px, strengthen the existing espresso shade only in the band behind the hero text block.
  - Use the same espresso colour with a little more opacity in the existing radial or linear gradient, centred on the text.
  - No box, no blur panel, no new colour.
- Alternatively, raise the tagline to ≥ 18.66px bold or 24px regular on mobile if that fits the current design better. Pick whichever changes the look less, and say which you chose.
- Re-measure on the brightest frames at 390px and 360px, in EN and AR. Target ≥ 4.5:1 at the 99th percentile.

Then:
- Re-run Lighthouse once on Home AR and Home EN with nothing else running, to confirm whether the earlier perf drop was machine noise.
- Lint and build pass.
- Report briefly and restart `npm run preview`.
