import HeroSection from "@/app/(main)/home/components/desktop/HeroSection";
import NowShowing from "@/app/(main)/home/components/desktop/NowShowing";
import ComingSoon from "@/app/(main)/home/components/desktop/ComingSoon";
import QuickBookingBar from "@/app/(main)/home/components/desktop/QuickBookingBar";
import ForYou from "@/app/(main)/home/components/desktop/ForYou";

import HeroBanner from "@/app/(main)/home/components/mobile/HeroBanner";
import QuickBooking from "@/app/(main)/home/components/mobile/QuickBooking";
import SearchBar from "@/app/(main)/home/components/mobile/SearchBar";
import MovieRow from "@/app/(main)/home/components/mobile/MovieRow";

import {
  getNowShowingMovies,
  getComingSoonMovies,
  getFeaturedMovies,
} from "@/features/movies/api";
import { getCinemas, getDates } from "@/features/booking/api";

export default async function HomePage() {
  const [nowShowing, comingSoon, featuredMovies, cinemas, dates] =
    await Promise.all([
      getNowShowingMovies(),
      getComingSoonMovies(),
      getFeaturedMovies(),
      getCinemas(),
      getDates(),
    ]);

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col gap-(--space-lg)">
          <HeroBanner movies={featuredMovies} />
          <QuickBooking movies={nowShowing} cinemas={cinemas} dates={dates} />
          <SearchBar />

          {/* Now Showing */}
          <MovieRow
            titleKey="home.movie_row.now_showing"
            movies={nowShowing}
            status="now_showing"
          />

          {/* Coming Soon */}
          <MovieRow
            titleKey="home.movie_row.coming_soon"
            movies={comingSoon}
            status="coming_soon"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <HeroSection movies={featuredMovies} />
        <QuickBookingBar />
        <NowShowing />
        <ComingSoon />
        <ForYou />
      </div>
    </>
  );
}
