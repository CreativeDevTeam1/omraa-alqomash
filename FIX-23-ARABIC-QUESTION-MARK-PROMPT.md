# Fix 23: the Arabic question mark «؟» renders wrong in Anaqa (paste this into Claude Code)

**Bug, from a designer screenshot:** in «ماذا نصنع؟» (the What We Manufacture label, terracotta), Anaqa's glyph for «؟» (U+061F) looks broken: raised, small, and stuck to the last letter.

**Rule:** the copy is verbatim from the content PDF, so the «؟» must STAY. Only its rendering changes.

## Fix
1. **Swap the glyph's font:** render U+061F (and, after checking, «،» U+060C and «؛» U+061B if they look wrong too) from a font with a proper Arabic question-mark glyph, instead of Anaqa:
   - Add `unicode-range` to both Anaqa `@font-face` rules so they EXCLUDE U+061F (and any other punctuation you find broken). The browser then falls back automatically to the next font in the `--font-ar-*` stack.
   - Make sure that next font has a good «؟»: Amiri (self-hosted, subset to these punctuation code points only, a few KB), or the system Arabic font as a last resort.
2. **Match it to Anaqa:** same visual weight (Bold role → Amiri Bold, Regular → Amiri Regular), same colour and baseline, and normal spacing after the last letter, with no gap and no overlap.
3. **Check every Arabic string that contains «؟» «،» «؛»:**
   - «ماذا نصنع؟» in the section label, the footer and the nav if present
   - the commas in the paragraphs and contact details
   - Zoom in at 1440 and 390px.
4. **Sanity:** if the client types «؟» in the CMS later, the same fallback applies automatically. No content change is needed.
5. **Ship it:** lint and build, then deploy with `npx vercel --prod`. Verify live with a zoomed screenshot of «ماذا نصنع؟».

Report briefly with the before/after zoom.
