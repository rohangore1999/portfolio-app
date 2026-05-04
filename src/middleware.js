import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rohangore.com";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Rewrite /robots.txt to custom route that includes Content-Signal directives
  if (pathname === "/robots.txt") {
    const url = request.nextUrl.clone();
    url.pathname = "/api/robots-txt";
    return NextResponse.rewrite(url);
  }

  // Rewrite .json extension paths to clean Next.js App Router segments
  if (pathname === "/.well-known/mcp/server-card.json") {
    const url = request.nextUrl.clone();
    url.pathname = "/.well-known/mcp/server-card";
    return NextResponse.rewrite(url);
  }

  if (pathname === "/.well-known/agent-skills/index.json") {
    const url = request.nextUrl.clone();
    url.pathname = "/.well-known/agent-skills/index";
    return NextResponse.rewrite(url);
  }

  if (pathname === "/.well-known/agent-skills/navigate-site/SKILL.md") {
    const url = request.nextUrl.clone();
    url.pathname = "/.well-known/agent-skills/navigate-site";
    return NextResponse.rewrite(url);
  }

  const response = NextResponse.next();

  // RFC 8288 Link headers for agent discovery on all HTML pages
  const isHtmlRoute =
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    !pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff2?|ttf)$/);

  if (isHtmlRoute) {
    const links = [
      `<${BASE_URL}/.well-known/api-catalog>; rel="api-catalog"`,
      `<${BASE_URL}/.well-known/agent-skills/index.json>; rel="service-desc"`,
      `<${BASE_URL}/llms.txt>; rel="describedby"`,
    ];
    response.headers.set("Link", links.join(", "));
  }

  // Markdown content negotiation
  const acceptHeader = request.headers.get("accept") || "";
  if (isHtmlRoute && acceptHeader.includes("text/markdown")) {
    const mdUrl = request.nextUrl.clone();
    mdUrl.pathname = "/api/markdown";
    mdUrl.searchParams.set("path", pathname);
    const mdResponse = NextResponse.rewrite(mdUrl);
    // Carry Link headers through
    const linkHeader = response.headers.get("Link");
    if (linkHeader) mdResponse.headers.set("Link", linkHeader);
    return mdResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
