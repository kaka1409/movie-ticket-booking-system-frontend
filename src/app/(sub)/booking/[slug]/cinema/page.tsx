import { notFound } from "next/navigation";
import { getMovieDetail } from "@/features/movies/api";
import { getShowtimeDates, getShowtimes } from "@/features/showtimes/api";
import { toShowtimeDateChips } from "@/features/showtimes/utils";
import type { ShowtimeDateOption, ShowtimesResponse } from "@/features/showtimes/types";
import { getRequestLocale } from "@/libs/session";
import { todayInCinemaZone } from "@/libs/date";
import enMessages from "@/locales/en.json";
import vnMessages from "@/locales/vn.json";
import CinemaAdopt from "@/features/booking/components/CinemaAdopt";
import type { Cinema, DateOption } from "@/features/booking/types";

// Shared
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import PageError from "@/app/(sub)/booking/components/mobile/PageError";

// Local mobile
import MovieSummary from "./components/mobile/MovieSummary";
import DatePickerWrapper from "./components/mobile/DatePickerWrapper";
import SearchBar from "./components/mobile/SearchBar";
import CinemaList from "./components/mobile/CinemaList";
import BottomBar from "./components/mobile/BottomBar";

// Desktop
import DesktopCinemaContent from "./components/desktop/CinemaContent";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/* Backend returns one record per date that has showtimes. Chips render the
   localized weekday (`dayOfWeek` already arrives in the request locale);
   today's chip shows the translated "today" word instead of the weekday. */
function toDateOptions(
  records: ShowtimeDateOption[],
  today: string,
  locale: "en" | "vn",
): DateOption[] {
  const todayWord = (locale === "vn" ? vnMessages : enMessages).common.today.toUpperCase();
  const byDate = new Map(records.map((record) => [record.date, record]));
  return toShowtimeDateChips(records, locale).map((chip) => ({
    value: chip.value,
    day: byDate.get(chip.value)?.day ?? Number(chip.day),
    month: chip.label,
    weekday: chip.value === today ? todayWord : (chip.weekday ?? ""),
  }));
}

type ShowtimeGroups = ShowtimesResponse["cinemas"];

/* Showtimes arrive already grouped by cinema — adapt them to the booking UI. */
function toCinemas(groups: ShowtimeGroups): Cinema[] {
  return groups.map((group) => ({
    id: group.id,
    name: group.name,
    address: group.address,
    badge: group.badge,
    badgeColor: "",
    showtimes: group.showtimes.map((slot) => ({
      id: slot.id,
      time: slot.startTime,
      room: slot.roomName,
      available: slot.isAvailable,
    })),
  }));
}

export default async function CinemaShowtimePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    cinema?: string;
    time?: string;
    date?: string;
    showtimeId?: string;
  }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = await getRequestLocale();
  const movieResult = await getMovieDetail(slug, locale);

  if ("error" in movieResult) {
    if (movieResult.error.status === 404) notFound();

    return <PageError error={movieResult.error} />;
  }

  const movie = movieResult.data;
  const today = todayInCinemaZone();

  const datesResult = await getShowtimeDates(slug, locale);
  const dates = "error" in datesResult ? [] : toDateOptions(datesResult.data, today, locale);
  const resolvedDate =
    query.date && DATE_PATTERN.test(query.date) ? query.date : (dates[0]?.value ?? today);

  const showtimesResult = await getShowtimes(slug, resolvedDate);
  const cinemas = "error" in showtimesResult ? [] : toCinemas(showtimesResult.data.cinemas);

  return (
    <>
      <CinemaAdopt
        movie={movie}
        cinemas={cinemas}
        dates={dates}
        initialCinemaId={query.cinema ?? null}
        initialTime={query.time ?? ""}
        initialDate={resolvedDate}
        initialShowtimeId={query.showtimeId ?? null}
      />

      {/* Mobile */}
      <div className="block md:hidden">
        <StepBar current={1} />
        <div className="flex flex-col gap-4 px-4 py-6 pb-12">
          <MovieSummary movie={movie} />
          <DatePickerWrapper dates={dates} />
          <SearchBar />
          <CinemaList cinemas={cinemas} />
        </div>
        <BottomBar movieSlug={slug} cinemas={cinemas} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopCinemaContent movieSlug={slug} cinemas={cinemas} dates={dates} />
      </div>
    </>
  );
}
