import BlogPageClient from "@/components/blog/BlogPageClient";
import { getAllPosts } from "@/lib/mdx";

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogPageClient posts={posts} />;
}
