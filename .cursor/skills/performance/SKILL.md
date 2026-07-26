---
name: performance
description: >-
  Performance and Web Vitals conventions for the rohangore.com personal site
  (Next.js 16 App Router + framer-motion). Use when adding or editing images,
  animations/motion, fonts, third-party scripts, iframes/video, or any component
  that affects bundle size, LCP, INP, or CLS. Covers the mandatory LazyMotion
  `m` rule, the image compression workflow, next/image usage, and hero/list
  loading patterns.
---

# Performance Conventions (rohangore.com)

This project has been optimized for Core Web Vitals. Follow these rules so changes do not regress performance. Verify with `npm run build` and, when bundle size matters, `npm run analyze`.

## CRITICAL: Animations use LazyMotion + `m` (never `motion`)

The app is wrapped in `<LazyMotion features={domMax} strict>` via [src/components/MotionProvider.jsx](src/components/MotionProvider.jsx) (mounted in [src/app/layout.js](src/app/layout.js)). Because `strict` is enabled, using `motion.*` **throws at runtime and fails the build**.

- ALWAYS import `m` (not `motion`): `import { m } from "framer-motion";`
- Use `m.div`, `m.span`, `m.h1`, etc. — the API is identical to `motion.*`.
- Hooks and helpers import normally: `AnimatePresence`, `useMotionValue`, `useSpring`, `useAnimationFrame`, `wrap`, `useReducedMotion`.
- `domMax` is the active feature set, so gestures, layout animations, and `drag` all work.
- Any new animated component must render inside the provider (all page content already does).

## Images: compress before committing

Source images live in `public/images/` and MUST be optimized before commit. Never commit multi-MB originals.

Run the reusable script after adding/replacing images:

```bash
node scripts/compress-images.mjs
```

It resizes in-place (longest side: 1920 for `home/`, 1600 elsewhere), recompresses (JPEG q80 mozjpeg, PNG palette), keeps the same extension/path, and only overwrites when it saves space. See [scripts/compress-images.mjs](../../../scripts/compress-images.mjs).

Target: keep `public/images/` in single-digit MB (it is ~8MB; was 78MB before optimization).

## Rendering images with next/image

- ALWAYS use `next/image`, never raw `<img>` (except inside MDX prose where unavoidable).
- Provide a `sizes` prop for every `fill` image (e.g. `sizes="100vw"` for full-bleed, or a responsive expression).
- Use `priority` ONLY on the above-the-fold LCP image (e.g. the hero). Everything else stays lazy.
- Do NOT add manual `<link rel="preload" as="image">` for images rendered by `next/image` — the raw URL never matches the optimized `/_next/image?...` request and just wastes bandwidth. `priority` handles preloading correctly.
- AVIF/WebP + long cache TTL are configured in [next.config.mjs](next.config.mjs) `images` — leave enabled.

## Do not eagerly preload lists of images

Never loop over a list and force-load images (e.g. `document.createElement('img').src = ...`). It bypasses `next/image` and downloads full-resolution assets on mount. Rely on `next/image` lazy loading + `router.prefetch(href)` on hover (see [src/components/common/ItemList.jsx](src/components/common/ItemList.jsx)).

## Fonts

Only load the Manrope weights actually used: `300, 400, 500, 600, 700` in [src/app/layout.js](src/app/layout.js). Before adding a weight, confirm a matching `font-*` class exists (`font-light`=300 … `font-bold`=700). Keep `display: "swap"`.

## Third-party scripts and embeds

- Non-critical client-only tooling (analytics, experimental APIs) loads via [src/components/DeferredTools.jsx](src/components/DeferredTools.jsx) using `next/dynamic(..., { ssr: false })`. Add new analytics/tracking there, not as static imports in the layout.
- `next/dynamic` with `ssr: false` cannot be called from a Server Component (the root layout). Put it inside a `"use client"` wrapper.
- YouTube iframes and native `<video>` on detail pages use `loading="lazy"` / `preload="none"` (see [src/components/work/WorkDetailClient.jsx](src/components/work/WorkDetailClient.jsx)). Keep below-the-fold media lazy.

## Keep pages as Server Components where possible

Page files under `src/app/**/page.js` should stay server components that export `metadata`/JSON-LD and delegate interactive UI to a `*PageClient` component. Don't add `"use client"` to a route's `page.js`.

## Verification checklist

- [ ] `npm run build` passes (this also catches any stray `motion.*` via LazyMotion strict).
- [ ] New images run through `scripts/compress-images.mjs`.
- [ ] New `fill` images have a `sizes` prop; only the LCP image has `priority`.
- [ ] No manual image preload links; no eager image loops.
- [ ] New animations use `m`, not `motion`.
- [ ] For bundle-size-sensitive changes, inspect `npm run analyze`.
