/**
 * The backend wire contract, shared by the server transport (`libs/api.ts`) and
 * client code that only needs the shapes or a pure helper.
 *
 * This module must stay free of `server-only`: `AuthContext` imports the
 * unauthorized event and the auth hooks import `fieldErrorsFromDetails`, both
 * from the browser bundle. Anything that reads a non-public env var or performs
 * a request belongs in `libs/api.ts` instead.
 */

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
export function notifyUnauthorized(path: string): void {
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
 * per locale. Auth, seats, holds and bookings stay lang-less, as does every
 * ticket read that only carries codes and instants.
 */
export function withLang(path: string, locale: "en" | "vn"): string {
  return `${path}${path.includes("?") ? "&" : "?"}lang=${locale}`;
}

export type ErrorResponse = {
  error: {
    status: number;
    code: string;
    message: string;
    details?: { code: string; message: string; field?: string; detail?: string }[];
  };
};

export function fieldErrorsFromDetails(
  details: ErrorResponse["error"]["details"],
): Record<string, string> {
  return (details ?? []).reduce<Record<string, string>>((errors, detail) => {
    if (detail.field && !errors[detail.field]) errors[detail.field] = detail.message;
    return errors;
  }, {});
}

/**
 * Discriminated result of every query: `{ data, meta? }` on success or
 * `{ error }` on failure. Narrow with `"error" in result`.
 */
export type ApiResponse<T, M = Record<string, unknown>> = SuccessResponse<T, M> | ErrorResponse;

export type ActionFailure = {
  success: false;
  error: string;
  status?: number;
  code?: string;
  details?: ErrorResponse["error"]["details"];
};

/** Preserve the normalized API error fields when converting a thrown mutation into an action result. */
export function toActionFailure(reason: unknown): ActionFailure {
  const error = reason as
    | (Error & {
        status?: number;
        code?: string;
        body?: { error?: { details?: ErrorResponse["error"]["details"] } };
      })
    | null;
  return {
    success: false,
    error: error instanceof Error ? error.message : String(reason),
    status: error?.status,
    code: error?.code,
    details: error?.body?.error?.details,
  };
}

export function actionFailureFromApiError(error: ErrorResponse["error"]): ActionFailure {
  return {
    success: false,
    error: error.message,
    status: error.status,
    code: error.code,
    details: error.details,
  };
}

export function parseApiError(status: number, body: unknown): ErrorResponse["error"] {
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
 * A thrown/rejected call expressed as an `{ error }` union, so a caller that
 * awaits a query directly can render an error state instead of unwinding the
 * render (status 0 = the request never produced an HTTP answer).
 */
export function toErrorResponse(reason: unknown): ErrorResponse {
  const message = reason instanceof Error ? reason.message : String(reason);
  const failure = reason as { status?: number; code?: string } | null;
  return {
    error: {
      status: failure?.status ?? 0,
      code: failure?.code ?? "UNKNOWN_ERROR",
      message,
    },
  };
}
