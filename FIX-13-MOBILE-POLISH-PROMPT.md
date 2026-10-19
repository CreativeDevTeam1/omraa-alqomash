# Fix 13: mobile polish found in review (paste this into Claude Code)

**Already fine, don't change:**
- At 360, 375 and 768px there is no horizontal scroll on any page (EN/AR).
- The mobile menu, the Contact layout and the AR hero with Anaqa all look right.

Fix only these:

## 1. Hero video crop on phones
**Problem:** at 375×812 the landscape hero video (1280×720) is cropped to portrait with `object-position: center`, so the top ~40% of the hero shows only the dark empty part of the frame.

**Fix (below 768px only):**
- Set `object-position` so the fabric fills the frame. Try `center 70%` and up, and inspect several frames of the video to pick the value that keeps fabric visible through the whole loop.
- Apply the same value to the poster.
- **Desktop is unchanged.**
- Report the value you chose, with before/after screenshots at 375 and 360px, EN and AR.

## 2. Footer tap targets
**Problem:** on mobile the footer links in EN are only 18px tall (AR 30px). This fails WCAG 2.2 target size (≥ 24px) and is hard to tap.

**Fix (below 1024px):**
- Give every footer link, the phone row and the social icons a minimum tap height of 44px using padding.
- The visual text size and the column look stay the same; only the row spacing grows evenly.
- EN and AR.

## 3. Products gallery on phones
**Problem:** below 768px the background title is cut off and mostly hidden behind the cards, and there is a large empty gap under the cards before the note.

**Fix:**
- **Background title:** scale it so at least one full line is readable behind or above the cards (about 13vw, 2 lines). Keep it behind the cards in z-order.
- **Empty gap:** remove the extra empty height under the card row; the note follows about 40px after the cards.
- **Check:** 390 and 360px, EN and AR.

## 4. After Fix 12 (About restructure)
Re-check the new About page at 360, 390 and 768px, EN and AR:
- the 4-item strip goes 2×2
- the sticky image is disabled on mobile
- the image is on top in the story section and in Vision/Mission
- no overflow

## Check
- Screenshots of every changed area at 360, 390 and 768px, EN and AR.
- Lint and build pass.

Report briefly, then restart `npm run preview`.
