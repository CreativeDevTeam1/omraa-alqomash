# Fix 22: Arabic lines collide (dots touching between lines) (paste this into Claude Code)

**Bug, from a designer screenshot:** in AR, the big Products background title «أقمشة تنجيد لمختلف الاستخدامات.» wraps to 2 lines. The line-height is too tight for Anaqa, so the dots under «تنجيد» (line 1) touch the dots above «الاستخدامات» (line 2).

Arabic needs more vertical room than Latin: dots and marks sit above and below the letters. Anaqa's metrics differ from Cormorant's and Amiri's.

## Fix
1. **Arabic line-height floor:** set a minimum line-height for every Arabic text that can wrap to 2+ lines (`:lang(ar)` / `[dir=rtl]` scope):
   - display/Bold role (`--font-ar-display`): **line-height ≥ 1.4**
   - text/Regular role (`--font-ar-light`): **≥ 1.7**
   - Never `line-height: 1` or `0.9` for Arabic.
   - Leave the EN values unchanged.
2. **Audit every Arabic multi-line block,** at all widths:
   - the Products background title
   - the hero title + tagline
   - section statements
   - the About intro lead, strip items, partnership quote, Vision/Mission headlines
   - card names and descriptions (Products + Manufacture)
   - the Contact headline
   - the footer
   - the 404
   Pass condition: **no dots or marks from one line touch or overlap the next line,** with a visible gap of at least about 4px at the size used.
3. **Keep the layout:**
   - The Products background title stays centred behind the cards. If the taller lines push it too tall, reduce its AR font-size slightly rather than squeezing the line-height.
   - The gallery fit from Fix 3/15 still works.
4. **Widths:** check at 1920, 1440, 1024, 768, 390 and 360px in AR. Screenshot every block that wraps, zoomed in where lines meet.
5. **Ship it:** lint and build, then deploy with `npx vercel --prod`. Verify live.

Report the values you set and include the zoomed screenshots.
