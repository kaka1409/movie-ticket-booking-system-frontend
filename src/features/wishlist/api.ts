import { apiFetch, apiMutation, withLang, type ApiResponse, type ErrorResponse } from "@/libs/api";
import type { WishlistItem } from "./types";

/** LIVE - `GET /wishlist?lang=` (contract §5) — newest first with movie cards. */
export function getWishlist(
  cookie?: string,
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<WishlistItem[]>> {
  return apiFetch<WishlistItem[]>(withLang("/wishlist", locale), undefined, undefined, cookie);
}

/** Convert an `apiMutation` throw into the `{ error }` union arm (seat-holds precedent). */
function toErrorUnion(error: unknown): ErrorResponse {
  const failure = error as Error & { status?: number; code?: string };
  return {
    error: {
      status: failure.status ?? 0,
      code: failure.code ?? "UNKNOWN_ERROR",
      message: failure.message,
    },
  };
}

/* ─── Client-interactive writes (LIVE) ───────────────────
   Like the seat-hold calls, wishlist toggles attach the RAM-only Bearer
   token here in the browser so the token never reaches the Next.js server.
   They never reject — failures come back as the `{ error }` union arm and
   the context rolls the optimistic update back. */

/** LIVE - `POST /wishlist/:movieId` (contract §5) — a 409 only races a double-tap, so callers treat it as already-liked. */
export async function addWishlist(
  movieId: string,
  token: string,
): Promise<ApiResponse<WishlistItem>> {
  try {
    return await apiMutation<ApiResponse<WishlistItem>>(
      `/wishlist/${encodeURIComponent(movieId)}`,
      { method: "POST" },
      token,
    );
  } catch (error) {
    return toErrorUnion(error);
  }
}

/** LIVE - `DELETE /wishlist/:movieId` (contract §5). */
export async function removeWishlist(
  movieId: string,
  token: string,
): Promise<ApiResponse<{ movieId: string; deleted: boolean }>> {
  try {
    return await apiMutation<ApiResponse<{ movieId: string; deleted: boolean }>>(
      `/wishlist/${encodeURIComponent(movieId)}`,
      { method: "DELETE" },
      token,
    );
  } catch (error) {
    return toErrorUnion(error);
  }
}
