import type { Metadata } from "next";
import LoginPrompt from "@/components/shared/LoginPrompt";
import AdminDataError from "@/features/admin/components/AdminDataError";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import { getAdminCatalog, getAdminMovies } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import type { AdminCatalogEntry, AdminMovieStatus } from "@/features/admin/types";
import MoviesManager from "./components/MoviesManager";

export const metadata: Metadata = { title: "Movies" };

const STATUSES: AdminMovieStatus[] = ["now_showing", "coming_soon", "ended"];

export default async function AdminMoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const status = STATUSES.find((candidate) => candidate === params.status) ?? "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  const [moviesResult, genresResult, ageRatingsResult] = await Promise.all([
    getAdminMovies({ page, search, status }),
    getAdminCatalog("genres"),
    getAdminCatalog("age-ratings"),
  ]);

  // Each read is narrowed on its own: the three calls answer different payloads,
  // so a shared array loses the envelope's `meta` and the row types.
  if (
    isUnauthorizedResult(moviesResult) ||
    isUnauthorizedResult(genresResult) ||
    isUnauthorizedResult(ageRatingsResult)
  ) {
    return <LoginPrompt />;
  }

  const header = (
    <AdminPageHeader
      eyebrowKey="admin.nav.cinema"
      titleKey="admin.movies.title"
      descriptionKey="admin.movies.description"
    />
  );

  // Narrowed one result at a time: a shared array would erase both the row type
  // and the `meta` envelope, since the three reads answer different payloads.
  if ("error" in moviesResult) {
    return (
      <>
        {header}
        <AdminDataError message={moviesResult.error.message} />
      </>
    );
  }

  if ("error" in genresResult) {
    return (
      <>
        {header}
        <AdminDataError message={genresResult.error.message} />
      </>
    );
  }

  if ("error" in ageRatingsResult) {
    return (
      <>
        {header}
        <AdminDataError message={ageRatingsResult.error.message} />
      </>
    );
  }

  const movies = moviesResult.data.movies;
  const genres: AdminCatalogEntry[] = genresResult.data;
  const ageRatings: AdminCatalogEntry[] = ageRatingsResult.data;

  return (
    <>
      {header}
      <MoviesManager
        movies={movies}
        pagination={moviesResult.meta}
        genres={genres}
        ageRatings={ageRatings}
        search={search}
        status={status}
      />
    </>
  );
}
