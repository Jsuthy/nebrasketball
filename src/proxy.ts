import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin token gate (unchanged behavior).
  if (pathname.startsWith("/admin")) {
    const token = request.nextUrl.searchParams.get("token");
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken || token !== adminToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // Retired commerce routes: return 410 Gone + noindex so Google drops them
  // (they were previously 307ing to home, which kept them indexed and
  // suppressed the domain's topical authority).
  return new NextResponse(null, {
    status: 410,
    headers: { "X-Robots-Tag": "noindex" },
  });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/shop",
    "/gear",
    "/gear/:path*",
    "/product/:path*",
    "/category/:path*",
    "/gift-guides",
    "/gift-guides/:path*",
  ],
};
