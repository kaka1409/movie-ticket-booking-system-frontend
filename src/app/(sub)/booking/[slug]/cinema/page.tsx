import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getMovieDetail } from "@/features/movies/api";
import { getRequestLocale } from "@/libs/session";
import { todayInCinemaZone } from "@/libs/date";

// Shared
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import PageError from "@/app/(sub)/booking/components/mobile/PageError";

// Local mobile
import MovieSummary from "./components/mobile/MovieSummary";
import BottomBar from "./components/mobile/BottomBar";

// Desktop
import DesktopCinemaContent from "./components/desktop/CinemaContent";

import {
  DesktopCinemaSlotsSkeleton,
  MobileCinemaScheduleSkeleton,
} from "./components/CinemaSkeletons";
import { CinemaAdoptSection, CinemaScheduleSection } from "./sections";
import { DATE_PATTERN } from "./adapters";

/**
 * Cinema step, streamed: the page awaits the movie (it decides the 404 and feeds
 * the mobile summary and the desktop rail) and nothing else. The day strip and
 * the slot groups land in each tree's own boundary, and the deep-link adoption
 * rides a `fallback={null}` boundary — all three read one memoized schedule, so
 * the step still costs a single round trip.
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
  const scheduleProps = { slug, locale, today, requestedDate };

  return (
    <>
      <Suspense fallback={null}>
        <CinemaAdoptSection
          movie={movie}
          initialCinemaId={query.cinema ?? null}
          initialTime={query.time ?? ""}
          initialShowtimeId={query.showtimeId ?? null}
          {...scheduleProps}
        />
      </Suspense>

      {/* Mobile */}
      <div className="block md:hidden">
        <StepBar current={1} />
        <div className="flex flex-col gap-4 px-4 py-6 pb-12">
          <MovieSummary movie={movie} />
          <Suspense fallback={<MobileCinemaScheduleSkeleton />}>
            <CinemaScheduleSection {...scheduleProps} />
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
            <Suspense fallback={<DesktopCinemaSlotsSkeleton />}>
              <CinemaScheduleSection {...scheduleProps} />
            </Suspense>
          }
        />
      </div>
    </>
  );
}
