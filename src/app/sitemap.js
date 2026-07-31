import { getAllPosts } from "@/lib/mdx";
import { allProjects } from "@/constants/work";
import { SITE_URL } from "@/lib/site";

// Stable last-modified date for evergreen marketing pages (home hero, about,
// gallery, contact). Bump this when the content of those pages meaningfully
// changes. Using a fixed date avoids telling Google every page changed "today"
// on every crawl, which is an inaccurate freshness signal.
const STATIC_LAST_MODIFIED = new Date("2026-07-31");

// Derive a stable date for a work project. Projects only carry a `year`, so
// fall back to Jan 1 of that year (or an explicit `updatedAt`/`date` if added).
function projectDate(project) {
  const explicit = project.updatedAt || project.date;
  if (explicit) return new Date(explicit);
  if (project.year) return new Date(`${project.year}-01-01`);
  return STATIC_LAST_MODIFIED;
}

function maxDate(dates) {
  return dates.reduce(
    (latest, d) => (d > latest ? d : latest),
    new Date(0)
  );
}

export default function sitemap() {
  const baseUrl = SITE_URL;

  // Get all blog posts
  const posts = getAllPosts();
  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.modifiedDate || post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Freshness of index pages reflects their newest child content.
  const latestPostDate = posts.length
    ? maxDate(posts.map((p) => new Date(p.modifiedDate || p.date)))
    : STATIC_LAST_MODIFIED;
  const latestProjectDate = allProjects.length
    ? maxDate(allProjects.map(projectDate))
    : STATIC_LAST_MODIFIED;
  const homeLastModified = maxDate([
    latestPostDate,
    latestProjectDate,
    STATIC_LAST_MODIFIED,
  ]);

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: homeLastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: latestProjectDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Work project pages from constants
  const workPages = allProjects.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    lastModified: projectDate(project),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...routes, ...workPages, ...blogPosts];
}
