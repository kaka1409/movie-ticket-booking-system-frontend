import {
  notifyUnauthorized,
  parseApiError,
  toErrorResponse,
  type ApiResponse,
} from "@/libs/api-contract";

/**
 * Backend transport, shared by the server (components, route handlers, server
 * actions) and the two client callers that must refetch in the browser —
 * `NotificationsContext` (inbox resync) and `MoviePreviewContext` (hover
 * preview). The wire shapes live in `libs/api-contract.ts`.
 *
 * The server half of this module is validated at boot: `instrumentation.ts`
 * imports `libs/env/server.ts`, which refuses to start a production server
 * without `BACKEND_URL`.
 */
export * from "@/libs/api-contract";

const BACKEND_URL = process.env.BACKEND_URL;
const API_PREFIX = process.env.API_PREFIX ?? "/api/v1";

/**
 * Server: absolute origin, no proxy hop. Browser: the same-origin `/api/v1`
 * rewrite from `next.config.ts` — `BACKEND_URL` is private and is not inlined
 * into the client bundle, so it reads as `undefined` there (as does
 * `API_PREFIX`, hence the literal fallback that matches the rewrite source).
 */
const backendUrl =
  typeof window === "undefined"
    ? `${BACKEND_URL ?? "http://localhost:8080"}${API_PREFIX}`
    : API_PREFIX;

/**
 * Await a query and express a rejection as `{ error }`. Streamed sections await
 * their feed inside a Suspense boundary, where a throw would unwind the whole
 * boundary into the error page — they render the failure in place instead.
 */
export async function settleApiResponse<T, M = Record<string, unknown>>(
  request: Promise<ApiResponse<T, M>>,
): Promise<ApiResponse<T, M>> {
  try {
    return await request;
  } catch (reason) {
    return toErrorResponse(reason);
  }
}

/**
 * Normalize a `Promise.allSettled` slot into an `ApiResponse`, turning a
 * rejection into `{ error: { status: 0, code: "UNKNOWN_ERROR" } }`.
 */
export function toApiResponse<T, M = Record<string, unknown>>(
  result: PromiseSettledResult<ApiResponse<T, M>>,
): ApiResponse<T, M> {
  if (result.status === "fulfilled") return result.value;
  return toErrorResponse(result.reason);
}

/**
 * GET a backend endpoint. Never rejects: network failures, HTTP errors and
 * empty bodies all come back as `{ error }`, so server components can render
 * an error state instead of crashing the RSC tree.
 *
 * - A 401 (except on `/auth/*`) additionally dispatches `UNAUTHORIZED_EVENT`:
 *   `AuthContext` clears the session and `ProtectedRoute` renders the prompt in
 *   place — never a redirect.
 * - Pass the incoming cookies via the `cookie` arg — `credentials: "include"`
 *   only forwards cookies in the browser.
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

/** Error shape thrown by {@link requestOrThrow} — `status`/`code`/`body` ride on the Error. */
type ApiRequestError = Error & { status: number; body: unknown; code: string };

function toNetworkError(cause: unknown): ApiRequestError {
  const error = new Error("Network error") as ApiRequestError;
  error.status = 0;
  error.body = null;
  error.code = "NETWORK_ERROR";
  error.cause = cause;
  return error;
}

function toHttpError(path: string, status: number, body: unknown): ApiRequestError {
  if (status === 401) notifyUnauthorized(path);
  const apiError = parseApiError(status, body);
  const error = new Error(apiError.message) as ApiRequestError;
  error.status = apiError.status;
  error.body = body;
  error.code = apiError.code;
  return error;
}

/**
 * Shared transport for the throwing mutations: attaches auth headers, turns a
 * network failure or non-2xx answer into an {@link ApiRequestError}. Callers
 * own the body encoding (JSON vs multipart) and the success payload shape.
 */
async function requestOrThrow(
  path: string,
  init: RequestInit,
  token?: string,
  cookie?: string,
): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(backendUrl + path, {
      ...init,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
        ...init.headers,
      },
    });
  } catch (cause) {
    throw toNetworkError(cause);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw toHttpError(path, response.status, body);
  }

  return response;
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
  const response = await requestOrThrow(
    path,
    {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    },
    token,
    cookie,
  );

  return raw ? response : response.json();
}

/**
 * POST a multipart/form-data body (file upload). Never sets `Content-Type` — the
 * browser must attach the multipart boundary itself.
 */
export async function apiUpload<T>(
  path: string,
  formData: FormData,
  token?: string,
  cookie?: string,
): Promise<T> {
  const response = await requestOrThrow(
    path,
    { method: "POST", body: formData, credentials: "include" },
    token,
    cookie,
  );

  const body = await response.json().catch(() => null);
  if (body === null || body === undefined) {
    throw new Error("Invalid response body");
  }
  if (typeof body === "object" && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}
