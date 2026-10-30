import { Suspense } from "react";
import type { Metadata } from "next";
import { MoviePreviewProvider } from "@/features/movies/contexts/MoviePreviewContext";
import MoviePreviewLayer from "./components/desktop/MoviePreviewLayer";
import { getRequestLocale } from "@/libs/session";
import { SITE_NAME } from "@/libs/site";
import {
  ComingSoonSkeleton,
  FeaturedBannerSkeleton,
  FeaturedHeroSkeleton,
  MovieGridSkeleton,
  MovieRowSkeleton,
  QuickBookingSkeleton,
} from "./components/shared/HomeSkeletons";
import SearchBar from "./components/mobile/SearchBar";
import {
  ComingSoonRowSection,
  ComingSoonSection,
  FeaturedBannerSection,
  FeaturedHeroSection,
  ForYouSection,
  NowShowingRowSection,
  NowShowingSection,
  QuickBookingSection,
} from "./sections";

/** 60s fetch cache for the catalog calls (keyed per `?lang=`); the route renders per request. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: `${SITE_NAME} - Book Movie Tickets Online | Premium Cinema Experience`,
  description:
    "Book movie tickets online with PrimeSeat. Browse now showing and coming soon films, pick your showtime, choose your seats, and enjoy premium cinema experience. Easy booking in minutes.",
  alternates: { canonical: "/" },
};

/**
 * Streaming home page: the page awaits nothing but the locale cookie, so the
 * shell reaches the browser at once and each Suspense boundary fills in on its
 * own feed. Sections that share a feed (now showing: four of them) still cost a
 * single backend call thanks to the memoized loaders in `features/movies/api.ts`.
 */
export default async function HomePage() {
  const locale = await getRequestLocale();

  return (
    <>
      <div className="block md:hidden">
        <Suspense fallback={<FeaturedBannerSkeleton />}>
          <FeaturedBannerSection locale={locale} />
        </Suspense>
      </div>

      <div className="hidden md:block">
        <Suspense fallback={<FeaturedHeroSkeleton />}>
          <FeaturedHeroSection locale={locale} />
        </Suspense>
      </div>

      {/* Between the trees: one controller for both skins, so one boundary. */}
      <Suspense fallback={<QuickBookingSkeleton />}>
        <QuickBookingSection locale={locale} />
      </Suspense>

      <div className="mt-(--space-lg) block md:hidden">
        <div className="flex flex-col gap-(--space-lg)">
          <SearchBar />
          <Suspense fallback={<MovieRowSkeleton />}>
            <NowShowingRowSection locale={locale} />
          </Suspense>
          <Suspense fallback={<MovieRowSkeleton />}>
            <ComingSoonRowSection locale={locale} />
          </Suspense>
        </div>
      </div>

      <div className="hidden md:block">
        <MoviePreviewProvider>
          <MoviePreviewLayer />
          <Suspense fallback={<MovieGridSkeleton />}>
            <NowShowingSection locale={locale} />
          </Suspense>
          <Suspense fallback={<ComingSoonSkeleton />}>
            <ComingSoonSection locale={locale} />
          </Suspense>
          <Suspense fallback={<MovieGridSkeleton />}>
            <ForYouSection locale={locale} />
          </Suspense>
        </MoviePreviewProvider>
      </div>
    </>
  );
}
