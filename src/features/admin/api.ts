import { apiFetch, type ApiResponse } from "@/libs/api";
import { getRequestCookie } from "@/libs/session";
import type {
  AdminCatalogEntry,
  AdminCatalogKind,
  AdminCinema,
  AdminCombo,
  AdminFoodItem,
  AdminMovie,
  AdminMovieCounts,
  AdminMovieStatus,
  AdminPaginationMeta,
  AdminPaymentMethod,
  AdminReview,
  AdminShowtimeBoard,
  AdminUser,
  AdminUserRole,
  MovieResearchCandidate,
  MovieResearchRun,
} from "./types";

/**
 * Admin reads. Every call runs on the server with the visitor's cookies (the
 * backend authorizes on the RAM access token only for mutations; these GETs are
 * guarded by the refresh cookie the layout already proved) and opts out of the
 * fetch cache — the console must never render a row the operator just saved.
 */
const NO_STORE: RequestInit = { cache: "no-store" };

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query === "" ? "" : `?${query}`;
}

export async function getAdminMovies(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminMovieStatus | "";
}): Promise<ApiResponse<{ movies: AdminMovie[] }, AdminPaginationMeta>> {
  const query = buildQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
    status: params.status,
  });

  const result = await apiFetch<
    { movies: AdminMovie[]; counts: (AdminMovieCounts & { id: string })[] },
    AdminPaginationMeta
  >(`/movies/list${query}`, NO_STORE, undefined, await getRequestCookie());

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

export async function getMovieResearchCandidates(status?: string) {
  return apiFetch<MovieResearchCandidate[]>(
    `/movie-research/candidates${buildQuery({ status })}`,
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

export async function getMovieResearchRuns() {
  return apiFetch<MovieResearchRun[]>(
    "/movie-research/runs",
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

/** Usage counts differ per catalog; the screens only ever need "is it used". */
export async function getAdminCatalog(
  kind: AdminCatalogKind,
): Promise<ApiResponse<AdminCatalogEntry[]>> {
  const result = await apiFetch<
    (AdminCatalogEntry & { movieCount?: number; showtimeCount?: number })[]
  >(`/${kind}/admin`, NO_STORE, undefined, await getRequestCookie());

  if ("error" in result) return result;

  return {
    data: result.data.map((row) => ({
      id: row.id,
      name: row.name,
      nameVi: row.nameVi ?? null,
      sortOrder: row.sortOrder,
      isActive: row.isActive,
      usageCount: row.movieCount ?? row.showtimeCount ?? 0,
    })),
  };
}

export async function getAdminCinemas(): Promise<ApiResponse<AdminCinema[]>> {
  return apiFetch<AdminCinema[]>("/cinemas/admin", NO_STORE, undefined, await getRequestCookie());
}

export async function getAdminShowtimeBoard(params: {
  movieSlug: string;
  date: string;
}): Promise<ApiResponse<AdminShowtimeBoard>> {
  return apiFetch<AdminShowtimeBoard>(
    `/showtimes${buildQuery({ movieSlug: params.movieSlug, date: params.date })}`,
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

export async function getAdminFoodItems(): Promise<ApiResponse<AdminFoodItem[]>> {
  return apiFetch<AdminFoodItem[]>(
    "/food-items/admin",
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

export async function getAdminCombos(): Promise<ApiResponse<AdminCombo[]>> {
  return apiFetch<AdminCombo[]>("/combos/admin", NO_STORE, undefined, await getRequestCookie());
}

export async function getAdminUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: AdminUserRole | "";
}): Promise<ApiResponse<{ users: AdminUser[] }, AdminPaginationMeta>> {
  return apiFetch<{ users: AdminUser[] }, AdminPaginationMeta>(
    `/user/list${buildQuery({
      page: params.page,
      limit: params.limit,
      search: params.search,
      role: params.role,
    })}`,
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

export async function getAdminPaymentMethods(): Promise<ApiResponse<AdminPaymentMethod[]>> {
  return apiFetch<AdminPaymentMethod[]>(
    "/payment-methods/all",
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

/** Soft-deleted reviews only — the live ones stay on the public movie page. */
export async function getAdminDeletedReviews(params: {
  skip?: number;
  limit?: number;
  lang: "en" | "vn";
}): Promise<ApiResponse<{ reviews: AdminReview[]; total: number }>> {
  return apiFetch<{ reviews: AdminReview[]; total: number }>(
    `/reviews/deleted${buildQuery({ skip: params.skip, limit: params.limit, lang: params.lang })}`,
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}
