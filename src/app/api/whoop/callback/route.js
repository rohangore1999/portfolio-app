import { NextResponse } from "next/server";
import { configuration, isLocalDevelopment, requestOrigin, requestTokens, serialConnection, tokenStore, validState } from "@/lib/whoop.mjs";

export const runtime = "nodejs";

export async function GET(request) {
  if (!isLocalDevelopment(request)) return new NextResponse(null, { status: 404 });
  const origin = requestOrigin(request);
  const query = new URL(request.url).searchParams;
  const expected = request.cookies.get("whoop_oauth_state")?.value;
  let result = "connected=1";
  if (!validState(expected, query.get("state"))) result = "error=state";
  else if (query.has("error") || !query.get("code")) result = "error=denied";
  else {
    try {
      await serialConnection(async () => {
        const config = configuration();
        if (new URL(config.redirectUri).origin !== origin) throw new Error("invalid_configuration");
        const tokens = await requestTokens(config, {
          grant_type: "authorization_code", code: query.get("code"), redirect_uri: config.redirectUri,
        });
        await tokenStore().save(tokens);
      });
    } catch { result = "error=exchange"; }
  }
  const response = NextResponse.redirect(new URL(`/whoop/setup?${result}`, origin), 303);
  response.cookies.set("whoop_oauth_state", "", { path: "/api/whoop", maxAge: 0, httpOnly: true, sameSite: "lax" });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
