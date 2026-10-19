# Fix 16: the client still sees the OLD black video (cache bug) (paste this into Claude Code)

## Diagnosis (verified on the live site)
- Every hero video variant served at https://omraa-alqomash.vercel.app/media/ IS the new espresso version: the frame corner pixel is rgb(57,33,22).
- BUT the files kept their OLD names (`hero-fabric-1080.mp4`, etc.) and `/media/*` is served with `Cache-Control: public, max-age=2592000` (30 days).
- So any browser that opened the site before Fix 14 keeps showing the cached BLACK video and poster, for up to 30 days. That is what the client sees.

## Fix
1. **Content-hash every file in `/media`:** videos, posters, OG image, and any other non-Vite asset with a long cache. For example `hero-fabric-1080.3f9a2c1d.mp4`, using the first 8 hex chars of the file's SHA-256.
   - Do it inside `scripts/encode-videos.mjs` (and the poster step), so it happens automatically on every re-encode.
   - Generate a small manifest, `src/media-manifest.json`, and import the URLs from it everywhere: the hero `<source>`s, the poster, the loader drape video, the preloads in `index.html`, and `og:image`. **No hardcoded media file names anywhere.**
   - Delete the old un-hashed copies from `public/media` so they don't ship.
2. **Cache headers in `vercel.json` / `public/_headers`:**
   - Hashed `/media/*` and `/assets/*` → `public, max-age=31536000, immutable`.
   - `index.html` and the routes → `no-cache`, so a new deploy is picked up immediately.
   - Confirm the response headers on the live site after deploy.
3. Also check the **loader drape video and its poster**, and the **OG image**: same treatment.
4. Rebuild, run lint/build, and deploy to production.
5. **Verify like a returning visitor:**
   1. Open the live site once with the OLD build cached; if that isn't possible, simulate it by requesting the old URL.
   2. Load the new build with a normal reload, not a hard reload.
   3. The `<video>` `currentSrc` must be the new hashed URL, and a sampled frame corner must be espresso, not black.
   4. Do it on desktop and at 375px.

Report the new headers and the hashed URLs.
