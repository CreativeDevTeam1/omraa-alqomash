# Fix 20B: use the client's own loop videos as delivered (paste this into Claude Code)

**Use this INSTEAD of Fix 20,** at the designer's choice. The client sent his own looped versions, and they must be used exactly as delivered.

The files are in `_source/videos/client-v3/` (video stream copied untouched, audio removed):

| File | Use |
|---|---|
| `hero-client-loop.mp4` | the hero video |
| `loading-client-loop.mp4` | the loader drape video |

They are 848×464, about 15.9 s, about 24 fps.

**Posters:** reuse `_source/videos/client-v2/hero-fabric-poster.jpg` and `loading-pingpong-poster.jpg` (same first frames).

## Steps
1. **Re-encode:** in `scripts/encode-videos.mjs`, set these two files as the masters.
   - Keep the native size and frame rate.
   - High quality, no upscaling.
   - Fix 16 hashed names and the manifest.
2. **Playback:**
   - Keep `loop muted playsinline autoplay`.
   - Nothing should seek the hero during normal playback. Only the loader hand-off sets `currentTime = 0` once.
3. **Sanity:**
   - Upload both files and replace `heroVideo.file` and `loaderVideo.file` on the Home page document (posters unchanged).
   - Update the "seeded asset → local file" mapping.
   - Delete unused old file assets, only those with no references.
4. **Ship it:** lint and build, then deploy with `npx vercel --prod`.
5. **Verify live with a normal reload:**
   - New hashed URLs.
   - Both videos play and loop.
   - Desktop and phone.

Report briefly.
