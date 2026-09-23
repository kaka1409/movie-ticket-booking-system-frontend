import {
  getNowShowingMovies,
  getComingSoonMovies,
  getFeaturedMovies,
} from "@/features/movies/api";
import { getCinemas, getDates } from "@/features/booking/api";
import { toApiResult } from "@/libs/api";

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
  const [
    nowShowingSettled,
    comingSoonSettled,
    featuredSettled,
    cinemasSettled,
    datesSettled,
  ] = await Promise.allSettled([
    getNowShowingMovies(),
    getComingSoonMovies(),
    getFeaturedMovies(),
    getCinemas(),
    getDates(),
  ]);

  const nowShowing = toApiResult(nowShowingSettled);
  const comingSoon = toApiResult(comingSoonSettled);
  const featuredMovies = toApiResult(featuredSettled);
  const cinemas = cinemasSettled.status === "fulfilled" ? cinemasSettled.value : [];
  const dates = datesSettled.status === "fulfilled" ? datesSettled.value : [];

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col gap-(--space-lg)">
          <HeroBanner
            movies={featuredMovies.data ?? []}
            error={featuredMovies.error}
          />
          <QuickBooking
            movies={nowShowing.data ?? []}
            cinemas={cinemas}
            dates={dates}
            error={nowShowing.error}
          />
          <SearchBar />

          {/* Now Showing */}
          <MovieRow
            titleKey="home.movie_row.now_showing"
            movies={nowShowing.data ?? []}
            error={nowShowing.error}
            status="now_showing"
          />

          {/* Coming Soon */}
          <MovieRow
            titleKey="home.movie_row.coming_soon"
            movies={comingSoon.data ?? []}
            error={comingSoon.error}
            status="coming_soon"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <HeroSection
          movies={featuredMovies.data ?? []}
          error={featuredMovies.error}
        />
        <QuickBookingBar />
        <NowShowing />
        <ComingSoon />
        <ForYou />
      </div>
    </>
  );
}
