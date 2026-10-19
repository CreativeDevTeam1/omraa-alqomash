# Fix 19: ping-pong loop on the hero video too (paste this into Claude Code)

The client wants the hero video to loop the same way as the loader video: play forward, then backwards, so the end flows into the start with no visible jump.

**New file:** `_source/videos/client-v2/hero-fabric-pingpong.mp4`
- 848×464, about 15.7 s (378 frames), no audio.
- Made from the client's `hero-fabric.mp4`: forward, then reversed, without repeating the end frames.
- Near-lossless (CRF 16), same resolution.
- The poster stays `hero-fabric-poster.jpg`, since the first frame is identical.

## Steps
1. **Re-encode:** in `scripts/encode-videos.mjs`, make the hero master `hero-fabric-pingpong.mp4` instead of `hero-fabric.mp4`.
   - Re-encode at native size only, MP4 + WebM.
   - Use high quality: no extra visible loss, and no upscaling.
   - Use the Fix 16 hashed names and the manifest.
2. **Hero `<video>`:** it keeps `loop muted playsinline autoplay`. Confirm there is no visible jump at the loop point: watch at least 3 loops at 1440 and 375px.
3. **Loader hand-off:** the hero video still starts at `currentTime = 0` just before the hand-off, as now.
4. **Sanity:** upload `hero-fabric-pingpong.mp4` and replace the Home page `heroVideo.file` asset, keeping the same poster.
   - Update the "seeded asset → local file" mapping to the new asset ID, so the site keeps serving the local hashed file.
   - Delete the two UNUSED old file assets in Sanity (`hero-fabric-1080.8da17e5f.mp4` and `drape-closeup-1080.33e2db9e.mp4`) and the replaced `hero-fabric.1fcaa381.mp4`. Only delete them if nothing references them; check first.
5. **Ship it:** lint and build, then deploy with `npx vercel --prod`.
6. **Verify live with a normal reload:**
   - The hashed URL is new.
   - The hero loops smoothly, with no jump.
   - Desktop and phone.

Report briefly.
