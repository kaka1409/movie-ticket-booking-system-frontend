import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ApiResponse } from "@/libs/api";
import { buildLoginUrl } from "@/libs/utils";

/**
 * Full incoming `Cookie` header for server-side `apiFetch`/`apiMutation`
 * calls (`undefined` when the request carries no cookies).
 */
export async function getRequestCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader === "" ? undefined : cookieHeader;
}

/**
 * Optimistic redirect to `/login` unless a `refreshToken` cookie exists.
 * Run at the top of protected layouts/pages so unauthenticated traffic never
 * reaches a data fetch — protected data never enters the RSC payload.
 * A present-but-revoked cookie still passes here; the post-fetch
 * {@link redirectIfUnauthorized} catches that case.
 */
export async function requireAuth(returnUrl?: string): Promise<void> {
  const cookieStore = await cookies();
  if (cookieStore.get("refreshToken")) return;

  redirect(buildLoginUrl(returnUrl));
}

/**
 * Server-side 401 guard for user-scoped fetches. `requireAuth()` only checks
 * that a `refreshToken` cookie exists — a revoked or stale one still passes,
 * and the backend then answers 401. Call this on the `apiFetch` result right
 * after fetching so the user is bounced to login instead of seeing the page's
 * empty/error state.
 *
 * The stale cookie cannot be cleared here (`cookies()` is read-only in server
 * components); the next successful login overwrites it.
 */
export function redirectIfUnauthorized(result: ApiResponse<unknown>, returnUrl: string): void {
  if ("error" in result && result.error.status === 401) {
    redirect(buildLoginUrl(returnUrl));
  }
}
