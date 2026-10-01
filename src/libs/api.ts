const SERVER_BASE_URL = process.env.BACKEND_URL ?? "http://localhost:8080";
const API_PREFIX = process.env.API_PREFIX ?? "/api/v1";

// Client: relative URL → same-origin → Next.js rewrite proxies to the backend
// Server: absolute URL → direct backend call, no proxy hop.
const backendUrl = (typeof window === "undefined" ? SERVER_BASE_URL : "") + API_PREFIX;

export type SuccessResponse<T, M = Record<string, unknown>> = {
  data: T;
  meta?: M;
};

export type ErrorResponse = {
  error: {
    status: number;
    code: string;
    message: string;
    details?: { code: string; message: string; detail?: string }[];
  };
};

export type ApiResponse<T, M = Record<string, unknown>> =
  | SuccessResponse<T, M>
  | ErrorResponse;

function parseApiError(status: number, body: unknown): ErrorResponse["error"] {
  const error = (body as {
    error?: {
      code?: unknown;
      message?: unknown;
      details?: unknown
    }
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
      message
    }
  };
}

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
  }

  let response: Response;
  try {
    response = await fetch(backendUrl + path, {
      ...options,
      headers,
      credentials: options?.credentials ?? "include"
    });
  } catch {
    return { error: { status: 0, code: "NETWORK_ERROR", message: "Network error" } };
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
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
      error: { status: response.status, code: "INVALID_RESPONSE", message: "Invalid response body" },
    };
  }

  if (typeof body === "object" && "data" in body) {
    const envelope = body as { data: T; meta?: M };
    return { data: envelope.data, meta: envelope.meta };
  }

  return { data: body as T };
}

export async function apiMutation<T>(
  path: string,
  options: RequestInit & { method: "POST" | "PATCH" | "DELETE" },
  token?: string,
  cookie?: string,
  raw?: false,
): Promise<T>;
export async function apiMutation(
  path: string,
  options: RequestInit & { method: "POST" | "PATCH" | "DELETE" },
  token?: string,
  cookie?: string,
  raw?: true,
): Promise<Response>;
export async function apiMutation<T>(
  path: string,
  options: RequestInit & { method: "POST" | "PATCH" | "DELETE" },
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
