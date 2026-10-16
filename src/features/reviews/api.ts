import { apiFetch, apiMutation, withLang, type ApiResponse } from "@/libs/api";
import { FILTERS } from "./mock";
import type {
  FilterKey,
  MyReviewsResponse,
  ReviewFilter,
  ReviewSort,
  ReviewsResponse,
} from "./types";

/** Tagged so review mutations can invalidate it via `updateTag("reviews")`. */
const REVIEWS_CACHE: RequestInit = { next: { revalidate: 60, tags: ["reviews"] } };

export async function getReviewFilters(locale: "en" | "vn" = "en"): Promise<ReviewFilter[]> {
  const result = await apiFetch<ReviewFilter[]>(withLang("/reviews/filters", locale), {
    next: { revalidate: 60 },
  });
  return "error" in result ? [...FILTERS] : result.data;
}

export function getReviews(
  params: {
    movieSlug: string;
    skip?: number;
    limit?: number;
    sort?: ReviewSort;
  },
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<ReviewsResponse>> {
  const query = new URLSearchParams({ movieSlug: params.movieSlug });
  if (params.skip !== undefined) query.set("skip", String(params.skip));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  query.set("sort", params.sort ?? "recent");

  return apiFetch<ReviewsResponse>(withLang(`/reviews?${query.toString()}`, locale), REVIEWS_CACHE);
}

export type { FilterKey };

/** LIVE - `GET /reviews/me` — current user's reviews with movie cards (contract §4). */
export function getMyReviews(
  params: { skip?: number; limit?: number; sort?: ReviewSort },
  cookie?: string,
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<MyReviewsResponse>> {
  const query = new URLSearchParams();
  if (params.skip !== undefined) query.set("skip", String(params.skip));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  query.set("sort", params.sort ?? "recent");

  return apiFetch<MyReviewsResponse>(
    withLang(`/reviews/me?${query.toString()}`, locale),
    undefined,
    undefined,
    cookie,
  );
}

/* ─── Client-interactive delete (LIVE) ───────────────────
   Like wishlist toggles, deleting from the profile page attaches the
   RAM-only Bearer token here in the browser. Never rejects — failures come
   back as the `{ error }` union arm so the list can toast + keep the row. */

/** LIVE - `DELETE /reviews/:reviewId` (contract §4) — owner-enforced server-side. */
export async function deleteMyReview(
  reviewId: string,
  token: string,
): Promise<ApiResponse<{ id: string; deleted: boolean }>> {
  try {
    return await apiMutation<ApiResponse<{ id: string; deleted: boolean }>>(
      `/reviews/${encodeURIComponent(reviewId)}`,
      { method: "DELETE" },
      token,
    );
  } catch (error) {
    const failure = error as Error & { status?: number; code?: string };
    return {
      error: {
        status: failure.status ?? 0,
        code: failure.code ?? "UNKNOWN_ERROR",
        message: failure.message,
      },
    };
  }
}
