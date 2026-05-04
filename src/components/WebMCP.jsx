"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://rohangore.com";

const PAGES = {
  home: "/",
  about: "/about",
  work: "/work",
  blog: "/blog",
  gallery: "/gallery",
  contact: "/contact",
};

/**
 * Registers WebMCP tools via navigator.modelContext so AI agents running
 * inside the browser can discover and invoke site actions.
 * https://webmachinelearning.github.io/webmcp/
 */
export default function WebMCP() {
  const router = useRouter();

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.modelContext) return;

    const controller = new AbortController();
    const { signal } = controller;

    const tools = [
      {
        name: "navigate_page",
        description:
          "Navigate to a page on rohangore.com. Available pages: home, about, work, blog, gallery, contact.",
        inputSchema: {
          type: "object",
          properties: {
            page: {
              type: "string",
              enum: Object.keys(PAGES),
              description: "The page to navigate to.",
            },
          },
          required: ["page"],
        },
        execute: ({ page }) => {
          const path = PAGES[page];
          if (!path) return { error: `Unknown page: ${page}` };
          router.push(path);
          return { navigated: true, url: `${BASE_URL}${path}` };
        },
      },
      {
        name: "get_site_info",
        description:
          "Returns basic information about this website: owner, role, links, and available pages.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
        execute: () => ({
          owner: "Rohan Gore",
          role: "Software Engineer",
          url: BASE_URL,
          github: "https://github.com/rohangore1999",
          linkedin:
            "https://www.linkedin.com/in/rohan-gore-038766187/",
          pages: Object.entries(PAGES).map(([name, path]) => ({
            name,
            url: `${BASE_URL}${path}`,
          })),
        }),
      },
    ];

    const registrations = tools.map((tool) =>
      navigator.modelContext.registerTool(tool, { signal })
    );

    return () => {
      controller.abort();
    };
  }, [router]);

  return null;
}
