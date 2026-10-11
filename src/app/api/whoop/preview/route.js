import { NextResponse } from "next/server";
import { isLocalDevelopment, requestOrigin } from "@/lib/whoop.mjs";
import { getWhoopPreview } from "@/lib/whoop-cache.mjs";

export const runtime = "nodejs";

export async function POST(request) {
  if (!isLocalDevelopment(request)) return new NextResponse(null, { status: 404 });
  if (request.headers.get("origin") !== requestOrigin(request)) return new NextResponse(null, { status: 403 });
  try {
    const data = await getWhoopPreview();
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "WHOOP preview is unavailable. Check your local connection." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
