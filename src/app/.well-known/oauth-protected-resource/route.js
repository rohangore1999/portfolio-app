import { NextResponse } from "next/server";
import { SITE_URL as BASE_URL } from "@/lib/site";

/**
 * OAuth Protected Resource Metadata (RFC 9728)
 * Describes how agents can authenticate to access protected resources on this site.
 */
export async function GET() {
  const metadata = {
    resource: BASE_URL,
    authorization_servers: [`${BASE_URL}/.well-known/openid-configuration`],
    scopes_supported: ["openid", "profile"],
    bearer_methods_supported: ["header"],
  };

  return NextResponse.json(metadata, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
