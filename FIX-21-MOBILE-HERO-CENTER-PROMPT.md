# Fix 21: centre the hero video on phones (paste this into Claude Code)

**Designer feedback, with an iPhone screenshot:** on mobile the fabric sits too low. There is a large empty light area above it, and the fabric doesn't sit around the title.

**Measured in the current hero video** (848×464), over the whole loop:
- The fabric's vertical centre is at **≈56%** of the frame height. It spans about 16%→91%.
- The horizontal centre is at **≈48%**.

## Fix (below 768px only; desktop unchanged)
1. **Remove the old Fix 13 crop:** `object-position: 50% 70%` and scale 1.45 were tuned for the OLD video.
2. **Centre the fabric:**
   - Set the hero video to `object-position: 48% 56%`.
   - If you keep a zoom, set `transform-origin: 48% 56%` too.
   - Start from `scale(1.2)`.
   - Goal: the fabric's visual centre lands at the **vertical centre of the hero**, right behind "OMRAA AL QOMASH" / «أمراء القماش», with fabric visible above AND below the title, and no big empty band at the top.
3. **Tune the scale between 1.1 and 1.35:**
   - The fabric should fill most of the phone width.
   - Neither fabric piece should be cut awkwardly at the screen edges for long.
   - Check several moments of the loop (0, 25, 50 and 75%).
4. **Text block:** make sure the hero title block itself is vertically centred in the hero on mobile, so text and fabric centre together.
5. **Poster:** apply the same values to the poster.
6. **Check sizes:**
   - 390×844 (iPhone 14/15)
   - 375×812
   - 360×780
   - 430×932 (Pro Max)
   - EN and AR
   - Screenshots at 2 moments of the loop for each.
7. **Ship it:** lint and build, then deploy with `npx vercel --prod`. Verify on the live site at phone width.

Report the final values with before/after screenshots.
