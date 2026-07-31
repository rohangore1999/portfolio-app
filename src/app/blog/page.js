import BlogPageClient from "@/components/blog/BlogPageClient";
import { getAllPosts } from "@/lib/mdx";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Blog",
  description:
    "Insights on software engineering, web development, AI/ML, and personal growth. Technical tutorials, project deep-dives, and lessons learned.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Blog | Rohan Gore",
    description:
      "Insights on software engineering, web development, AI/ML, and personal growth.",
    siteName: "Rohan Gore",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rohan Gore Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Rohan Gore",
    description:
      "Insights on software engineering, web development, AI/ML, and personal growth.",
    images: ["/og-image.jpg"],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Blog Posts by Rohan Gore",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <BlogPageClient posts={posts} />
    </>
  );
}
