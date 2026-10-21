import { getMovies, getFeaturedMovies } from "@/features/movies/api";
import { MOVIES_PAGE_SIZE } from "@/features/movies/constants";
import { toApiResponse } from "@/libs/api";
import { getRequestLocale } from "@/libs/session";
import { SITE_NAME } from "@/libs/site";
import type { Metadata } from "next";

/** 60s fetch cache for the catalog calls (keyed per `?lang=`); the route renders per request. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: `${SITE_NAME} - Book Movie Tickets Online | Premium Cinema Experience`,
  description:
    "Book movie tickets online with PrimeSeat. Browse now showing and coming soon films, pick your showtime, choose your seats, and enjoy premium cinema experience. Easy booking in minutes.",
  alternates: { canonical: "/" },
};

// Desktop
import HeroSection from "@/app/(main)/home/components/desktop/HeroSection";
import NowShowing from "@/app/(main)/home/components/desktop/NowShowing";
import ComingSoon from "@/app/(main)/home/components/desktop/ComingSoon";
import QuickBookingBar from "@/app/(main)/home/components/desktop/QuickBookingBar";
import ForYou from "@/app/(main)/home/components/desktop/ForYou";
import { MoviePreviewProvider } from "@/features/movies/moviePreviewContext";

// Mobile
import HeroBanner from "@/app/(main)/home/components/mobile/HeroBanner";
import QuickBooking from "@/app/(main)/home/components/mobile/QuickBooking";
import SearchBar from "@/app/(main)/home/components/mobile/SearchBar";
import MovieRow from "@/app/(main)/home/components/mobile/MovieRow";

// Shared: one quick-booking controller for both device trees
import { QuickBookingProvider } from "@/app/(main)/home/components/QuickBookingProvider";

export default async function HomePage() {
  // Cookie read makes this route dynamic per request (ISR HTML would serve
  // one locale to everyone); the 60s fetch cache below still shields the
  // backend, keyed per ?lang= URL.
  const locale = await getRequestLocale();
  // QuickBooking's dates/slots are request-keyed client-side (they depend on the
  // picked movie), so the page itself only serves movies + featured.
  const [nowShowingSettled, comingSoonSettled, featuredSettled] = await Promise.allSettled([
    getMovies({ status: "now_showing", page: 1, limit: MOVIES_PAGE_SIZE }, locale),
    getMovies({ status: "coming_soon", page: 1, limit: MOVIES_PAGE_SIZE }, locale),
    getFeaturedMovies(locale),
  ]);

  const nowShowing = toApiResponse(nowShowingSettled);
  const comingSoon = toApiResponse(comingSoonSettled);
  const featuredMovies = toApiResponse(featuredSettled);

  const featuredError = "error" in featuredMovies ? featuredMovies.error : null;
  const featured = "error" in featuredMovies ? [] : featuredMovies.data;
  const nowShowingError = "error" in nowShowing ? nowShowing.error : null;
  const nowShowingList = "error" in nowShowing ? [] : nowShowing.data;
  const comingSoonError = "error" in comingSoon ? comingSoon.error : null;
  const comingSoonList = "error" in comingSoon ? [] : comingSoon.data;

  return (
    <QuickBookingProvider movies={nowShowingList}>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col gap-(--space-lg)">
          <HeroBanner movies={featured} error={featuredError} />
          <QuickBooking movies={nowShowingList} error={nowShowingError} />
          <SearchBar />

          <MovieRow
            titleKey="home.movie_row.now_showing"
            movies={nowShowingList}
            error={nowShowingError}
            status="now_showing"
          />

          <MovieRow
            titleKey="home.movie_row.coming_soon"
            movies={comingSoonList}
            error={comingSoonError}
            status="coming_soon"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <MoviePreviewProvider>
          <HeroSection movies={featured} error={featuredError} />
          <QuickBookingBar movies={nowShowingList} error={nowShowingError} />
          <NowShowing movies={nowShowingList} error={nowShowingError} />
          <ComingSoon movies={comingSoonList} error={comingSoonError} />
          <ForYou movies={nowShowingList} />
        </MoviePreviewProvider>
      </div>
    </QuickBookingProvider>
  );
}
