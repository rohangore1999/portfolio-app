const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rohangore.com";

// Normalize by stripping any trailing slashes. This guarantees that URL
// concatenation like `${SITE_URL}/about` never produces a double slash
// (e.g. https://www.rohangore.com//about), which Googlebot follows as a 308
// redirect and reports as "Page with redirect" / "Soft 404" in Search Console.
export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");
