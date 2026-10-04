import { getMovieDetail } from "@/features/movies/api";
import { getShowtimeDates, getShowtimes } from "@/features/showtimes/api";
import { DATE_STRIP_DAYS } from "@/features/showtimes/constants";
import type { ShowtimeDateOption } from "@/features/showtimes/types";
import { getReviews } from "@/features/reviews/api";
import SectionFallback from "@/components/ui/SectionFallback";
import { REVIEWS_PAGE_SIZE } from "@/features/reviews/constants";
import { MovieDetailProvider, MovieSelectionProvider } from "@/features/movies/context";

// Mobile
import MobileHeroSection from "./components/mobile/HeroSection";
import MobileSynopsis from "./components/mobile/Synopsis";
import MobileTopCast from "./components/mobile/TopCast";
import MobileShowtimes from "./components/mobile/Showtimes";
import MobileBookTicketCTA from "./components/mobile/BookTicketCTA";
import MobileReviews from "./components/mobile/Reviews";
import MobileMovieNotFound from "./components/mobile/MovieNotFound";

// Desktop
import DesktopMovieDetail from "./components/desktop/MovieDetailDesktop";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function formatISODate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function shiftISODate(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  return formatISODate(new Date(year, month - 1, day + days));
}

function todayISO(): string {
  return new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

/* Backend only returns the upcoming dates that actually have showtimes. */
function toAvailableDates(records: ShowtimeDateOption[]): string[] {
  return records.filter((record) => record.hasShowtimes).map((record) => record.date);
}

/* Prefer a date that really has showtimes (from the API). Only when the API
   gives us nothing do we fall back to the local window, so the strip is never
   empty and a stale `?date=` param can never point at a day without sessions. */
function resolveDate(param: string | undefined, availableDates: string[], today: string): string {
  if (availableDates.length > 0) {
    if (param && availableDates.includes(param)) return param;
    /* Keep the current day when it is on the list, otherwise jump to the first. */
    return availableDates.includes(today) ? today : availableDates[0];
  }

  const last = shiftISODate(today, DATE_STRIP_DAYS - 1);
  if (param && DATE_PATTERN.test(param) && param >= today && param <= last) {
    return param;
  }
  return today;
}

export default async function MovieDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const [{ slug }, { date: dateParam }] = await Promise.all([params, searchParams]);
  const today = todayISO();

  const [movieResult, showtimeDatesResult, reviewsResult] = await Promise.all([
    getMovieDetail(slug),
    getShowtimeDates(slug),
    getReviews({
      movieSlug: slug,
      skip: 0,
      limit: REVIEWS_PAGE_SIZE,
    }),
  ]);

  if ("error" in movieResult) {
    if (movieResult.error.status === 404) {
      return <MobileMovieNotFound />;
    }
    return (
      <div className="min-h-dvh bg-(--color-bg) py-10">
        <SectionFallback error={movieResult.error} />
      </div>
    );
  }

  const movie = movieResult.data;
  const dateOptions = "error" in showtimeDatesResult ? [] : showtimeDatesResult.data;
  const date = resolveDate(dateParam, toAvailableDates(dateOptions), today);

  const showtimesResult = await getShowtimes(slug, date);
  const showtimeCinemas = "error" in showtimesResult ? [] : showtimesResult.data.cinemas;
  const showtimesError = "error" in showtimesResult ? showtimesResult.error.message : null;
  const reviewsData = "error" in reviewsResult ? null : reviewsResult.data;
  const reviewsError = "error" in reviewsResult ? reviewsResult.error.message : null;

  return (
    <MovieDetailProvider movie={movie}>
      <MovieSelectionProvider>
        {/* Mobile */}
        <div className="block md:hidden min-h-dvh bg-(--color-bg) w-full max-w-md mx-auto flex flex-col overflow-x-hidden">
          <MobileHeroSection />
          <div className="flex flex-col gap-8 py-6 pb-12">
            <MobileSynopsis />
            <MobileTopCast />
            <MobileShowtimes
              date={date}
              today={today}
              dates={dateOptions}
              cinemas={showtimeCinemas}
              error={showtimesError}
            />
            <MobileBookTicketCTA />
            <MobileReviews initialData={reviewsData} initialError={reviewsError} />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <DesktopMovieDetail
            date={date}
            today={today}
            dates={dateOptions}
            cinemas={showtimeCinemas}
            showtimesError={showtimesError}
            reviewsData={reviewsData}
            reviewsError={reviewsError}
          />
        </div>
      </MovieSelectionProvider>
    </MovieDetailProvider>
  );
}
