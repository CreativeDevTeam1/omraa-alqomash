# Fix 20: smooth loops with no stutter, for both videos (paste this into Claude Code)

**Replaces Fix 19.** If you already ran Fix 19, this supersedes it.

**Client feedback:** the ping-pong loops "stutter". There were two causes:
1. **Low frame rate:** the client's files are about 24 fps, and they were compressed by the messenger app.
2. **A hard reverse at each turn:** the motion flipped direction instantly, at full speed.

**New masters (already rendered),** in `_source/videos/client-v2/`:

| File | Use |
|---|---|
| `hero-fabric-smooth-loop.mp4` | the hero video |
| `loading-smooth-loop.mp4` | the loader drape video |

**How they were made:**
- Frame-rate interpolated, motion-compensated, from the client's originals.
- Ping-pong loop with an **eased turnaround**: the motion slows to a stop and gently reverses at both ends, so there is no jerk.
- The last frame equals the first, so the loop seam diff is 0.
- **60 fps**, 848×464 (the client's resolution), about 17.3 s, no audio, CRF 16.

**The posters are unchanged:** `hero-fabric-poster.jpg` and `loading-pingpong-poster.jpg`. The first frame is identical.

## Steps
1. **Re-encode:** in `scripts/encode-videos.mjs`, set these two files as the masters.
   - **Keep 60 fps.** Do NOT drop frames or force 30 fps.
   - Native size only, MP4 H.264 + WebM VP9.
   - High quality, with no visible extra loss.
   - Fix 16 hashed names and the manifest.
   - Report the file sizes. Above 6 MB per file is acceptable for these.
2. **Browser loop hitch:**
   - Keep `loop muted playsinline autoplay`.
   - Make sure nothing else (JS `timeupdate` handlers, a restart) seeks the hero video during normal playback. Only the loader hand-off sets `currentTime = 0` once.
   - Watch 3 full loops in Chrome and Safari/WebKit at 1440 and 375px, and confirm there is no visible hitch at the loop point.
3. **Sanity:**
   - Upload both files and replace `heroVideo.file` and `loaderVideo.file` on the Home page document (posters unchanged).
   - Update the "seeded asset → local file" mapping to the new asset IDs.
   - Delete unused old file assets, only those with no references; check first.
4. **Ship it:** lint and build, then deploy with `npx vercel --prod`.
5. **Verify live with a normal reload:**
   - New hashed URLs.
   - Both videos smooth, with no stutter and no jump at the turns or at the loop point.
   - Desktop and phone.

Report briefly.
