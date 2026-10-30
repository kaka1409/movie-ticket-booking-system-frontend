import type { ApiResponse, ErrorResponse } from "@/libs/api";
import {
  getHomeComingSoonMovies,
  getHomeFeaturedMovies,
  getHomeNowShowingMovies,
} from "@/features/movies/api";
import { getQuickBookingSeed } from "@/features/showtimes/api";

import ComingSoon from "./components/desktop/ComingSoon";
import ForYou from "./components/desktop/ForYou";
import HeroSection from "./components/desktop/HeroSection";
import NowShowing from "./components/desktop/NowShowing";

import HeroBanner from "./components/mobile/HeroBanner";
import MovieRow from "./components/mobile/MovieRow";

import QuickBookingShell from "./components/shared/QuickBookingShell";

/**
 * One async wrapper per data-dependent block of the home page: each is placed
 * inside its own `<Suspense>` by `page.tsx`, so the shell paints immediately and
 * every block paints the moment its feed lands. The feeds themselves are
 * `cache()`-memoized (`features/movies/api.ts`), so four blocks reading the
 * now-showing list still cost one backend call.
 */

type HomeSectionProps = { locale: "en" | "vn" };

function toSectionData<T, M>(
  result: ApiResponse<T[], M>,
): {
  data: T[];
  error: ErrorResponse["error"] | null;
} {
  return "error" in result ? { data: [], error: result.error } : { data: result.data, error: null };
}

/** Desktop featured carousel. */
export async function FeaturedHeroSection({ locale }: HomeSectionProps) {
  const { data, error } = toSectionData(await getHomeFeaturedMovies(locale));
  return <HeroSection movies={data} error={error} />;
}

/** Mobile featured banner. */
export async function FeaturedBannerSection({ locale }: HomeSectionProps) {
  const { data, error } = toSectionData(await getHomeFeaturedMovies(locale));
  return <HeroBanner movies={data} error={error} />;
}

/** Quick ticket finder — one controller, both skins (see `QuickBookingShell`). */
export async function QuickBookingSection({ locale }: HomeSectionProps) {
  const { data, error } = toSectionData(await getHomeNowShowingMovies(locale));
  const seed = data[0] ? await getQuickBookingSeed(data[0].slug, locale) : null;
  return <QuickBookingShell movies={data} error={error} seed={seed} />;
}

/** Desktop now-showing grid. */
export async function NowShowingSection({ locale }: HomeSectionProps) {
  const { data, error } = toSectionData(await getHomeNowShowingMovies(locale));
  return <NowShowing movies={data} error={error} />;
}

/** Desktop coming-soon banners. */
export async function ComingSoonSection({ locale }: HomeSectionProps) {
  const { data, error } = toSectionData(await getHomeComingSoonMovies(locale));
  return <ComingSoon movies={data} error={error} />;
}

/** Desktop "For You" strip (a slice of the now-showing list). */
export async function ForYouSection({ locale }: HomeSectionProps) {
  const { data } = toSectionData(await getHomeNowShowingMovies(locale));
  return <ForYou movies={data} />;
}

/** Mobile now-showing row. */
export async function NowShowingRowSection({ locale }: HomeSectionProps) {
  const { data, error } = toSectionData(await getHomeNowShowingMovies(locale));
  return (
    <MovieRow
      titleKey="home.movie_row.now_showing"
      movies={data}
      error={error}
      status="now_showing"
    />
  );
}

/** Mobile coming-soon row. */
export async function ComingSoonRowSection({ locale }: HomeSectionProps) {
  const { data, error } = toSectionData(await getHomeComingSoonMovies(locale));
  return (
    <MovieRow
      titleKey="home.movie_row.coming_soon"
      movies={data}
      error={error}
      status="coming_soon"
    />
  );
}
