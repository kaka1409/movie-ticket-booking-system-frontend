import { cache } from "react";
import { settleApiResponse } from "@/libs/api";
import type { ApiResponse } from "@/libs/api";
import { getReviews } from "./api";
import { REVIEWS_PAGE_SIZE } from "./constants";
import type { ReviewsResponse } from "./types";

/**
 * First review page of a movie. Three readers share it — the mobile block, the
 * desktop block and the JSON-LD tags — so `cache()` keeps them at one call.
 */
export const getMovieReviews = cache(
  (movieSlug: string, locale: "en" | "vn"): Promise<ApiResponse<ReviewsResponse>> =>
    settleApiResponse(
      getReviews({ movieSlug, skip: 0, limit: REVIEWS_PAGE_SIZE, sort: "recent" }, locale),
    ),
);
