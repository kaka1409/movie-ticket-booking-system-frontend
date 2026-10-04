/**
 * Next 16 network-boundary hook (formerly `middleware.ts` — that filename is
 * deprecated and silently ignored by Next 16). Runs on the Node.js runtime.
 *
 * The cookie check below is optimistic UX only, NOT an auth boundary: a
 * present-but-revoked `refreshToken` passes this gate and is caught after the
 * page's data fetch by `redirectIfUnauthorized()` in `libs/session.ts`.
 */
import { NextResponse, type NextRequest } from "next/server";
import { buildLoginUrl, getSafeReturnUrl } from "@/libs/utils";

const PROTECTED_PREFIXES = ["/notifications", "/tickets", "/booking", "/profile"];

/** 307 to a sanitized `/login?returnUrl=…` when a protected path has no refresh token. */
export function proxy(request: NextRequest): NextResponse {
  const currentPath = request.nextUrl.pathname + request.nextUrl.search;
  const isProtectedPath = PROTECTED_PREFIXES.some(
    (prefix) =>
      request.nextUrl.pathname === prefix || request.nextUrl.pathname.startsWith(`${prefix}/`),
  );

  if (isProtectedPath && !request.cookies.get("refreshToken")) {
    return NextResponse.redirect(
      new URL(buildLoginUrl(getSafeReturnUrl(currentPath)), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notifications", "/tickets/:path*", "/booking/:path*", "/profile", "/profile/:path*"],
};
