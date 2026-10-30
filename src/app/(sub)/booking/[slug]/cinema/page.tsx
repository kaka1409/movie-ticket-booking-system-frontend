import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getMovieDetail } from "@/features/movies/api";
import { getRequestLocale } from "@/libs/session";
import { todayInCinemaZone } from "@/libs/date";
import { getShowtimeDates, getShowtimes } from "@/features/showtimes/api";
import { resolveDefaultShowtimeDate } from "@/features/showtimes/utils";

// Shared
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import PageError from "@/app/(sub)/booking/components/mobile/PageError";

// Local mobile
import MovieSummary from "./components/mobile/MovieSummary";
import BottomBar from "./components/mobile/BottomBar";

// Desktop
import DesktopCinemaContent from "./components/desktop/CinemaContent";

import {
  DesktopCinemaDatesSkeleton,
  DesktopCinemaSlotsSkeleton,
  MobileCinemaDatesSkeleton,
  MobileCinemaSlotsSkeleton,
} from "./components/shared/CinemaSkeletons";
import { CinemaAdoptSection, CinemaDatesSection, CinemaSlotsSection } from "./sections";
import { DATE_PATTERN } from "@/features/booking/utils/cinema";

/**
 * Cinema step, streamed: the page awaits the movie (it decides the 404 and feeds
 * the mobile summary and the desktop rail) and nothing else. The day strip and
 * the slot groups land in each tree's own boundary, and the deep-link adoption
 * rides a `fallback={null}` boundary. The date response is shared by its display
 * and the dependent slot request; each endpoint is called once per page render.
 */
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
  const requestedDate = query.date && DATE_PATTERN.test(query.date) ? query.date : "";
  const datesPromise = getShowtimeDates(slug, locale);
  const schedulePromise = datesPromise.then(async (datesResult) => {
    const date = requestedDate ||
      ("error" in datesResult
        ? today
        : resolveDefaultShowtimeDate(datesResult.data, today));
    const showtimesResult = await getShowtimes(slug, date);
    return { datesResult, date, showtimesResult };
  });

  return (
    <>
      <Suspense fallback={null}>
        <CinemaAdoptSection
          movie={movie}
          schedulePromise={schedulePromise}
          today={today}
          locale={locale}
          initialCinemaId={query.cinema ?? null}
          initialTime={query.time ?? ""}
          initialShowtimeId={query.showtimeId ?? null}
        />
      </Suspense>

      {/* Mobile */}
      <div className="block md:hidden">
        <StepBar current={1} />
        <div className="flex flex-col gap-4 px-4 py-6 pb-12">
          <MovieSummary movie={movie} />
          <Suspense fallback={<MobileCinemaDatesSkeleton />}>
            <CinemaDatesSection datesPromise={datesPromise} today={today} locale={locale} />
          </Suspense>
          <Suspense fallback={<MobileCinemaSlotsSkeleton />}>
            <CinemaSlotsSection schedulePromise={schedulePromise} />
          </Suspense>
        </div>
        <BottomBar movieSlug={slug} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopCinemaContent
          movieSlug={slug}
          movie={movie}
          slots={
            <>
              <Suspense fallback={<DesktopCinemaDatesSkeleton />}>
                <CinemaDatesSection datesPromise={datesPromise} today={today} locale={locale} />
              </Suspense>
              <Suspense fallback={<DesktopCinemaSlotsSkeleton />}>
                <CinemaSlotsSection schedulePromise={schedulePromise} />
              </Suspense>
            </>
          }
        />
      </div>
    </>
  );
}
