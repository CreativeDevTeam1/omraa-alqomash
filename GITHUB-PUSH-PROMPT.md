# Push the whole project to GitHub and connect Vercel to it (paste this into Claude Code)

**Goal:** the full project in a GitHub repository, so it's backed up and versioned, and Vercel deploys automatically on every push.

**Repo:**
- GitHub account `tasbeehmamdouh`
- Name `omraa-alqomash`
- Visibility **private**: it's client work. Make it public only if the designer says so.

**Never type passwords or tokens yourself.** The designer logs in.

## 1. Prepare the repository
1. If the folder isn't a git repo yet: `git init -b main`.
2. **Write a solid `.gitignore`:**
   - `node_modules/`, `dist/`, `.vercel/`, `.env`, `.env.*` (keep `.env.example`), `studio/node_modules/`, `studio/dist/`, `.sanity/`
   - OS junk: `Thumbs.db`, `.DS_Store`, `desktop.ini`
   - logs, `*.local`, temp screenshots and Lighthouse reports
3. **Secret scan before the first commit:** grep the whole tree for tokens and keys. Look for:
   - `sk-`, `SANITY_*TOKEN=` with a value, `VERCEL_TOKEN`, `ghp_`, `-----BEGIN`, and `password`
   - anything in `.vercel/`
   If anything is found, STOP and report it. Do NOT commit it.
4. **Large files:** list every file over 50 MB. GitHub rejects files over 100 MB.
   - If any exist (for example video masters), move them under Git LFS (`git lfs track`), or exclude them and list them in the README as "kept locally".
   - The `_source/videos/*` files are about 1–12 MB and are fine to commit normally.
5. **Keep in the repo:**
   - `src/`, `public/`, `scripts/`, `studio/` (the Sanity Studio source), `_source/` (brand guide, content PDF, verified copy, logos, fonts, photos and videos)
   - all the `PHASE-*` / `FIX-*` / `CMS-*` prompt files, the `README`, `CLAUDE.md` and `CMS-GUIDE-AR.md`
   - `vercel.json`, `_headers`, `_redirects`
6. **Fonts:** commit the Anaqa files only because the designer chose to proceed with them. Keep the licence note at the top of the README.
7. **README:** update it with:
   - what the project is
   - the stack (Vite + React + TS, GSAP, Lenis, Sanity)
   - how to run (`npm install`, `npm run dev`, `npm run build`)
   - how to run the Studio
   - the env variables (`.env.example`)
   - deployment (Vercel), the CMS (Studio URL, project ID `f4el6clm`, dataset `production`)
   - a "Client TODO" list
8. **Commit:** run lint and build first. Then make a clean first commit, `Initial commit: Omraa Al Qomash website + Sanity studio`, with the session attribution lines if your environment adds them.

## 2. Create the GitHub repo and push
1. Check `gh --version`. If GitHub CLI is missing, install it with `winget install --id GitHub.cli`, or ask the designer to.
2. Run `gh auth login`. The DESIGNER completes it in the browser with her GitHub account. Wait for her.
3. Run `gh repo create tasbeehmamdouh/omraa-alqomash --private --source . --remote origin --push`.
4. Confirm the push: `git log --oneline -1`, `gh repo view --web` (opens it for her), and the file count on GitHub.

## 3. Connect Vercel to the repo (automatic deploys)
1. Link the existing Vercel project `omraa-alqomash` to the GitHub repo.
   - Use `npx vercel git connect` if available.
   - Otherwise give the designer the exact clicks: Vercel → Project `omraa-alqomash` → Settings → Git → Connect Git Repository → GitHub → `omraa-alqomash`. She may need to install the Vercel GitHub app on her account; tell her when.
2. **Settings:** production branch `main`, framework Vite, build `npm run build`, output `dist`. The root directory is the repo root, not `studio/`.
3. **Env vars:** if the build needs any (for example Sanity project ID or dataset), add them in Vercel → Settings → Environment Variables. They are public read values only, never a write token.
4. **Test:**
   - Make a harmless commit (for example a README typo fix) and push it.
   - Confirm Vercel starts a production deployment from the push.
   - Confirm https://omraa-alqomash.vercel.app updates and still works: EN/AR, loader, CMS live refresh.

## 4. Report
- the repo URL
- the commit hash
- the files excluded and why
- the secret-scan result
- whether Vercel auto-deploy is connected
- anything the designer must click herself
