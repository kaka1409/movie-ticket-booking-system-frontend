import { cache } from "react";
import { settleApiResponse } from "@/libs/api";
import { getFeaturedMovies, getMovies } from "./api";
import { MOVIES_PAGE_SIZE } from "./constants";

/**
 * Per-request memoized feeds for the home page.
 *
 * Every home section renders in its own Suspense boundary, so the now-showing
 * list alone has four independent consumers (quick-booking shell, desktop grid,
 * "For You", mobile row). Without `cache()` each boundary would fetch its own
 * copy; the key is the locale, so a cookie flip still refetches.
 */
export const getHomeFeaturedMovies = cache((locale: "en" | "vn") =>
  settleApiResponse(getFeaturedMovies(locale)),
);

export const getHomeNowShowingMovies = cache((locale: "en" | "vn") =>
  settleApiResponse(getMovies({ status: "now_showing", page: 1, limit: MOVIES_PAGE_SIZE }, locale)),
);

export const getHomeComingSoonMovies = cache((locale: "en" | "vn") =>
  settleApiResponse(getMovies({ status: "coming_soon", page: 1, limit: MOVIES_PAGE_SIZE }, locale)),
);
