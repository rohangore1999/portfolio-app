# Pulse Notch work-page design QA

## Evidence

- Source visual truth: `/Users/rohangore/Desktop/Screenshot 2026-08-15 at 4.37.41 PM.png`
- Source dimensions: 3600 × 2338 px; the complete desktop context is intentionally preserved inside the laptop display.
- Showcase sizing issue supplied by the user: `/var/folders/4j/20j3br2x4xx6w2zng_b9q2nw0000gn/T/codex-clipboard-147cd1f8-d539-4fa1-905a-4a4d2c982e82.png`
  - Captured pixels: 3580 × 2032
  - Normalized comparison assumption: 1790 × 1016 CSS px at 2× source density
- Post-fix desktop implementation: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/41-detail-desktop-showcase-1280-cap-settled.png`
  - CSS viewport and captured pixels: 1790 × 1016 at browser capture density 1
  - MacBook showcase: 1280 px wide and centered at x = 255 px
- Post-fix mobile implementation: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/42-detail-mobile-showcase-cap-unchanged.png`
  - CSS viewport and captured pixels: 390 × 844 at browser capture density 1
  - MacBook showcase: 326 px wide with `scrollWidth === innerWidth === 390`
- Before/after normalized comparison: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/43-macbook-size-before-after.png`
- Footer-navigation fix: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/44-pulse-footer-navigation-fixed.png`
  - CSS viewport and captured pixels: 1906 × 581 at browser capture density 1
  - Navigation row: 1778 × 97 px at x = 64 px, matching the shared work-detail layout
- Footer-navigation reference from another work page: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/45-reference-other-work-footer.png`
- Footer before/fixed/reference comparison: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/46-footer-before-after-reference.png`
- Homepage Recent Work reference: `/var/folders/4j/20j3br2x4xx6w2zng_b9q2nw0000gn/T/codex-clipboard-2f9f1e78-1cb3-49d5-805b-990f6105acf7.png`
  - Captured pixels: 1114 × 854
- Homepage Recent Work implementation: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/50-home-recent-work-pulse-clean.png`
  - CSS viewport and captured pixels: 1280 × 720 at browser capture density 1
  - No horizontal overflow: `scrollWidth === innerWidth === 1280`
- Homepage Pulse Notch hover state: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/49-home-recent-work-pulse-hover.png`
- Homepage reference/implementation comparison: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/51-home-recent-work-reference-implementation.png`
- Desktop implementation: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/36-detail-desktop-437-final.png`
  - CSS viewport: 1280 × 900
  - Captured pixels: 2560 × 1800
  - Device scale factor: 2
- Tablet implementation: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/24-detail-tablet-polished.png`
  - CSS viewport: 768 × 950
  - Captured pixels: 1536 × 1900
  - Device scale factor: 2
- Mobile implementation and diagnostics: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/38-detail-mobile-437-final.png`
  - CSS viewport: 390 × 844
  - Captured pixels: 780 × 1688
  - Device scale factor: 2
  - Browser diagnostics: `innerWidth=390`, `scrollWidth=390`, `scrollHeight=6263`, console errors `[]`
- Full desktop MacBook showcase: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/28-detail-desktop-showcase-final.png`
- Combined source/implementation comparison: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/39-reference-implementation-437-comparison.png`
- Work-list desktop implementation: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/21-work-desktop-final.png`
- Work-list mobile implementation: `/Users/rohangore/.codex/visualizations/2026/08/14/019fff4e-0f67-7170-b792-44d3f4108a5f/pulse-notch-web-qa/22-work-mobile-final.png`
  - Browser diagnostics at both list viewports: no console errors and `scrollWidth === innerWidth`.
- State: dark theme, Pulse Notch detail route, `79 BPM` elevated state with threshold `80` in its real desktop context, no site hover or menu overlay.

The source screenshot and final desktop implementation were normalized to 1280 px width and placed together in `39-reference-implementation-437-comparison.png` before review. The site intentionally wraps the source app screen in the portfolio's existing editorial presentation rather than reproducing the macOS panel as a standalone webpage.

## Full-view comparison

- The portfolio keeps its existing black editorial shell, light display typography, thin dividers and orange primary action. Pulse Notch is introduced as a native product without changing the site's visual language.
- Desktop hierarchy is clear: project metadata, oversized title, concise product explanation, direct download, requirements, then the MacBook product view.
- Tablet retains the desktop information hierarchy without horizontal overflow or compressed controls.
- Mobile reduces the title and stacks both CTAs to full width. The page remains exactly 390 CSS px wide with no horizontal page scroll.
- Pulse Notch is the first Work row on both desktop and mobile. The mobile row keeps its concise tagline, year, category and wrapped technology chips without disturbing the established list rhythm.
- Pulse Notch is now also the first homepage Recent Work row, using the existing title/category treatment and the supplied Pulse Notch icon for its hover preview.
- The requested real desktop screenshot is visible inside the MacBook SVG frame, preserving the surrounding app context that makes the notch placement feel authentic.
- The decorative “Macbook Pro” label was removed from the frame; only the hardware silhouette remains.
- On wide screens, the centered showcase now stops at 1280 px instead of continuing to grow with the viewport. It measured 1280 px at both 1920 px and 2560 px viewport widths.

## Focused product-screen comparison

- The implementation uses the actual source screenshot; typography, heart-rate values, threshold state, blue semantic color and notch silhouette therefore remain faithful rather than being recreated with CSS or placeholder art.
- Desktop preserves the full monitor context, top cutout treatment and elevated panel content.
- Mobile keeps the complete screenshot centered inside the responsive laptop screen without causing horizontal page overflow.
- The screenshot stays sharp at 2× capture density. The frame is vector and the screenshot has no stretch, transparency halo or visible compression damage.

## Required fidelity surfaces

- Fonts and typography: passes. Existing site font families and light display weights remain consistent with the rest of the portfolio; app-specific typography is preserved inside the source screenshot.
- Spacing and layout rhythm: passes. Header, metadata, CTA group, device showcase and case-study sections use the existing 8/16/32/64 px rhythm and remain balanced at 1280, 768 and 390 CSS px.
- Work navigation rhythm: passes. Pulse Notch now uses the same single divider and 97 px Previous/Next row as the other work-detail pages, with no Pulse-only 112 px empty band.
- Contrast and legibility: passes. Meaningful list/detail metadata is at least 50% white on black, while lower-opacity decoration remains non-semantic.
- Colors and visual tokens: passes. Black, white/gray and portfolio orange remain consistent, while the screenshot retains Pulse Notch's amber elevated state without recoloring.
- Image quality and asset fidelity: passes. Real source imagery and the MIT-licensed MacBook frame are used; no handmade SVG replacement, placeholder, emoji or CSS drawing is present.
- Copy and content: passes. The page accurately describes direct BLE Heart Rate Service `180D`, measurement characteristic `2A37`, Apple Silicon/macOS requirements, local processing, user-set zones and the independent WHOOP compatibility disclaimer.

## Findings

- No actionable P0, P1 or P2 issues remain.
- P3: the full desktop screenshot necessarily scales down on a narrow phone. The laptop and Pulse Notch placement remain recognizable, while the case-study copy carries the detailed explanation below.

## Comparison history

1. Earlier structural review found that the solid MacBook frame layer could cover the screenshot and that the product showcase was mounted twice.
   - Fix: moved the frame behind the inset screen, kept a single hero showcase, and made the SVG screen treatment responsive.
   - Post-fix evidence: desktop showcase capture `28-detail-desktop-showcase-final.png` shows one complete MacBook presentation with the live screen visible.
2. Initial mobile comparison found a P2 crop issue: the leading BPM digit and part of the threshold status were cut off.
   - Fix: reduced the mobile-only frame minimum width to 430 px and used a source-faithful, cache-busted screenshot crop without additional zoom.
   - Post-fix evidence: `27-detail-mobile-final.png` shows the heart, `79 BPM`, `Z0`, `Threshold: 90`, tooltip and reset action with no horizontal page overflow.
3. Initial asset review found that the source screenshot's unrelated “Completion gate” caption could enter the MacBook screen.
   - Fix: cropped the product screenshot to the app panel, top-anchored it and constrained it to the screen aperture.
   - Post-fix evidence: final desktop, tablet and mobile captures contain only the Pulse Notch product UI.
4. Final accessibility review found low-contrast work metadata and cramped CTAs at the 768 px breakpoint.
   - Fix: raised meaningful metadata contrast and kept the download/source actions stacked until the `lg` breakpoint.
   - Post-fix evidence: `24-detail-tablet-polished.png` has full-width, unwrapped actions; scoped lint and the production build pass.
5. The final art direction replaced the isolated product crop with the user-selected full-desktop screenshot.
   - Fix: installed the 3600 × 2338 source image as the MacBook screen, removed the decorative “Macbook Pro” vector label and kept the screenshot top-aligned inside the physical screen aperture.
   - Post-fix evidence: `36-detail-desktop-437-final.png` and `38-detail-mobile-437-final.png` show the updated 4:37 PM desktop context in the responsive frame.
6. Wide-screen review found a P2 scale issue: the MacBook showcase kept expanding to nearly the full content width on large displays.
   - Fix: centered the figure and capped it at the site's existing `max-w-7xl` width (1280 px), while retaining `w-full` below the cap.
   - Post-fix evidence: `41-detail-desktop-showcase-1280-cap-settled.png` shows balanced side breathing room at 1790 × 1016; `42-detail-mobile-showcase-cap-unchanged.png` confirms the existing mobile composition and zero horizontal overflow; `43-macbook-size-before-after.png` contains the normalized side-by-side comparison.
7. Footer review found a P2 layout mismatch: Pulse Notch added 112 px of bottom padding after its closing CTA and rendered a second divider above the shared Previous/Next navigation.
   - Fix: removed the Pulse-only bottom padding and let the shared work-navigation border define the transition, matching every other work-detail page.
   - Post-fix evidence: `44-pulse-footer-navigation-fixed.png` and `45-reference-other-work-footer.png` have the same divider-to-navigation geometry; `46-footer-before-after-reference.png` records the comparison.
8. Homepage review found that the new Pulse Notch project was present on `/work` but absent from the fixed six-item Recent Work list.
   - Fix: promoted Pulse Notch to the first Recent Work position and rotated the oldest Ecommerce Agent entry out of the homepage subset; the full project remains available on `/work`.
   - Post-fix evidence: `50-home-recent-work-pulse-clean.png` preserves the established row rhythm, while `49-home-recent-work-pulse-hover.png` verifies the Pulse Notch preview and `51-home-recent-work-reference-implementation.png` records the comparison.

## Primary interactions and technical checks

- Direct download CTA uses `https://github.com/rohangore1999/pulse-notch/releases/latest/download/PulseNotch.dmg` with no `target=_blank`; the URL was verified through GitHub's `v0.1.0` release redirect to a 200 attachment response.
- GitHub source links use a new tab with `noopener noreferrer`.
- Back-to-work navigation and the `/work/pulse-notch` static route are present.
- Pulse Notch appears first in the work data and uses SoftwareApplication structured metadata.
- Scoped ESLint passed for every modified/new Pulse Notch file.
- The current responsive sizing change passes scoped ESLint and the complete production build, including all 44 generated routes.
- The footer-navigation change passes scoped ESLint, `git diff --check`, and the complete production build; the checked browser console contains no errors.
- The homepage Recent Work change passes scoped ESLint, `git diff --check`, its `/work/pulse-notch` click-through, and the complete 44-route production build. The browser reported only the pre-existing Next Image `sizes` performance warning from the homepage hero.
- Mobile browser diagnostics reported no console errors and no horizontal overflow.

## Implementation checklist

- [x] Work list entry and responsive metadata
- [x] Homepage Recent Work entry and hover preview
- [x] Responsive Pulse Notch detail route
- [x] Real MacBook frame and real product screenshot
- [x] Direct Apple Silicon DMG CTA
- [x] BLE architecture, privacy, requirements and install content
- [x] Desktop, tablet and mobile visual QA
- [x] Accessibility landmark and semantic list/link structure
- [x] Production build verification

final result: passed
