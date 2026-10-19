# CMS Phase 1: Sanity CMS for the client (paste this into Claude Code)

## Goal
The CLIENT, who is non-technical, must be able to edit, in Arabic and English, from a simple web dashboard:
- **Products:** add, remove and reorder them; each has a name, description and image.
- **Contact details:** phone, WhatsApp, email, address, Instagram, Facebook.
- **All site texts:** Home, About, Contact, footer and buttons.
- **Images and videos:** section images, the hero video and the loader video, plus posters.

Changes go live on https://omraa-alqomash.vercel.app **within seconds, without a redeploy**.

**Hard rules:**
- **No visual or motion change to the site.**
- **The site must never break if Sanity is down.**
- **Seeded content must match the current site 100%, word for word.**

## Chosen stack: Sanity (free plan)
- The free plan includes 20 users, studio hosting and 100 GB of assets.
- The Studio is hosted at `https://omraa-alqomash.sanity.studio`, and the client logs in there with email.

## 1. Project and Studio
1. **Create the project.** In a new folder `studio/` inside this repo, run `npm create sanity@latest`.
   - Project name: "Omraa Al Qomash".
   - Dataset: `production`, public.
   - Template: clean, TypeScript.
   - The DESIGNER must log in herself when the CLI opens the browser. **Never type passwords or tokens yourself.**
2. **Studio UI:**
   - Show the logo in the Studio navbar.
   - Every field label is bilingual, e.g. "Product name / اسم المنتج".
   - Every field has a short helper description written for a non-technical person, in English and Arabic.
3. **Bilingual fields:** every text is an object `{ en, ar }` with both required.
   - Show them side by side.
   - The Arabic input is `dir="rtl"`, styled with a custom input component.
4. **Desk structure:** a clean sidebar with Arabic and English labels:
   - **Site settings** (singleton): contact channels, social URLs, footer texts, copyright.
   - **Home page** (singleton):
     - Hero: title, tagline, hero video file + poster.
     - Loader: drape video + poster.
     - Products section: label, intro line, background statement, note, the 3 button labels.
     - "What We Manufacture" section: label, statement, intro.
   - **Products** (a list, drag-to-reorder with the orderable-document-list plugin):
     - name, description, image with hotspot/crop, alt text auto-filled from the name, and a "visible" toggle.
   - **Applications / ماذا نصنع** (orderable list of 6): title, description, image.
   - **About page** (singleton): every text block from Fix 12 (intro, the 4 strip items, the 3 story paragraphs, the partnership text + quote, ISO, Vision, Mission) plus the 3 images.
   - **Contact page** (singleton): every text and label, plus the image.
   - **Interface labels** (singleton): menu, close, skip link, page not found, pause, play, Home/About/Contact nav labels, language switch.
5. **Validation and guidance:**
   - Required fields.
   - Character-length warnings so the client can't break the layout. Base them on the current longest text +30%.
   - **Images:** at least 1600px wide, and a warning when the image is lower resolution.
   - **Videos:** MP4 only, ≤ 8 MB, with a help text explaining the recommended export (1080p, H.264, no audio, ≤ 10 s) and a required poster.
6. **Roles:**
   - The designer is Administrator.
   - Write exact steps in the guide for inviting the client as **Editor** (Manage → Members). The designer does this herself.
7. **Deploy the Studio:** run `npx sanity deploy` with hostname `omraa-alqomash`.
8. **CORS:** add `https://omraa-alqomash.vercel.app` and `http://localhost:5173` / `4173` as CORS origins (no credentials).

## 2. Seed the CURRENT content (verbatim)
1. Write `studio/scripts/seed.ts`. It imports EVERYTHING from the current site: `en.ts` / `ar.ts`, `channels.ts`, the product and application images, the About and Contact images, and the current hero and loader videos and posters (the Fix 17 glass versions).
2. Upload the assets via the Sanity client. Use the original high-res sources from `_source/`, not the resized web variants.
3. **Verify automatically:**
   - Fetch every document back.
   - Diff every string against `en.ts` / `ar.ts`. The result must be **0 differences**.
   - Print the result.

## 3. Front-end integration (hybrid: fast, safe and live)
1. **Build-time snapshot:** a script fetches all published content from Sanity during `npm run build` into `src/content/snapshot.json`. The site renders from it, so first paint, SEO and the loader stay exactly as now.
   - If Sanity is unreachable at build time, fall back to the last committed snapshot. **The build must never fail.**
2. **Live refresh at runtime:**
   - After the page is interactive, fetch the same GROQ query from the Sanity **CDN API** (`useCdn: true`), with a 4 s timeout.
   - If the content differs from the snapshot, update the React state.
   - If it fails, silently keep the snapshot.
   - This makes client edits appear on the next page visit with no redeploy.
   - Make sure a late text update doesn't re-trigger the hero intro or the loader, and doesn't cause visible layout jumps. Swap the text with no animation.
3. **Images:** render them through the Sanity image CDN with `@sanity/image-url`.
   - `auto('format')`, widths 480/800/1200/1800, proper `sizes`, the hotspot respected.
   - Keep `width`/`height` and aspect ratio, so CLS stays 0.
4. **Videos:** use the Sanity file URL for the hero and loader videos and posters.
   - Keep the current behaviour: preload of the poster, the loader waiting for `canplaythrough`, and the 6 s cap.
   - Keep the local optimized files as the fallback when the CMS video is the seeded original. Pick the local hashed variant when the asset ID matches the seeded one, and the CMS URL after the client replaces it.
5. **Products:** the carousel (Fix 15) reads the ordered, visible products.
   - It must work with any count from 3 to 30.
   - Recompute the loop width when the count changes.
6. **Language switch:** content lookups stay instant from in-memory data, with no refetch on switching.
7. **Dependencies:** add only `@sanity/client` and `@sanity/image-url` to the front-end bundle. Report the gzip size added. The target is ≤ 15 KB.

## 4. Security
- Public dataset, read-only, no token in the front-end.
- Any token needed for seeding comes from an environment variable that the designer pastes in her own terminal. Never commit it. Add it to `.gitignore` and `.env.example`.

## 5. Client guide
Write `CMS-GUIDE-AR.md`, in simple Egyptian-friendly Arabic, with an English summary at the end. It covers:
- how to log in
- how to edit a product
- how to add a new product (image size tips)
- how to change the phone or email
- how to replace the hero video (export settings)
- how to publish
- how long until it appears
- "what not to do"

Include placeholders for screenshots: describe exactly which screen each one shows.

## 6. Check and report
- **The Studio:** test it end to end as an Editor.
  - Change a product name in Arabic, publish, and confirm the live site shows it on the next reload without a redeploy.
  - Revert the change.
- **Kill-switch test:** block the Sanity domain in DevTools. The site must still render fully from the snapshot.
- **Lighthouse:** run it on Home/About/Contact, EN and AR. There must be no regression of more than 2 points versus before.
- Lint and build pass.
- Deploy to production with `npx vercel --prod`.

**Report:**
- the Studio URL
- what the designer must click herself (login, inviting the client)
- the seed diff result
- the bundle size added
