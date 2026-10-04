import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ApiResponse } from "@/libs/api";

export async function getRequestCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader === "" ? undefined : cookieHeader;
}

export async function requireAuth(returnUrl?: string): Promise<void> {
  const cookieStore = await cookies();
  if (cookieStore.get("refreshToken")) return;

  const query = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : "";
  redirect(`/login${query}`);
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
    redirect(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  }
}
