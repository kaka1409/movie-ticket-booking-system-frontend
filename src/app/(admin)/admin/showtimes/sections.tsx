import AdminDataError from "@/app/(admin)/admin/components/shared/AdminDataError";
import {
  getAdminMovies,
  getAdminCinemas,
  getAdminCatalog,
  getAdminSchedule,
  getAdminScheduleSummary,
  getAdminSlotTemplates,
} from "@/features/admin/api";
import { todayInCinemaZone } from "@/libs/date";
import type { AdminCatalogEntry } from "@/features/admin/types";
import ShowtimesManager from "./components/ShowtimesManager";

/** Days the date strip covers — one summary read feeds every badge. */
const STRIP_DAYS = 14;

function addDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export interface AdminShowtimesQuery {
  movie: string;
  date: string;
}

export async function ShowtimesManagerSection({ movie, date }: AdminShowtimesQuery) {
  const today = todayInCinemaZone();
  const resolvedDate = date || today;
  const from = today < resolvedDate ? today : resolvedDate;
  const stripDates = Array.from({ length: STRIP_DAYS }, (_, index) => addDays(today, index));
  const to = stripDates[stripDates.length - 1];

  const [moviesResult, cinemasResult, formatsResult, templatesResult, scheduleResult, summaryResult] =
    await Promise.all([
      getAdminMovies({ page: 1, limit: 100 }),
      getAdminCinemas(),
      getAdminCatalog("formats"),
      getAdminSlotTemplates(),
      getAdminSchedule(resolvedDate),
      getAdminScheduleSummary(from, to),
    ]);

  // Each read narrows individually — a single failure fails the whole section.
  for (const result of [
    moviesResult,
    cinemasResult,
    formatsResult,
    templatesResult,
    scheduleResult,
    summaryResult,
  ]) {
    if ("error" in result) {
      if (result.error.status === 401) return null;
      return <AdminDataError message={result.error.message} />;
    }
  }
  if ("error" in moviesResult) return null;
  if ("error" in cinemasResult) return null;
  if ("error" in formatsResult) return null;
  if ("error" in templatesResult) return null;
  if ("error" in scheduleResult) return null;
  if ("error" in summaryResult) return null;

  const formats: AdminCatalogEntry[] = formatsResult.data;

  return (
    <ShowtimesManager
      movies={moviesResult.data.movies}
      cinemas={cinemasResult.data}
      formats={formats}
      templates={templatesResult.data}
      schedule={scheduleResult.data}
      dayCounts={summaryResult.data}
      stripDates={stripDates}
      date={resolvedDate}
      movie={movie}
    />
  );
}
