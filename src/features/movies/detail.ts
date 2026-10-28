import { cache } from "react";
import { settleApiResponse } from "@/libs/api";
import { getRelatedMovies } from "./api";
import { RECOMMENDED_LIMIT } from "./constants";

/**
 * Per-request memoized related-movies feed for the movie detail page. Both the
 * mobile and the desktop block read it, so `cache()` keeps them at one call.
 */
export const getMovieRecommendations = cache(
  (movieSlug: string, locale: "en" | "vn") =>
    settleApiResponse(getRelatedMovies(movieSlug, locale, RECOMMENDED_LIMIT)),
);