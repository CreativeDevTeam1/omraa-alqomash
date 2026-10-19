# Fix 18: use the client's new videos exactly as delivered (paste this into Claude Code)

The client sent new versions of both videos, with a light grey studio background baked in. The designer wants them used **exactly as delivered, at the same quality: no effects, no glass, no recolouring, no upscaling.** The only change requested is the ping-pong loop on the loading video, and that is already done.

The files are in `_source/videos/client-v2/`:

| File | Use | What was done to it |
|---|---|---|
| `hero-fabric.mp4` | the hero video | untouched: original video stream copied as is, audio removed |
| `hero-fabric-poster.jpg` | the hero poster | first frame |
| `loading-pingpong.mp4` | the loader's drape video | the client's loading video played forward then reversed (ping-pong, about 15.7s). The last frame flows into the first, so `loop` is seamless. Near-lossless re-encode (CRF 16) at the same resolution. |
| `loading-pingpong-poster.jpg` | the loader poster | first frame |

The resolution is **848×464**, as delivered.

## Steps
1. **Replace the masters.** Point `scripts/encode-videos.mjs` at these two files, replacing `_source/videos/glass/`.
   - Do NOT generate any variant larger than the source: no 1080p and no 720p. Output the native 848×464 only, as MP4 H.264 + WebM VP9.
   - Use a high quality setting so there is no visible extra loss versus the source. The files are small anyway.
   - Make WebP posters from the provided posters.
   - Keep the Fix 16 content-hash names and the manifest.
2. **Remove the glass/espresso video treatment from the code paths**, but keep the old files in `_source/`. No overlays on the video other than what step 4 requires for readability.
3. **Hero background colour:** set the hero section background to match the video's own backdrop, so the edges never show a different colour. Sample it from the poster edges and use the closest brand-safe value; report it. Same for the loader's video layer.
4. **Hero text readability (required, minimal):** the video is now LIGHT, so ivory text no longer reads.
   - Switch the hero title and tagline, and the rule line, to **Espresso #361F17**.
   - Remove the dark shade.
   - If any frame still fails WCAG AA behind the text, add only a very soft ivory radial glow behind the text block, never a box.
   - Check EN and AR at 1440 and 375px, and report the contrast numbers.
   - **The header stays as is.**
5. **Loader:**
   - The drape layer uses `loading-pingpong.mp4` with `loop`.
   - The Fix 15 sequence stays the same: thread → open onto the video → dissolve into the hero + logo flight.
   - Both videos are now light, so check the dissolve still reads smoothly.
6. **Mobile:** recheck `object-position` at 375px, so the fabric is visible in the hero.
7. **Ship it:** lint and build, then deploy with `npx vercel --prod`.
8. **Verify live** as a returning visitor (normal reload):
   - The new hashed URLs are used.
   - The hero shows the new light video.
   - The loader video loops with no jump.
   - Desktop and phone, EN and AR.

Report briefly with screenshots.
