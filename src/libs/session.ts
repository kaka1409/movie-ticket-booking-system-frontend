import { cookies } from "next/headers";
import type { ApiResponse } from "@/libs/api";

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
 * The UI locale for server-side catalog fetches, read from the `locale`
 * cookie the `LanguageToggle` writes (`en|vn`, default `en`). Server
 * components cannot read localStorage, so this cookie is the only SSR-safe
 * locale source — every `?lang=` catalog call threads through it.
 */
export async function getRequestLocale(): Promise<"en" | "vn"> {
  const cookieStore = await cookies();
  return cookieStore.get("locale")?.value === "vn" ? "vn" : "en";
}

/**
 * Whether the incoming request carries a `refreshToken` cookie — the
 * server-side counterpart of `isAuthenticated` (server components cannot read
 * `AuthContext`). Run at the top of protected layouts/pages so unauthenticated
 * traffic never reaches a data fetch — protected data never enters the RSC
 * payload; the caller renders `LoginPrompt` instead of its children.
 * A present-but-revoked cookie still passes here; the post-fetch
 * {@link isUnauthorizedResult} check catches that case.
 */
export async function hasSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken") !== undefined;
}

/**
 * Whether a server-side `apiFetch` result is a 401. `hasSession()` only checks
 * that a `refreshToken` cookie exists — a revoked or stale one still passes,
 * and the backend then answers 401. Callers render `<LoginPrompt />` on `true`
 * (staying on the protected URL; the prompt's CTA carries the returnUrl) —
 * never `redirect()`: a child-segment redirect would win over the parent
 * layout's prompt and yank the URL.
 */
export function isUnauthorizedResult<T, M>(result: ApiResponse<T, M>): boolean {
  return "error" in result && result.error.status === 401;
}
