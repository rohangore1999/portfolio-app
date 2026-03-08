import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export function getAllPosts() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data } = matter(raw);

      return {
        slug,
        title: data.title,
        category: data.category,
        date: data.date,
        image: data.image,
        excerpt: data.excerpt,
        href: `/blog/${slug}`,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  const filepath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    category: data.category,
    date: data.date,
    image: data.image,
    excerpt: data.excerpt,
    content,
  };
}

export function getAllSlugs() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
