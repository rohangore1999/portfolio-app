import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rohangore.com";

const PAGE_MARKDOWN = {
  "/": `# Rohan Gore - Software Engineer

> Software Engineer specializing in full-stack development, building scalable web applications with modern technologies. Passionate about bodybuilding and photography.

## About

I'm Rohan Gore, a Software Engineer focused on full-stack development with expertise in React, Next.js, Node.js, Python, and AI/ML systems including RAG architectures.

## Pages

- [About](${BASE_URL}/about) — Background, skills, and experience
- [Work](${BASE_URL}/work) — Projects and professional work
- [Blog](${BASE_URL}/blog) — Articles on software engineering, AI, and more
- [Gallery](${BASE_URL}/gallery) — Photography gallery
- [Contact](${BASE_URL}/contact) — Get in touch

## Links

- [GitHub](https://github.com/rohangore1999)
- [LinkedIn](https://www.linkedin.com/in/rohan-gore-038766187/)
`,
  "/about": `# About Rohan Gore

> Software Engineer with expertise in full-stack development and AI/ML systems.

## Skills

- **Languages:** JavaScript, TypeScript, Python
- **Frontend:** React, Next.js, Tailwind CSS
- **Backend:** Node.js, REST APIs, GraphQL
- **AI/ML:** RAG Systems, LLM integrations
- **Cloud:** AWS, Vercel

## Connect

- [GitHub](https://github.com/rohangore1999)
- [LinkedIn](https://www.linkedin.com/in/rohan-gore-038766187/)
- [Website](${BASE_URL})
`,
  "/blog": `# Blog - Rohan Gore

Articles on software engineering, AI/ML, full-stack development, and more.

- [Blog](${BASE_URL}/blog) — All posts
`,
  "/work": `# Work - Rohan Gore

Projects and professional work by Rohan Gore.

- [Work](${BASE_URL}/work) — All projects
`,
  "/contact": `# Contact Rohan Gore

Get in touch via the contact form at [${BASE_URL}/contact](${BASE_URL}/contact) or reach out on:

- [GitHub](https://github.com/rohangore1999)
- [LinkedIn](https://www.linkedin.com/in/rohan-gore-038766187/)
`,
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") || "/";

  const markdown = PAGE_MARKDOWN[path] || PAGE_MARKDOWN["/"];
  const tokens = Math.ceil(markdown.split(/\s+/).length * 1.3);

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(tokens),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
