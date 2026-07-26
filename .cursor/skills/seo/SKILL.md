---
name: seo
description: >-
  SEO conventions for the rohangore.com personal site (Next.js 16 App Router).
  Use when adding or editing page metadata, titles/descriptions, canonical URLs,
  Open Graph / Twitter cards, JSON-LD structured data, the sitemap, the RSS feed,
  app icons/favicon, or blog post frontmatter. Ensures new pages are consistent
  and discoverable.
---

# SEO Conventions (rohangore.com)

Keep on-page SEO consistent across routes. For robots.txt, AI-crawler directives, and llms.txt, use the separate `ai-content-discovery` skill instead — this skill covers metadata, structured data, canonicals, social cards, sitemap, and RSS.

## Every page needs complete metadata

Route `page.js` files export a `metadata` object (or `generateMetadata` for dynamic routes). Match the established pattern — see [src/app/about/page.js](../../../src/app/about/page.js) as the reference template. Each page MUST include:

- `title` (the root `template` in [src/app/layout.js](../../../src/app/layout.js) appends `| Rohan Gore`)
- `description`
- `alternates: { canonical: "/path" }` — REQUIRED on every page (see gotcha below)
- `openGraph` with `type`, `url`, `title`, `description`, `siteName: "Rohan Gore"`, and `images`
- `twitter` with `card: "summary_large_image"`, `title`, `description`, `images`

### Canonical gotcha

The root layout does NOT set a site-wide `alternates.canonical` (that would wrongly point every page at `/`). Therefore each page must declare its own canonical. If you add a page and omit `alternates.canonical`, it will have no canonical — always set it.

## Structured data (JSON-LD)

- Global `Person` + `WebSite` schemas render on every page via [src/components/StructuredData.jsx](../../../src/components/StructuredData.jsx) (in the root layout `<head>`).
- Per-page schemas use the [src/components/JsonLd.jsx](../../../src/components/JsonLd.jsx) helper:
  - Blog posts: `BlogPosting` + `BreadcrumbList` ([src/app/blog/[slug]/page.js](../../../src/app/blog/%5Bslug%5D/page.js))
  - Work detail: `CreativeWork` + `BreadcrumbList`
  - Index pages: `ItemList` on `/blog` and `/work`
- When adding a new content type or index, add the matching schema following these examples.

## Open Graph images

- Dynamic OG images are generated at build via `ImageResponse`:
  - Site-wide: [src/app/opengraph-image.jsx](../../../src/app/opengraph-image.jsx)
  - Per blog post: [src/app/blog/[slug]/opengraph-image.jsx](../../../src/app/blog/%5Bslug%5D/opengraph-image.jsx)
- Static fallback: `public/og-image.jpg` (1200x630), referenced by most pages' `openGraph.images`.
- New sections can add their own `opengraph-image.jsx` using the same style (black bg, "RG" mark, title).

## Sitemap and RSS

- [src/app/sitemap.js](../../../src/app/sitemap.js) enumerates static routes + all blog and work slugs. When you add a new static route, add it here.
- [src/app/feed.xml/route.js](../../../src/app/feed.xml/route.js) is the blog RSS feed; it reads posts from `getAllPosts()`. New blog posts appear automatically.

## Blog frontmatter

MDX posts in `src/content/blog/*.mdx` support these frontmatter fields (parsed in [src/lib/mdx.js](../../../src/lib/mdx.js)):

```yaml
title: "..."
category: "Engineering"
date: "YYYY-MM-DD"
modifiedDate: "YYYY-MM-DD"   # optional; falls back to date. Bump when you meaningfully update a post
image: "/images/work/.../cover.png"
excerpt: "..."
```

`modifiedDate` feeds `dateModified` in `BlogPosting` JSON-LD, `article:modified_time` in OG, and `lastModified` in the sitemap. Update it when editing an existing post so freshness signals stay accurate.

## Icons / manifest

App icons use Next file conventions in `src/app/`: `favicon.ico`, `icon.png` (512), `apple-icon.png` (180). The PWA manifest is [src/app/manifest.json](../../../src/app/manifest.json). Keep these in sync if branding changes.

## Verification checklist

- [ ] New page has `title`, `description`, `alternates.canonical`, `openGraph`, `twitter`.
- [ ] New static route added to `sitemap.js`.
- [ ] New content type has appropriate JSON-LD via `JsonLd`.
- [ ] Edited blog posts bump `modifiedDate`.
- [ ] `npm run build` passes and the route renders its metadata.
