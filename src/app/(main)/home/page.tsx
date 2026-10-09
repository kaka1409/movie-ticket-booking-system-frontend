import { getMovies, getFeaturedMovies } from "@/features/movies/api";
import { MOVIES_PAGE_SIZE } from "@/features/movies/constants";
import { getCinemas, getDates } from "@/features/booking/api";
import { toApiResponse } from "@/libs/api";
import { SITE_NAME } from "@/libs/site";
import type { Metadata } from "next";

/** Static shell rebuilt every 60s so catalog edits show up without a redeploy. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: `${SITE_NAME} - Book Movie Tickets Online | Premium Cinema Experience`,
  description: "Book movie tickets online with PrimeSeat. Browse now showing and coming soon films, pick your showtime, choose your seats, and enjoy premium cinema experience. Easy booking in minutes.",
  alternates: { canonical: "/" },
};

// Desktop
import HeroSection from "@/app/(main)/home/components/desktop/HeroSection";
import NowShowing from "@/app/(main)/home/components/desktop/NowShowing";
import ComingSoon from "@/app/(main)/home/components/desktop/ComingSoon";
import QuickBookingBar from "@/app/(main)/home/components/desktop/QuickBookingBar";
import ForYou from "@/app/(main)/home/components/desktop/ForYou";

// Mobile
import HeroBanner from "@/app/(main)/home/components/mobile/HeroBanner";
import QuickBooking from "@/app/(main)/home/components/mobile/QuickBooking";
import SearchBar from "@/app/(main)/home/components/mobile/SearchBar";
import MovieRow from "@/app/(main)/home/components/mobile/MovieRow";

export default async function HomePage() {
  const [nowShowingSettled, comingSoonSettled, featuredSettled, cinemasSettled, datesSettled] =
    await Promise.allSettled([
      getMovies({ status: "now_showing", page: 1, limit: MOVIES_PAGE_SIZE }),
      getMovies({ status: "coming_soon", page: 1, limit: MOVIES_PAGE_SIZE }),
      getFeaturedMovies(),
      getCinemas(),
      getDates(),
    ]);

  const nowShowing = toApiResponse(nowShowingSettled);
  const comingSoon = toApiResponse(comingSoonSettled);
  const featuredMovies = toApiResponse(featuredSettled);

  // Currently are mocked data
  const cinemas = cinemasSettled.status === "fulfilled" ? cinemasSettled.value : [];
  const dates = datesSettled.status === "fulfilled" ? datesSettled.value : [];

  const featuredError = "error" in featuredMovies ? featuredMovies.error : null;
  const featured = "error" in featuredMovies ? [] : featuredMovies.data;
  const nowShowingError = "error" in nowShowing ? nowShowing.error : null;
  const nowShowingList = "error" in nowShowing ? [] : nowShowing.data;
  const comingSoonError = "error" in comingSoon ? comingSoon.error : null;
  const comingSoonList = "error" in comingSoon ? [] : comingSoon.data;

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col gap-(--space-lg)">
          <HeroBanner movies={featured} error={featuredError} />
          <QuickBooking
            movies={nowShowingList}
            cinemas={cinemas}
            dates={dates}
            error={nowShowingError}
          />
          <SearchBar />

          {/* Now Showing */}
          <MovieRow
            titleKey="home.movie_row.now_showing"
            movies={nowShowingList}
            error={nowShowingError}
            status="now_showing"
          />

          {/* Coming Soon */}
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
        <HeroSection movies={featured} error={featuredError} />
        <QuickBookingBar
          movies={nowShowingList}
          cinemas={cinemas}
          dates={dates}
          error={nowShowingError}
        />
        <NowShowing movies={nowShowingList} error={nowShowingError} />
        <ComingSoon movies={comingSoonList} error={comingSoonError} />
        <ForYou movies={nowShowingList} />
      </div>
    </>
  );
}
