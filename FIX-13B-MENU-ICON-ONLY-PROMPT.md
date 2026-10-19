# Fix 13b: mobile menu button, icon only (paste this into Claude Code)

**Still wrong in the current build:** the mobile header button shows the visible text "Menu" next to the burger icon. In AR it shows «القائمة», and when the menu is open it shows "Close" / «إغلاق».

**Fix:**
- Remove the visible words, so the button shows ONLY the burger icon (☰) when closed and ONLY the X icon when open.
- Move the same words into `aria-label`, switching with the state.
  - Right now the button has no `aria-label` at all; add it.
  - Keep `aria-expanded`.
  - Don't delete the strings from `en.ts` / `ar.ts`.
- Keep the tap target ≥ 44×44px. The icon's size, colour and inline-end position stay as they are.
- EN and AR.

## Check
- 375px and 360px in EN and AR: closed shows only ☰, open shows only X, and no text is visible in either state.
- Lint and build pass.

Then restart `npm run preview`.
