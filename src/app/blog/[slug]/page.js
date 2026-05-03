import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/mdx";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
import JsonLd from "@/components/JsonLd";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rohangore.com";

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
      robots: { index: false, follow: false },
    };
  }

  const url = `/blog/${post.slug}`;
  const imageUrl = post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/og-image.jpg`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.category ? [post.category, "Rohan Gore", "Blog"] : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${post.title} | Rohan Gore`,
      description: post.excerpt,
      siteName: "Rohan Gore",
      publishedTime: post.date,
      authors: ["Rohan Gore"],
      images: [
        {
          url: imageUrl,
          width: 1600,
          height: 900,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Rohan Gore`,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false, mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } },
  });

  const url = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/og-image.jpg`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Rohan Gore",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Rohan Gore",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: post.category,
    url,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <JsonLd data={blogPostingSchema} />
      <JsonLd data={breadcrumbSchema} />
      <BlogDetailClient post={post} content={content} />
    </>
  );
}
