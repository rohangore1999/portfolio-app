import BlogPageClient from "@/components/blog/BlogPageClient";
import { getAllPosts } from "@/lib/mdx";

export const metadata = {
  title: "Blog",
  description: "Insights on software engineering, web development, AI/ML, and personal growth. Technical tutorials, project deep-dives, and lessons learned.",
  openGraph: {
    title: "Blog - Rohan Gore",
    description: "Insights on software engineering, web development, AI/ML, and personal growth.",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogPageClient posts={posts} />;
}
