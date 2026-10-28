import { cache } from "react";
import { getMyReviews, getReviewFilters } from "./api";
import type { MyReview } from "./types";

export interface MyReviewsOverview {
  reviews: MyReview[];
  total: number;
  filters: Awaited<ReturnType<typeof getReviewFilters>>;
}

/**
 * One memoized read for the `/profile/reviews` page: the user's first page of
 * reviews and the filter catalog land in a single `Promise.all`. Wrapped in
 * `cache()` so the mobile + desktop trees share one backend call.
 */
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