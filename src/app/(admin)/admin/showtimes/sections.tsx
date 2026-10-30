import AdminDataError from "@/app/(admin)/admin/components/shared/AdminDataError";
import {
  getAdminMovies,
  getAdminShowtimeBoard,
  getAdminCinemas,
  getAdminCatalog,
} from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import { todayInCinemaZone } from "@/libs/date";
import type { AdminCatalogEntry } from "@/features/admin/types";
import ShowtimesManager from "./components/ShowtimesManager";

export interface AdminShowtimesQuery {
  movie: string;
  date: string;
}

export async function ShowtimesManagerSection({ movie, date }: AdminShowtimesQuery) {
  const [moviesResult, cinemasResult, formatsResult] = await Promise.all([
    getAdminMovies({ page: 1, limit: 100 }),
    getAdminCinemas(),
    getAdminCatalog("formats"),
  ]);

  if (
    isUnauthorizedResult(moviesResult) ||
    isUnauthorizedResult(cinemasResult) ||
    isUnauthorizedResult(formatsResult)
  ) {
    return null;
  }
  if ("error" in moviesResult) return <AdminDataError message={moviesResult.error.message} />;
  if ("error" in cinemasResult) return <AdminDataError message={cinemasResult.error.message} />;
  if ("error" in formatsResult) return <AdminDataError message={formatsResult.error.message} />;

  const movies = moviesResult.data.movies;
  const resolvedMovie = movie || movies[0]?.slug || "";
  // Showtime `date` is cinema wall clock, so the default day must be too.
  const resolvedDate = date || todayInCinemaZone();

  let board = null;
  if (resolvedMovie) {
    const boardResult = await getAdminShowtimeBoard({
      movieSlug: resolvedMovie,
      date: resolvedDate,
    });
    if (isUnauthorizedResult(boardResult)) return null;
    if ("error" in boardResult) return <AdminDataError message={boardResult.error.message} />;
    board = boardResult.data;
  }

  const formats: AdminCatalogEntry[] = formatsResult.data;

  return (
    <ShowtimesManager
      movies={movies}
      cinemas={cinemasResult.data}
      formats={formats}
      board={board}
      movie={resolvedMovie}
      date={resolvedDate}
    />
  );
}
