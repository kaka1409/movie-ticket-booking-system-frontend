import { notFound } from "next/navigation";
import { getMovieDetail } from "@/features/movies/api";
import { getShowtimeDates, getShowtimes } from "@/features/showtimes/api";
import type { ShowtimeDateOption, ShowtimesResponse } from "@/features/showtimes/types";
import { CinemaSelectionProvider } from "@/features/booking/contexts/CinemaSelectionContext";
import type { Cinema, DateOption } from "@/features/booking/types";
import SectionFallback from "@/components/ui/SectionFallback";

// Shared
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";

// Local mobile
import MovieSummary from "./components/mobile/MovieSummary";
import DatePickerWrapper from "./components/mobile/DatePickerWrapper";
import SearchBar from "./components/mobile/SearchBar";
import CinemaList from "./components/mobile/CinemaList";
import BottomBar from "./components/mobile/BottomBar";

// Desktop
import DesktopCinemaContent from "./components/desktop/CinemaContent";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function todayISO(): string {
  return new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

/* Backend returns one record per date that has showtimes. */
function toDateOptions(records: ShowtimeDateOption[], today: string): DateOption[] {
  return records.map((record) => {
    const [year, month, day] = record.date.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);

    return {
      value: record.date,
      day: record.day,
      month: parsed.toLocaleDateString("en", { month: "short" }).toUpperCase(),
      weekday: record.date === today ? "TODAY" : record.dayOfWeek.toUpperCase(),
    };
  });
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
  const movieResult = await getMovieDetail(slug);

  if ("error" in movieResult) {
    if (movieResult.error.status === 404) notFound();

    return (
      <div className="min-h-dvh bg-(--color-bg) py-10">
        <SectionFallback error={movieResult.error} />
      </div>
    );
  }

  const movie = movieResult.data;
  const today = todayISO();

  const datesResult = await getShowtimeDates(slug);
  const dates = "error" in datesResult ? [] : toDateOptions(datesResult.data, today);
  const resolvedDate =
    query.date && DATE_PATTERN.test(query.date) ? query.date : (dates[0]?.value ?? today);

  const showtimesResult = await getShowtimes(slug, resolvedDate);
  const cinemas = "error" in showtimesResult ? [] : toCinemas(showtimesResult.data.cinemas);

  return (
    <CinemaSelectionProvider
      cinemas={cinemas}
      dates={dates}
      initialCinemaId={query.cinema ?? null}
      initialTime={query.time ?? ""}
      initialDate={resolvedDate}
      initialShowtimeId={query.showtimeId ?? null}
    >
      {/* Mobile */}
      <div className="block md:hidden">
        <StepBar current={1} />
        <div className="flex flex-col gap-4 px-4 py-6 pb-12">
          <MovieSummary movie={movie} />
          <DatePickerWrapper />
          <SearchBar />
          <CinemaList />
        </div>
        <BottomBar movieSlug={slug} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopCinemaContent />
      </div>
    </CinemaSelectionProvider>
  );
}
