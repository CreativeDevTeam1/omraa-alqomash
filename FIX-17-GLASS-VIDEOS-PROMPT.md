# Fix 17: new hero and loader videos with a frosted-glass background (paste this into Claude Code)

The designer approved new masters for BOTH videos.
- The black background is removed from the fabric.
- Behind the fabric there is now a **frosted brown glass**: a heavily blurred, moving copy of the fabric itself, tinted Espresso #361F17 at 45%.
- The sharp fabric sits on top.
- Everything is baked into a normal MP4, so it works in every browser, Safari/iOS included, with no alpha needed.

**New masters** (1920×1080, 30fps, 8s, no audio), in `_source/videos/glass/`:
- `hero-fabric-glass.mp4` + `hero-fabric-glass-poster.jpg`
- `drape-closeup-glass.mp4` + `drape-closeup-glass-poster.jpg`

## Steps
1. **Re-encode:** in `scripts/encode-videos.mjs`, switch the masters from `_source/videos/espresso/` to `_source/videos/glass/`, then re-encode every variant:
   - 1080p + 720p
   - MP4 H.264 + WebM VP9
   - WebP posters at full size and 800px
2. **Same size budget as Phase 8:** hero ≤ 3 MB and drape ≤ 2 MB at 1080p. The blurred background compresses well, so keep quality high (no visible banding in the blur). Report the CRF you used.
3. **Cache:** use the Fix 16 content-hash naming and the manifest, so returning visitors get the new files immediately. If Fix 16 isn't done yet, do it now as part of this fix.
4. **Hero styling:**
   - Keep the hero section background `#361F17` (it matches the tint edges).
   - The background is now lighter and more textured than flat espresso, so **re-tune the text shade:**
     - Keep the title and tagline at WCAG AA over the brightest frames.
     - Use the lightest shade that passes, so the glass effect stays visible. The designer wants the blurred fabric to read clearly behind.
   - Report the shade values and the measured contrast at 1440 and 375px.
5. **Mobile crop:** re-check the mobile `object-position` (Fix 13) with the new video, and pick the value that shows the most sharp fabric at 375px.
6. **Loader:** the drape layer (Fix 14/15) now uses `drape-closeup-glass`. Check that the hand-off to the hero still matches visually, since both now share the same frosted look.
7. **Ship it:** lint, build, then deploy with `npx vercel --prod`.
8. **Verify on the live site** as a returning visitor (normal reload):
   - `currentSrc` is the new hashed URL
   - a frame shows the glass background, not black and not flat brown
   - desktop 1440 and phone 375, EN and AR
   - the loader → hero hand-off is smooth

Report briefly, with screenshots of the hero and a loader frame.
