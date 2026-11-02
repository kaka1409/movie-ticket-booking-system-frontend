import { cache } from "react";
import { apiFetch, apiMutation, settleApiResponse, withLang, type ApiResponse } from "@/libs/api";
import { REVIEW_FILTER_FALLBACK as FILTERS, REVIEWS_PAGE_SIZE } from "./constants";
import type {
  FilterKey,
  MyReviewsResponse,
  ReviewFilter,
  ReviewSort,
  MyReview,
  ReviewsResponse,
  ReviewVote,
  ReviewVoteMap,
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

/** First movie-review page shared by the mobile, desktop, and JSON-LD readers. */
export const getMovieReviews = cache(
  (movieSlug: string, locale: "en" | "vn"): Promise<ApiResponse<ReviewsResponse>> =>
    settleApiResponse(
      getReviews({ movieSlug, skip: 0, limit: REVIEWS_PAGE_SIZE, sort: "recent" }, locale),
    ),
);

/** LIVE - `GET /reviews/votes` — the caller's own votes on one movie (cookie or Bearer). */
export function getMyReviewVotes(
  movieSlug: string,
  cookie?: string,
): Promise<ApiResponse<{ votes: { reviewId: string; value: ReviewVote }[] }>> {
  return apiFetch<{ votes: { reviewId: string; value: ReviewVote }[] }>(
    `/reviews/votes?${new URLSearchParams({ movieSlug }).toString()}`,
    undefined,
    undefined,
    cookie,
  );
}

/**
 * Vote map for the whole movie in one request: the detail list pages client-side,
 * so seeding the map up front keeps the buttons correct on every page. No cookie
 * means no session — the page renders the counts with the vote UI inert.
 */
export const getMovieReviewVotes = cache(
  async (movieSlug: string, cookie: string | undefined): Promise<ReviewVoteMap> => {
    if (!cookie) return {};
    const result = await getMyReviewVotes(movieSlug, cookie);
    if ("error" in result) return {};

    const votes: ReviewVoteMap = {};
    for (const vote of result.data.votes) votes[vote.reviewId] = vote.value;
    return votes;
  },
);

/** Localized sort labels for the detail page, one backend read per request. */
export const getMovieReviewFilters = cache((locale: "en" | "vn"): Promise<ReviewFilter[]> =>
  getReviewFilters(locale),
);

export interface MyReviewsOverview {
  reviews: MyReview[];
  total: number;
  filters: Awaited<ReturnType<typeof getReviewFilters>>;
}

/** Cached profile review feed shared by the mobile and desktop trees. */
export const getMyReviewsOverview = cache(
  async (cookie: string | undefined, locale: "en" | "vn"): Promise<MyReviewsOverview> => {
    const [reviewsResult, filters] = await Promise.all([
      getMyReviews({ skip: 0, limit: 10, sort: "recent" }, cookie, locale),
      getReviewFilters(locale),
    ]);
    const initial = "error" in reviewsResult ? { reviews: [], total: 0 } : reviewsResult.data;
    return { reviews: initial.reviews, total: initial.total, filters };
  },
);
