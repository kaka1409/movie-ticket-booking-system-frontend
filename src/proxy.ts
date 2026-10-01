import { NextResponse, type NextRequest } from "next/server";
import { getSafeReturnUrl } from "@/libs/utils";

const PROTECTED_PREFIXES = ["/notifications", "/tickets", "/booking", "/profile"];

export function proxy(request: NextRequest): NextResponse {
  const currentPath = request.nextUrl.pathname + request.nextUrl.search;
  const isProtectedPath = PROTECTED_PREFIXES.some(
    (prefix) =>
      request.nextUrl.pathname === prefix ||
      request.nextUrl.pathname.startsWith(`${prefix}/`),
  );

  if (isProtectedPath && !request.cookies.get("refreshToken")) {
    return NextResponse.redirect(
      new URL(`/login?returnUrl=${encodeURIComponent(getSafeReturnUrl(currentPath))}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/notifications",
    "/tickets/:path*",
    "/booking/:path*",
    "/profile",
    "/profile/:path*",
  ],
};
