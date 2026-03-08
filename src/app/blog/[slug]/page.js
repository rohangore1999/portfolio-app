import { getAllSlugs, getPostBySlug } from "@/lib/mdx";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
import { compileMDX } from "next-mdx-remote/rsc";

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Rohan Gore`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/50 text-xl">Post not found.</p>
      </div>
    );
  }

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
  });

  return <BlogDetailClient post={post} content={content} />;
}
