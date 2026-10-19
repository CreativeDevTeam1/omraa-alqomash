# Deploy to Vercel with a clean name (paste this into Claude Code)

**Goal:** a clean public address. The preferred one is **https://omraa-alqomash.vercel.app**.
- If that name is taken, use the first free one in this order: `omraaalqomash`, `omraa-textiles`, `omraa-alqomash-eg`.
- The designer must NOT end up sharing a long auto-generated URL like `omraa-website-git-main-xyz123.vercel.app`.

## Steps
1. **Production build:**
   - Run `npm run lint` and `npm run build`. They must pass.
   - Confirm `vercel.json` has the SPA fallback (every route → `/index.html`) and the cache headers from Phase 8.
2. **Vercel CLI:** use `npx vercel@latest`. Don't install it globally unless needed.
3. **Login:** run `npx vercel login`.
   - It opens the browser so the DESIGNER can sign in herself, with GitHub or email.
   - **Never type a password or token yourself.** Wait for her to finish.
4. **Create and link the project** with the clean name:
   - `npx vercel link --yes --project omraa-alqomash`, or the first free name from the list above.
   - Framework: Vite. Build command: `npm run build`. Output directory: `dist`.
5. **Deploy to production:** `npx vercel --prod`.
6. **Clean production address:**
   - Make sure it is exactly `https://<project-name>.vercel.app`.
   - If Vercel only gave a hashed URL, add the alias: `npx vercel alias set <deployment-url> <project-name>.vercel.app`.
7. **Public access:** check that the production URL opens in a private/incognito window with no Vercel login wall.
   - If "Vercel Authentication" / Deployment Protection is on for production, tell the designer exactly where to switch it off: Project → Settings → Deployment Protection.
   - Don't change account security settings yourself.
8. **Now that the domain is known:**
   - Set the absolute `og:image` URL, plus `<link rel="canonical">` and `og:url`, per page and per language, to `https://<project-name>.vercel.app/...`.
   - Add `hreflang` alternates between `/en/...` and `/ar/...`.
   - Rebuild and redeploy with `--prod`.
9. **Live smoke test:**
   - `/`, `/en`, `/ar`, `/en/about`, `/ar/about`, `/en/contact`, `/ar/contact`, and one 404 path. Deep links must load directly, with no 404 on refresh.
   - Fonts and videos load.
   - The loader shows once.
   - The language switch works.
   - Phone screenshot at 390px.
   - Lighthouse mobile on `/en` and `/ar`, against the live URL.

## Report
- The final public URL.
- The project name used, and which names were taken.
- Lighthouse scores on the live site.
- Anything the designer must click herself, with exact steps.
