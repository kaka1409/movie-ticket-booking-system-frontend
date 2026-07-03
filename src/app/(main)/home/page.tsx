"use client";

import { useLocale } from "@/contexts/LocaleContext";
import HeroSection from "@/app/(main)/home/components/desktop/HeroSection";
import NowShowing from "@/app/(main)/home/components/desktop/NowShowing";
import ComingSoon from "@/app/(main)/home/components/desktop/ComingSoon";
import Footer from "@/components/layout/DesktopLayout/Footer";
import HeroBanner from "@/app/(main)/home/components/mobile/HeroBanner";
import QuickBooking from "@/app/(main)/home/components/mobile/QuickBooking";
import SearchBar from "@/app/(main)/home/components/mobile/SearchBar";
import MovieRow from "@/app/(main)/home/components/mobile/MovieRow";
import QuickBookingBar from "@/app/(main)/home/components/desktop/QuickBookingBar";
import ForYou from "@/app/(main)/home/components/desktop/ForYou";
import { NOW_SHOWING, COMING_SOON } from "@/features/movies/mock";

export default function HomePage() {
  const { t } = useLocale();
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col gap-(--space-lg) pb-(--space-xl)">
          <HeroBanner />
          <QuickBooking />
          <SearchBar />
          <MovieRow title={t("home.movie_row.now_showing")} movies={NOW_SHOWING} />
          <MovieRow title={t("home.movie_row.coming_soon")} movies={COMING_SOON} />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <HeroSection />
        <QuickBookingBar />
        <NowShowing />
        <ComingSoon />
        <ForYou />
        <Footer />
      </div>
    </>
  );
}
