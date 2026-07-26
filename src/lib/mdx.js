import fs from "fs";
import path from "path";
import matter from "gray-matter";
import blurDataAll from "@/constants/blurDataAll.json";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export function getAllPosts() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data } = matter(raw);

      const image = data.hoverImage || data.image;
      return {
        slug,
        title: data.title,
        category: data.category,
        date: data.date,
        modifiedDate: data.modifiedDate || data.date,
        image,
        imagefit: data.imagefit,
        excerpt: data.excerpt,
        href: `/blog/${slug}`,
        blurDataURL: image ? blurDataAll[image] || null : null,
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
    modifiedDate: data.modifiedDate || data.date,
    image: data.image,
    excerpt: data.excerpt,
    content,
    blurDataURL: data.image ? blurDataAll[data.image] || null : null,
  };
}

export function getAllSlugs() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
