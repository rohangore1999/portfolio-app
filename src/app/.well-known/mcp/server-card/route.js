import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rohangore.com";

/**
 * MCP Server Card (SEP-1649)
 * Enables AI agents to discover MCP tools exposed by this site.
 */
export async function GET() {
  const serverCard = {
    serverInfo: {
      name: "Rohan Gore Personal Website",
      version: "1.0.0",
      description:
        "Personal website of Rohan Gore, a Software Engineer. Exposes site navigation and content tools for AI agents.",
    },
    transport: {
      type: "http",
      endpoint: `${BASE_URL}/mcp`,
    },
    capabilities: {
      tools: true,
      resources: false,
      prompts: false,
    },
    tools: [
      {
        name: "navigate",
        description:
          "Navigate to a page on the site (home, about, work, blog, gallery, contact)",
        inputSchema: {
          type: "object",
          properties: {
            page: {
              type: "string",
              enum: ["home", "about", "work", "blog", "gallery", "contact"],
              description: "Page to navigate to",
            },
          },
          required: ["page"],
        },
      },
      {
        name: "search_blog",
        description: "Search blog posts by keyword",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search keyword",
            },
          },
          required: ["query"],
        },
      },
    ],
  };

  return NextResponse.json(serverCard, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
