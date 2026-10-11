import { NextResponse } from "next/server";
import { isLocalDevelopment, requestOrigin } from "@/lib/whoop.mjs";
import { getWhoopPreview } from "@/lib/whoop-cache.mjs";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(request) {
  // Only this curated summary is public. OAuth and token test routes stay local.
  const allowedOrigins = isLocalDevelopment(request)
    ? [requestOrigin(request)]
    : [new URL(SITE_URL).origin, "https://www.rohangore.com", "https://rohangore.com"];
  if (!allowedOrigins.includes(request.headers.get("origin"))) return new NextResponse(null, { status: 403 });
  try {
    const data = await getWhoopPreview();
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "WHOOP statistics are temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
