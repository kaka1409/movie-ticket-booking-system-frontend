import CinemaAdopt from "@/features/booking/components/CinemaAdopt";
import SectionFallback from "@/components/ui/SectionFallback";
import { getMovieSchedule } from "@/features/showtimes/detail";
import type { Movie } from "@/features/movies/types";
import { toCinemas, toDateOptions } from "./adapters";
import CinemaList from "./components/mobile/CinemaList";
import DatePickerWrapper from "./components/mobile/DatePickerWrapper";
import SearchBar from "./components/mobile/SearchBar";

type CinemaScheduleProps = {
  slug: string;
  locale: "en" | "vn";
  today: string;
  requestedDate: string;
};

/** One resolved day + its slot groups, adapted to the booking step's shapes. */
async function loadCinemaSchedule({ slug, locale, today, requestedDate }: CinemaScheduleProps) {
  const schedule = await getMovieSchedule(slug, locale, today, requestedDate);

  return {
    dates: toDateOptions(schedule.dates, today, locale),
    cinemas: toCinemas(schedule.cinemas),
    date: schedule.date,
    error: schedule.error,
  };
}

/**
 * Day strip, search and cinema cards. Both device trees render this section in
 * their own boundary (different DOM positions, each can land on its own), and
 * the schedule read behind it is memoized, so the pair costs one round trip.
 */
export async function CinemaScheduleSection(props: CinemaScheduleProps) {
  const { dates, cinemas, error } = await loadCinemaSchedule(props);

  if (error)
    return <SectionFallback error={{ status: 0, code: "UNKNOWN_ERROR", message: error }} />;

  return (
    <>
      <DatePickerWrapper dates={dates} />
      <SearchBar />
      <CinemaList cinemas={cinemas} />
    </>
  );
}

/**
 * Effect-only adoption of the deep link into the booking draft, mounted once at
 * page level. It renders nothing, so it streams in a `fallback={null}` boundary
 * instead of holding the step body back.
 */
export async function CinemaAdoptSection({
  movie,
  initialCinemaId,
  initialTime,
  initialShowtimeId,
  ...scheduleProps
}: CinemaScheduleProps & {
  movie: Movie;
  initialCinemaId: string | null;
  initialTime: string;
  initialShowtimeId: string | null;
}) {
  const { dates, cinemas, date } = await loadCinemaSchedule(scheduleProps);

  return (
    <CinemaAdopt
      movie={movie}
      cinemas={cinemas}
      dates={dates}
      initialCinemaId={initialCinemaId}
      initialTime={initialTime}
      initialDate={date}
      initialShowtimeId={initialShowtimeId}
    />
  );
}
