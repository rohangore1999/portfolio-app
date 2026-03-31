export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rohangore.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
