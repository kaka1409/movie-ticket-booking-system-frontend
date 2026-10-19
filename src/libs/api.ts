const SERVER_BASE_URL = process.env.BACKEND_URL ?? "http://localhost:8080";
const API_PREFIX = process.env.API_PREFIX ?? "/api/v1";

// Client: relative URL → same-origin → Next.js rewrite proxies to the backend
// Server: absolute URL → direct backend call, no proxy hop.
const backendUrl = (typeof window === "undefined" ? SERVER_BASE_URL : "") + API_PREFIX;

/** Window event fired when the backend answers 401 (handled by AuthContext). */
export const UNAUTHORIZED_EVENT = "primseat:unauthorized";

/**
 * Tells the client auth layer that the current credentials were rejected.
 * `/auth/*` endpoints are skipped — a failed login/refresh 401 is an expected
 * answer, not an expired session. AuthContext clears state on this event and
 * `ProtectedRoute` renders the login prompt in place (no redirect). On the
 * server (no `window`) callers render `<LoginPrompt />` on
 * `isUnauthorizedResult()` from `libs/session.ts` instead.
 */
function notifyUnauthorized(path: string): void {
  if (typeof window === "undefined") return;
  if (path.startsWith("/auth/")) return;
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}

export type SuccessResponse<T, M = Record<string, unknown>> = {
  data: T;
  meta?: M;
};

/**
 * Append the backend content-locale query (`?lang=en|vn`) to a path that may
 * already carry a query string. Catalog endpoints read it, and so do the
 * notification reads — a notice's text is stored as a code + params and rendered
 * per locale. Auth, seats, holds, bookings and tickets stay lang-less.
 */
export function withLang(path: string, locale: "en" | "vn"): string {
  return `${path}${path.includes("?") ? "&" : "?"}lang=${locale}`;
}

export type ErrorResponse = {
  error: {
    status: number;
    code: string;
    message: string;
    details?: { code: string; message: string; detail?: string }[];
  };
};

/**
 * Discriminated result of every query: `{ data, meta? }` on success or
 * `{ error }` on failure. Narrow with `"error" in result`.
 */
export type ApiResponse<T, M = Record<string, unknown>> = SuccessResponse<T, M> | ErrorResponse;

function parseApiError(status: number, body: unknown): ErrorResponse["error"] {
  const error = (
    body as {
      error?: {
        code?: unknown;
        message?: unknown;
        details?: unknown;
      };
    } | null
  )?.error;

  return {
    status,
    code:
      typeof error?.code === "string"
        ? error.code
        : status >= 500
          ? "INTERNAL_SERVER_ERROR"
          : "UNKNOWN_ERROR",
    message: typeof error?.message === "string" ? error.message : `API error: ${status}`,
    details: Array.isArray(error?.details) ? error.details : undefined,
  };
}

/**
 * Normalize a `Promise.allSettled` slot into an `ApiResponse`, turning a
 * rejection into `{ error: { status: 0, code: "UNKNOWN_ERROR" } }`.
 */
export function toApiResponse<T, M = Record<string, unknown>>(
  result: PromiseSettledResult<ApiResponse<T, M>>,
): ApiResponse<T, M> {
  if (result.status === "fulfilled") return result.value;
  const reason: unknown = result.reason;
  const message = reason instanceof Error ? reason.message : String(reason);
  return {
    error: {
      status: 0,
      code: "UNKNOWN_ERROR",
      message,
    },
  };
}

/**
 * GET a backend endpoint. Never rejects: network failures, HTTP errors and
 * empty bodies all come back as `{ error }`, so server components can render
 * an error state instead of crashing the RSC tree.
 *
 * - A 401 (except on `/auth/*`) additionally dispatches `UNAUTHORIZED_EVENT`
 *   so the client clears the session and redirects to login.
 * - On the server pass the incoming cookies via the `cookie` arg —
 *   `credentials: "include"` only forwards cookies in the browser.
 */
export async function apiFetch<T, M = Record<string, unknown>>(
  path: string,
  options?: RequestInit,
  token?: string,
  cookie?: string,
): Promise<ApiResponse<T, M>> {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(cookie ? { Cookie: cookie } : {}),
    ...options?.headers,
  };

  let response: Response;
  try {
    response = await fetch(backendUrl + path, {
      ...options,
      headers,
      credentials: options?.credentials ?? "include",
    });
  } catch {
    return { error: { status: 0, code: "NETWORK_ERROR", message: "Network error" } };
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    if (response.status === 401) notifyUnauthorized(path);
    return { error: parseApiError(response.status, body) };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (body === null || body === undefined) {
    return {
      error: {
        status: response.status,
        code: "INVALID_RESPONSE",
        message: "Invalid response body",
      },
    };
  }

  if (typeof body === "object" && "data" in body) {
    const envelope = body as { data: T; meta?: M };
    return { data: envelope.data, meta: envelope.meta };
  }

  return { data: body as T };
}

/**
 * POST/PUT/PATCH/DELETE a backend endpoint. Unlike {@link apiFetch} this THROWS
 * an `Error` (with `status`, `code` and `body` attached) on network or HTTP
 * failure — server actions wrap it in try/catch and convert the throw into a
 * `{ success: false }` union.
 *
 * - `raw: true` returns the `Response` itself so auth actions can read the
 *   `Set-Cookie` header; otherwise the parsed JSON body is returned.
 * - A 401 (except on `/auth/*`) dispatches `UNAUTHORIZED_EVENT`, same as
 *   {@link apiFetch}.
 */
export async function apiMutation<T>(
  path: string,
  options: RequestInit & { method: "POST" | "PUT" | "PATCH" | "DELETE" },
  token?: string,
  cookie?: string,
  raw?: false,
): Promise<T>;
export async function apiMutation(
  path: string,
  options: RequestInit & { method: "POST" | "PUT" | "PATCH" | "DELETE" },
  token?: string,
  cookie?: string,
  raw?: true,
): Promise<Response>;
export async function apiMutation<T>(
  path: string,
  options: RequestInit & { method: "POST" | "PUT" | "PATCH" | "DELETE" },
  token?: string,
  cookie?: string,
  raw?: boolean,
): Promise<T | Response> {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(cookie ? { Cookie: cookie } : {}),
    ...options.headers,
  };

  let response: Response;
  try {
    response = await fetch(backendUrl + path, {
      ...options,
      headers,
    });
  } catch (cause) {
    const error = new Error("Network error") as Error & {
      status: number;
      body: unknown;
      code: string;
    };
    error.status = 0;
    error.body = null;
    error.code = "NETWORK_ERROR";
    error.cause = cause;
    throw error;
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    if (response.status === 401) notifyUnauthorized(path);
    const apiError = parseApiError(response.status, body);
    const error = new Error(apiError.message) as Error & {
      status: number;
      body: unknown;
      code: string;
    };
    error.status = apiError.status;
    error.body = body;
    error.code = apiError.code;
    throw error;
  }

  return raw ? response : response.json();
}
