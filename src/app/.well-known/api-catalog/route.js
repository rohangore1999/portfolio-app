import { NextResponse } from "next/server";
import { SITE_URL as BASE_URL } from "@/lib/site";

export async function GET() {
  const catalog = {
    linkset: [
      {
        anchor: BASE_URL,
        "service-doc": [
          {
            href: `${BASE_URL}/blog`,
            type: "text/html",
          },
        ],
        "describedby": [
          {
            href: `${BASE_URL}/llms.txt`,
            type: "text/markdown",
          },
        ],
      },
    ],
  };

  return NextResponse.json(catalog, {
    status: 200,
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
