import { apiFetch, type ApiResponse } from "@/libs/api";
import type {
  AdminMovie,
  AdminMovieCounts,
  AdminMovieFeaturedState,
  AdminMovieStatus,
  AdminPaginationMeta,
} from "../types";
import { ADMIN_NO_STORE, adminCookie, buildAdminQuery } from "./shared";

export async function getAdminMovies(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminMovieStatus | "";
  genres?: string;
  ageRating?: string;
  releaseFrom?: string;
  releaseTo?: string;
  featuredState?: AdminMovieFeaturedState | "";
  sort?: string;
  dir?: "asc" | "desc";
}): Promise<ApiResponse<{ movies: AdminMovie[] }, AdminPaginationMeta>> {
  const query = buildAdminQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
    status: params.status,
    genres: params.genres,
    ageRating: params.ageRating,
    releaseFrom: params.releaseFrom,
    releaseTo: params.releaseTo,
    featuredState: params.featuredState,
    sort: params.sort,
    dir: params.dir,
  });

  const result = await apiFetch<
    { movies: AdminMovie[]; counts: (AdminMovieCounts & { id: string })[] },
    AdminPaginationMeta
  >(`/admin/movies${query}`, ADMIN_NO_STORE, undefined, await adminCookie());

  if ("error" in result) return result;

  const countsById = new Map(result.data.counts.map((row) => [row.id, row]));
  return {
    data: {
      movies: result.data.movies.map((movie) => {
        const counts = countsById.get(movie.id);
        return counts
          ? {
              ...movie,
              counts: {
                showtimes: counts.showtimes,
                reviews: counts.reviews,
                wishlists: counts.wishlists,
              },
            }
          : movie;
      }),
    },
    meta: result.meta,
  };
}
