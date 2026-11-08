import { apiFetch, type ApiResponse } from "@/libs/api";
import type {
  AdminPaginationMeta,
  AdminReview,
  AdminReviewStatusFilter,
} from "../types";
import { ADMIN_NO_STORE, adminCookie, buildAdminQuery } from "./shared";

/**
 * Admin review table (`GET /admin/reviews`): every review — live and
 * soft-deleted — with author/movie cards, paginated like `/admin/users`.
 */
export async function getAdminReviews(params: {
  page?: number;
  limit?: number;
  search?: string;
  movieSlug?: string;
  userId?: string;
  rating?: number | "";
  status?: AdminReviewStatusFilter | "";
  sort?: string;
  /** Header-column sort; `sort` keeps the preset ranking from the filter card. */
  sortBy?: string;
  dir?: "asc" | "desc";
  lang: "en" | "vn";
}): Promise<ApiResponse<{ reviews: AdminReview[] }, AdminPaginationMeta>> {
  return apiFetch<{ reviews: AdminReview[] }, AdminPaginationMeta>(
    `/admin/reviews${buildAdminQuery({
      page: params.page,
      limit: params.limit,
      search: params.search,
      movieSlug: params.movieSlug,
      userId: params.userId,
      rating: params.rating === "" ? undefined : params.rating,
      status: params.status,
      sort: params.sort,
      sortBy: params.sortBy,
      dir: params.dir,
      lang: params.lang,
    })}`,
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}
