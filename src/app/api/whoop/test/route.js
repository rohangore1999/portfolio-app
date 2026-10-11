import { NextResponse } from "next/server";
import { configuration, isLocalDevelopment, requestOrigin, serialConnection, testConnection, tokenStore } from "@/lib/whoop.mjs";

export const runtime = "nodejs";

export async function POST(request) {
  if (!isLocalDevelopment(request)) return new NextResponse(null, { status: 404 });
  if (request.headers.get("origin") !== requestOrigin(request)) return new NextResponse(null, { status: 403 });
  const options = { forceRefresh: new URL(request.url).searchParams.get("refresh") === "1" };
  try {
    const result = await serialConnection(() => testConnection(configuration(), tokenStore(), options));
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Connection test failed. Check configuration or reconnect WHOOP." }, {
      status: 400, headers: { "Cache-Control": "no-store" },
    });
  }
}
