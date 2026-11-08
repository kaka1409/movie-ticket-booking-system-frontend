import AdminDataError from "@/app/(admin)/admin/components/shared/AdminDataError";
import { getAdminMovies, getAdminCatalog } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import type {
  AdminCatalogEntry,
  AdminMovieFeaturedState,
  AdminMovieStatus,
} from "@/features/admin/types";
import MoviesManager from "./components/MoviesManager";

/** The query the page resolved from `searchParams`. */
export interface AdminMoviesQuery {
  search: string;
  status: AdminMovieStatus | "";
  genres: string;
  ageRating: string;
  releaseFrom: string;
  releaseTo: string;
  featuredState: AdminMovieFeaturedState | "";
  sort: string;
  dir: string;
  page: number;
}

/**
 * Movie list + the two filter catalogs, behind one boundary. The page header
 * paints first; a revoked session renders nothing (the console layout prompts).
 */
export async function MoviesManagerSection({
  search,
  status,
  genres: genreFilter,
  ageRating,
  releaseFrom,
  releaseTo,
  featuredState,
  sort,
  dir,
  page,
}: AdminMoviesQuery) {
  const [moviesResult, genresResult, ageRatingsResult] = await Promise.all([
    getAdminMovies({
      page,
      search,
      status,
      genres: genreFilter,
      ageRating,
      releaseFrom,
      releaseTo,
      featuredState,
      sort,
      dir: dir === "asc" ? "asc" : "desc",
    }),
    getAdminCatalog("genres"),
    getAdminCatalog("age-ratings"),
  ]);

  // Narrowed one result at a time: a shared array would erase both the row type
  // and the `meta` envelope, since the three reads answer different payloads.
  if (
    isUnauthorizedResult(moviesResult) ||
    isUnauthorizedResult(genresResult) ||
    isUnauthorizedResult(ageRatingsResult)
  ) {
    return null;
  }

  if ("error" in moviesResult) return <AdminDataError message={moviesResult.error.message} />;
  if ("error" in genresResult) return <AdminDataError message={genresResult.error.message} />;
  if ("error" in ageRatingsResult) {
    return <AdminDataError message={ageRatingsResult.error.message} />;
  }

  const genres: AdminCatalogEntry[] = genresResult.data;
  const ageRatings: AdminCatalogEntry[] = ageRatingsResult.data;

  return (
    // Client state (unapplied filter edits, open dialogs) must not survive a
    // committed-filter navigation, so the manager remounts when they change.
    <MoviesManager
      key={[
        search,
        status,
        genreFilter,
        ageRating,
        releaseFrom,
        releaseTo,
        featuredState,
        sort,
        dir,
      ].join("|")}
      movies={moviesResult.data.movies}
      pagination={moviesResult.meta}
      genres={genres}
      ageRatings={ageRatings}
      search={search}
      status={status}
      genre={genreFilter}
      ageRating={ageRating}
      releaseFrom={releaseFrom}
      releaseTo={releaseTo}
      featuredState={featuredState}
      sort={sort}
      dir={dir}
    />
  );
}
