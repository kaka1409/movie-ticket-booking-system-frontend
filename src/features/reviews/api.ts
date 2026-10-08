import { apiFetch, type ApiResponse } from "@/libs/api";
import { FILTERS } from "./mock";
import type { FilterKey, ReviewFilter, ReviewSort, ReviewsResponse } from "./types";

/** Tagged so review mutations can invalidate it via `updateTag("reviews")`. */
const REVIEWS_CACHE: RequestInit = { next: { revalidate: 60, tags: ["reviews"] } };

export async function getReviewFilters(): Promise<ReviewFilter[]> {
  const result = await apiFetch<ReviewFilter[]>("/reviews/filters", {
    next: { revalidate: 60 },
  });
  return "error" in result ? [...FILTERS] : result.data;
}

export function getReviews(params: {
  movieSlug: string;
  skip?: number;
  limit?: number;
  sort?: ReviewSort;
}): Promise<ApiResponse<ReviewsResponse>> {
  const query = new URLSearchParams({ movieSlug: params.movieSlug });
  if (params.skip !== undefined) query.set("skip", String(params.skip));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  query.set("sort", params.sort ?? "recent");

  return apiFetch<ReviewsResponse>(`/reviews?${query.toString()}`, REVIEWS_CACHE);
}

export type { FilterKey };
