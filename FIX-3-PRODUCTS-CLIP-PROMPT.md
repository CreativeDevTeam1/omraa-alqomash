# Fix 3: product cards are cut off at the bottom (paste this into Claude Code)

**Bug:** in the Products pinned stage, the bottom of the cards is clipped by the stage edge.

The designer's screenshot is AR at about 1900px wide on a normal laptop-height window. You can see the clipping on:
- the lower cards: the bottom of the description is cut ("صنرايز" and "جوبلان")
- the upper card: its shadow is cut

**Requirement:** every card must be fully visible: image, name, full description, rounded bottom corners and shadow. This applies at every viewport size while the section is pinned.

## Fix
1. **Clipping:** the stage may clip only horizontally.
   - Use `overflow-x: clip; overflow-y: visible`, or `clip-path: inset(-200px 0 -200px 0)`.
   - Never clip vertically.
   - Make sure the parent wrappers (the pin-spacer and the section) don't clip vertically either.
2. **Size the layout from the real viewport height, not fixed px.** The stage is 100vh minus the header (`100svh - var(--header-h)`). Inside it:
   - The tallest card plus the stagger plus the shadow must fit, with ≥ 32px free space above and below.
   - Compute it at runtime, and on resize. If a card's height + stagger + 64px is more than the stage height:
     1. first reduce the stagger: the even-card drop goes from 150px down to a minimum of 40px
     2. then scale the card width down (min 260px) until everything fits
   - Centre the card group vertically in the stage. The odd/even drop stays relative to that centre.
3. **The background title** stays centred in the stage, behind the cards.
4. **Bottom spacing:** remove the extra empty space below the note/actions row. The section bottom padding is 120px total, with nothing added on top of it.

## Test
Run each of these at the start, the middle and the end of the scroll, in EN and AR.

| Window size | Why |
|---|---|
| 1920×1080 | large desktop |
| 1920×900 | same width, shorter window |
| 1440×900 | |
| 1366×768 | short laptop |
| 1280×720 | short laptop |
| 1024×700 | smallest pinned size |

Screenshot each one and confirm no card edge or shadow is cut and every description is fully readable. Lint and build pass.

Report with the screenshots.
