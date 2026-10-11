import { NextResponse } from "next/server";
import { authorizationUrl, configuration, isLocalDevelopment, newState, requestOrigin } from "@/lib/whoop.mjs";

export const runtime = "nodejs";

export async function POST(request) {
  if (!isLocalDevelopment(request)) return new NextResponse(null, { status: 404 });
  const origin = requestOrigin(request);
  if (request.headers.get("origin") !== origin) return new NextResponse(null, { status: 403 });
  try {
    const config = configuration();
    if (new URL(config.redirectUri).origin !== origin) throw new Error("invalid_configuration");
    const state = newState();
    const response = NextResponse.redirect(authorizationUrl(config, state), 303);
    response.cookies.set("whoop_oauth_state", state, {
      httpOnly: true, sameSite: "lax", secure: origin.startsWith("https:"),
      path: "/api/whoop", maxAge: 600,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.redirect(new URL("/whoop/setup?error=configuration", origin), 303);
  }
}
