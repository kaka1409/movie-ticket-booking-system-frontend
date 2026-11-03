import CinemaAdopt from "@/app/(sub)/booking/components/adopters/CinemaAdopter";
import SectionFallback from "@/components/ui/SectionFallback";
import type { getShowtimeDates, getShowtimes } from "@/features/showtimes/api";
import type { ShowtimeDateOption, ShowtimesResponse } from "@/features/showtimes/types";
import type { Movie } from "@/features/movies/types";
import { toCinemas, toDateOptions } from "@/features/booking/utils/cinema";
import CinemaList from "./components/mobile/CinemaList";
import DatePickerWrapper from "./components/shared/DatePickerWrapper";
import SearchBar from "./components/mobile/SearchBar";

type DatesPromise = ReturnType<typeof getShowtimeDates>;
type ShowtimesPromise = ReturnType<typeof getShowtimes>;
type ResolvedSchedule = {
  datesResult: Awaited<DatesPromise>;
  date: string;
  showtimesResult: Awaited<ShowtimesPromise>;
};

type CinemaDatesProps = {
  datesPromise: DatesPromise;
  today: string;
  locale: "en" | "vn";
};

/** Streams the date strip from its endpoint independently of the cinema slots. */
export async function CinemaDatesSection({ datesPromise, today, locale }: CinemaDatesProps) {
  const result = await datesPromise;
  if ("error" in result) {
    if (result.error.status === 401) return null;
    return <SectionFallback error={result.error} />;
  }

  return <DatePickerWrapper dates={toDateOptions(result.data, today, locale)} />;
}

/** Streams the selected day's cinema and showtime groups. */
export async function CinemaSlotsSection({
  schedulePromise,
}: {
  schedulePromise: Promise<ResolvedSchedule>;
}) {
  const { showtimesResult } = await schedulePromise;
  if ("error" in showtimesResult) {
    if (showtimesResult.error.status === 401) return null;
    return <SectionFallback error={showtimesResult.error} />;
  }

  return (
    <>
      <SearchBar />
      <CinemaList cinemas={toCinemas(showtimesResult.data.cinemas)} />
    </>
  );
}

/** Adopts the deep link once; the same endpoint promises feed the visible sections. */
export async function CinemaAdoptSection({
  movie,
  schedulePromise,
  initialCinemaId,
  initialTime,
  initialShowtimeId,
  today,
  locale,
}: {
  movie: Movie;
  schedulePromise: Promise<ResolvedSchedule>;
  initialCinemaId: string | null;
  initialTime: string;
  initialShowtimeId: string | null;
  today: string;
  locale: "en" | "vn";
}) {
  const { datesResult, date, showtimesResult } = await schedulePromise;
  const dates: ShowtimeDateOption[] = "error" in datesResult ? [] : datesResult.data;
  const cinemas: ShowtimesResponse["cinemas"] =
    "error" in showtimesResult ? [] : showtimesResult.data.cinemas;

  return (
    <CinemaAdopt
      movie={movie}
      cinemas={toCinemas(cinemas)}
      dates={toDateOptions(dates, today, locale)}
      initialCinemaId={initialCinemaId}
      initialTime={initialTime}
      initialDate={date}
      initialShowtimeId={initialShowtimeId}
    />
  );
}