import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rohangore.com";

export async function GET() {
  const body = `# Rohan Gore

> Software Engineer specializing in full-stack development, building scalable web applications with modern technologies. Passionate about bodybuilding and photography.

## Pages

- [Home](${BASE_URL}/) — Introduction and hero section
- [About](${BASE_URL}/about) — Background, skills, and experience
- [Work](${BASE_URL}/work) — Projects and professional work samples
- [Blog](${BASE_URL}/blog) — Articles on software engineering, AI/ML, and more
- [Gallery](${BASE_URL}/gallery) — Photography gallery
- [Contact](${BASE_URL}/contact) — Get in touch

## Skills & Expertise

- Full-stack development: React, Next.js, Node.js, TypeScript, Python
- AI/ML: RAG systems, LLM integrations, vector databases
- Cloud & Infrastructure: AWS, Vercel
- Databases: PostgreSQL, MongoDB, Redis

## Connect

- [GitHub](https://github.com/rohangore1999)
- [LinkedIn](https://www.linkedin.com/in/rohan-gore-038766187/)
- [Website](${BASE_URL})

## Machine-Readable Resources

- [API Catalog](${BASE_URL}/.well-known/api-catalog) — application/linkset+json
- [Agent Skills](${BASE_URL}/.well-known/agent-skills/index.json) — Agent Skills Discovery index
- [MCP Server Card](${BASE_URL}/.well-known/mcp/server-card.json) — MCP server capabilities
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
