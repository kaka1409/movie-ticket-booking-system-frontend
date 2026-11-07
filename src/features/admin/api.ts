import { apiFetch, type ApiResponse } from "@/libs/api";
import { getRequestCookie } from "@/libs/session";
import type {
  AdminBookingStatus,
  AdminCatalogEntry,
  AdminCatalogKind,
  AdminCinema,
  AdminCombo,
  AdminFoodItem,
  AdminMovie,
  AdminMovieCounts,
  AdminMovieFeaturedState,
  AdminMovieStatus,
  AdminPaginationMeta,
  AdminPaymentMethod,
  AdminPaymentMethodCode,
  AdminPaymentStatus,
  AdminReview,
  AdminShowtimeBoard,
  AdminTicket,
  AdminTicketDetail,
  AdminTicketStatus,
  AdminTransaction,
  AdminTransactionDetail,
  AdminUser,
  AdminUserRole,
  AdminUserStatus,
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
  genres?: string;
  ageRating?: string;
  releaseFrom?: string;
  releaseTo?: string;
  featuredState?: AdminMovieFeaturedState | "";
}): Promise<ApiResponse<{ movies: AdminMovie[] }, AdminPaginationMeta>> {
  const query = buildQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
    status: params.status,
    genres: params.genres,
    ageRating: params.ageRating,
    releaseFrom: params.releaseFrom,
    releaseTo: params.releaseTo,
    featuredState: params.featuredState,
  });

  const result = await apiFetch<
    { movies: AdminMovie[]; counts: (AdminMovieCounts & { id: string })[] },
    AdminPaginationMeta
  >(`/admin/movies${query}`, NO_STORE, undefined, await getRequestCookie());

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
    `/admin/movie-research/candidates${buildQuery({ status })}`,
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

export async function getMovieResearchRuns() {
  return apiFetch<MovieResearchRun[]>(
    "/admin/movie-research/runs",
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
  >(`/admin/${kind}`, NO_STORE, undefined, await getRequestCookie());

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
  return apiFetch<AdminCinema[]>("/admin/cinemas", NO_STORE, undefined, await getRequestCookie());
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
    "/admin/food-items",
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

export async function getAdminCombos(): Promise<ApiResponse<AdminCombo[]>> {
  return apiFetch<AdminCombo[]>("/admin/combos", NO_STORE, undefined, await getRequestCookie());
}

export async function getAdminUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: AdminUserRole | "";
  status?: AdminUserStatus | "";
}): Promise<ApiResponse<{ users: AdminUser[] }, AdminPaginationMeta>> {
  return apiFetch<{ users: AdminUser[] }, AdminPaginationMeta>(
    `/admin/users${buildQuery({
      page: params.page,
      limit: params.limit,
      search: params.search,
      role: params.role,
      status: params.status,
    })}`,
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

export async function getAdminPaymentMethods(): Promise<ApiResponse<AdminPaymentMethod[]>> {
  return apiFetch<AdminPaymentMethod[]>(
    "/admin/payment-methods",
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

export type AdminReviewStatusFilter = "all" | "live" | "deleted";

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
  lang: "en" | "vn";
}): Promise<ApiResponse<{ reviews: AdminReview[] }, AdminPaginationMeta>> {
  return apiFetch<{ reviews: AdminReview[] }, AdminPaginationMeta>(
    `/admin/reviews${buildQuery({
      page: params.page,
      limit: params.limit,
      search: params.search,
      movieSlug: params.movieSlug,
      userId: params.userId,
      rating: params.rating === "" ? undefined : params.rating,
      status: params.status,
      sort: params.sort,
      lang: params.lang,
    })}`,
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

/* ── Transactions ─────────────────────────────────────────────────────────── */

export interface AdminTransactionQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminBookingStatus | "";
  paymentStatus?: AdminPaymentStatus | "";
  paymentMethod?: AdminPaymentMethodCode | "";
  dateFrom?: string;
  dateTo?: string;
}

/** Admin transaction table (`GET /admin/transactions`). */
export async function getAdminTransactions(params: AdminTransactionQuery) {
  return apiFetch<{ transactions: AdminTransaction[] }, AdminPaginationMeta>(
    `/admin/transactions${buildQuery({
      page: params.page,
      limit: params.limit,
      search: params.search,
      status: params.status,
      paymentStatus: params.paymentStatus,
      paymentMethod: params.paymentMethod,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    })}`,
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

/** Admin transaction detail (`GET /admin/transactions/:id`). */
export async function getAdminTransactionDetail(id: string) {
  return apiFetch<AdminTransactionDetail>(
    `/admin/transactions/${id}`,
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

/* ── Tickets ──────────────────────────────────────────────────────────────── */

export interface AdminTicketQuery {
  page?: number;
  limit?: number;
  ownerSearch?: string;
  status?: AdminTicketStatus | "";
  dateFrom?: string;
  dateTo?: string;
}

/** Admin ticket table (`GET /admin/tickets`). */
export async function getAdminTickets(params: AdminTicketQuery) {
  return apiFetch<{ tickets: AdminTicket[] }, AdminPaginationMeta>(
    `/admin/tickets${buildQuery({
      page: params.page,
      limit: params.limit,
      ownerSearch: params.ownerSearch,
      status: params.status,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    })}`,
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}

/** Admin ticket detail (`GET /admin/tickets/:id`) — no QR credential. */
export async function getAdminTicketDetail(id: string) {
  return apiFetch<AdminTicketDetail>(
    `/admin/tickets/${id}`,
    NO_STORE,
    undefined,
    await getRequestCookie(),
  );
}
