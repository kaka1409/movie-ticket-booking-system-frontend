import { apiFetch, type ApiResponse } from "@/libs/api";
import { FILTERS } from "./mock";
import type { FilterKey, ReviewFilter, ReviewSort, ReviewsResponse } from "./types";

export async function getReviewFilters(): Promise<ReviewFilter[]> {
  const result = await apiFetch<ReviewFilter[]>("/reviews/filters");
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

  return apiFetch<ReviewsResponse>(`/reviews?${query.toString()}`);
}

export type { FilterKey };
