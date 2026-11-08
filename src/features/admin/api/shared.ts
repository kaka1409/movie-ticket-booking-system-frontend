import { getRequestCookie } from "@/libs/session";

/**
 * Admin reads. Every call runs on the server with the visitor's cookies (the
 * backend authorizes on the RAM access token only for mutations; these GETs are
 * guarded by the refresh cookie the layout already proved) and opts out of the
 * fetch cache — the console must never render a row the operator just saved.
 */
export const ADMIN_NO_STORE: RequestInit = { cache: "no-store" };

export function buildAdminQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query === "" ? "" : `?${query}`;
}

/** Every admin read forwards the request cookie — server components carry no Bearer token. */
export function adminCookie(): Promise<string | undefined> {
  return getRequestCookie();
}
