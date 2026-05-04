import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rohangore.com";

/**
 * Agent Skills Discovery Index (Agent Skills Discovery RFC v0.2.0)
 * https://agentskills.io/
 */
export async function GET() {
  const index = {
    $schema:
      "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: "navigate-site",
        type: "skill-md",
        description:
          "Navigate to pages on rohangore.com (home, about, work, blog, gallery, contact)",
        url: `${BASE_URL}/.well-known/agent-skills/navigate-site/SKILL.md`,
        digest:
          "sha256:b0ff517fc1871af7dc8f853d0f216b67ff7fe83b12ec06b7d47ac96ea3868796",
      },
    ],
  };

  return NextResponse.json(index, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
