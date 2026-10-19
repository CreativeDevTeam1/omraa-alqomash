# Fix 12: About page restructure, ALL content kept (paste this into Claude Code)

**Problem (designer):** the About page is about 5,700px tall (≈6 screens) for about 250 words.
- Two "story rows" are 1,060px each but hold a single short paragraph.
- 7 images, including small overlapping collage images with no purpose and the low-res exhibition photo.
- Nothing tells a visitor who the company is at a glance.

**Goal:**
- the same copy, word for word, in a page about 3 screens tall (~2,800–3,200px at 1440×900)
- 3 images
- a clear hierarchy: headlines first, details for whoever wants them

## Hard rules
- **Every About string in `en.ts` / `ar.ts` stays, verbatim.**
  - Before you start, list every About string.
  - After you finish, prove each one still renders on the page: string → section, for EN and AR.
  - No new copy. No deletions. No paraphrasing.
- Use only the brand tokens, fonts and roles from Fixes 4, 10 and 11.
- No hover motion and no underlines (same rule as Fix 7). Keep only the gentle scroll-in reveals the site already uses.
- EN and AR (RTL mirrored), responsive.

## New structure (top to bottom)

### 1. Intro (ivory)
- **Two columns:**
  - Start: the h1 "About Us" / «من نحن» (display font).
  - End: the lead sentence "OMRAA AL QOMASH is an Egyptian textile manufacturing and export company" / «أمراء القماش هي شركة مصرية متخصصة في تصنيع وتصدير أقمشة التنجيد والمفروشات.», set LARGE, about 28–34px, using the display role.
- **Below them:** a full-width image band using `still-life.jpg`, height `clamp(280px, 42vh, 460px)`, object-fit cover. This replaces the current taller band.

### 2. At-a-glance strip (ivory, thin top and bottom rules in espresso at 15%)
- Show the existing verbatim line split on "|" into 4 equal items in one row:
  - "Factory-Direct Manufacturing"
  - "Bulk Production"
  - "Export Experience"
  - "ISO 9001 Certified"
  - AR: «تصنيع مباشر من المصنع» «إنتاج بكميات كبيرة» «خبرة في التصدير» «شهادة ISO 9001»
- 18–20px, centred in their cells, with a thin vertical divider between them.
- 2×2 grid on mobile.
- No icons and no numbers.

### 3. Story: ONE section replacing BOTH story rows (ivory)
- **Two columns, 5/7 split:**
  - **Image column:** ONE image, `weave-macro.jpg`, portrait 4:5. It is sticky (`position: sticky; top: header + 40px`) while the text scrolls on desktop.
  - **Text column:** these 3 paragraphs, in order, 19–21px, line-height 1.6, max 60ch, 28px apart:
    1. "We specialize in manufacturing upholstery and furnishing fabrics…"
    2. "Our manufacturing capabilities, product variety, export experience…"
    3. "We combine Egyptian manufacturing capabilities with a business-focused approach…"
- **Mobile:** the image goes on top at 4:3, then the text.

### 4. Partnership band (olive): KEEP as it is now
- The small paragraph "We believe successful textile partnerships…" stays above the big quote "That is why we work to build long-term business relationships rather than one-time transactions."
- Only reduce its vertical padding, so the band is ≤ 560px tall at 1440.

### 5. Quality + Vision + Mission: ONE section
- **Top row:** ISO as a compact band (espresso background, as now).
  - "ISO 9001" large at the start, the ISO sentence at the end.
  - Height ≤ 300px.
- **Below it, two columns:**
  - **Image column:** `swatch-fan.jpg`, covering the full height of the text column.
  - **Text column (olive):**
    - "Our Vision" label, its headline "To Become a Trusted Global Partner in Upholstery & Furnishing Fabrics." in the display font at 30–36px, then its 2 paragraphs at 17–18px.
    - A thin divider in ivory at 20%.
    - "Our Mission" label, the headline "Manufacturing Quality That Builds Long Term Partnerships." in the same style, then its paragraph.
- **Mobile:** the image on top at 16:9, then the olive text.

### 6. Footer: unchanged

## Images
- **Use only these:** `still-life.jpg`, `weave-macro.jpg`, `swatch-fan.jpg`.
- **Remove from About:** the collage overlap images, `exhibition-booth.jpg`, and any duplicates.
- Don't delete the files from the project. Only stop using them on this page.
- Use the responsive AVIF/WebP/JPG pipeline with correct `sizes`.

## Check
- Page height at 1440×900 in EN and AR. Report it; the target is about 3 screens.
- The full string checklist (every About string present, EN and AR).
- Screenshots of every section at 1440 and 390px, EN and AR.
- No horizontal scroll. The sticky image works and releases correctly at the section end.
- Lighthouse on the About EN and About AR pages.
- Lint and build pass.

Report briefly, then restart `npm run preview`.
