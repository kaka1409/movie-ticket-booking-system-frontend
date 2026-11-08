import { Suspense } from "react";
import { getMovieDetail, getMovies } from "@/features/movies/api";
import SectionFallback from "@/components/ui/SectionFallback";
import { MovieDetailProvider } from "@/features/movies/contexts/MovieDetailContext";
import { MovieSelectionProvider } from "@/features/movies/contexts/MovieSelectionContext";
import { getRequestLocale } from "@/libs/session";
import { todayInCinemaZone } from "@/libs/date";
import { SITE_NAME, SITE_URL } from "@/libs/site";
import type { Metadata } from "next";

// Mobile
import MobileHeroSection from "./components/mobile/HeroSection";
import MobileSynopsis from "./components/mobile/Synopsis";
import MobileTopCast from "./components/mobile/TopCast";
import MobileBookTicketCTA from "./components/mobile/BookTicketCTA";
import MobileMovieNotFound from "./components/mobile/MovieNotFound";

// Desktop
import DesktopMovieDetail from "./components/desktop/MovieDetailDesktop";

// Streamed blocks
import {
  DesktopRailSkeleton,
  DesktopRecommendedSkeleton,
  DesktopReviewsSkeleton,
  MobileRecommendedSkeleton,
  MobileReviewsSkeleton,
  MobileShowtimesSkeleton,
} from "./components/shared/MovieDetailSkeletons";
import {
  DesktopReviewsSection,
  DesktopShowtimesSection,
  DesktopRecommendedSection,
  MobileReviewsSection,
  MobileRecommendedSection,
  MobileShowtimesSection,
  MovieStructuredDataSection,
} from "./sections";

/** 60s fetch cache for the catalog calls; the page itself renders per request (locale cookie). */
export const revalidate = 60;

/** Trim to a social-preview friendly length without cutting mid-word. */
function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), limit - 20))}…`;
}

/**
 * Build-time pre-render of the catalog (EN default) for the static HTML and
 * build-time metadata path; unknown slugs still render on demand
 * (`dynamicParams` stays on), and a locale-cookie request renders per request.
 * Pages through the catalog so catalogs beyond one page still pre-render;
 * `MAX_STATIC_PAGES` caps the build-time work — the rest stay on-demand.
 */
const STATIC_PARAMS_PAGE_SIZE = 100;
const MAX_STATIC_PAGES = 10;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs: { slug: string }[] = [];
  for (let page = 1; page <= MAX_STATIC_PAGES; page += 1) {
    const result = await getMovies({ page, limit: STATIC_PARAMS_PAGE_SIZE });
    if ("error" in result) break;
    slugs.push(...result.data.map((movie) => ({ slug: movie.slug })));
    if (!result.meta?.hasNextPage) break;
  }
  return slugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getMovieDetail(slug);

  if ("error" in result) {
    return {
      title: "Movie not found",
      robots: { index: false },
    };
  }

  const movie = result.data;
  const description = truncate(
    movie.synopsis ||
      `${movie.title} (${movie.releaseDate}) — ${movie.genre}, ${movie.duration} min.`,
    160,
  );
  const url = `/movies/${movie.slug}`;
  const images = movie.src ? [movie.src] : undefined;

  return {
    title: movie.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "video.movie",
      url,
      title: movie.title,
      description,
      siteName: SITE_NAME,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: movie.title,
      description,
      ...(images ? { images } : {}),
    },
  };
}

/**
 * The movie itself is the page (hero, synopsis, cast, every provider), so it is
 * the one read awaited up front; showtimes and reviews each stream into their own
 * box afterwards. `?date=` deep links are still applied client-side by the
 * showtime provider.
 */
export default async function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const today = todayInCinemaZone();
  // Cookie locale → per-request rendering (see home/page.tsx); build-time
  // generateStaticParams/generateMetadata above stay on the EN default.
  const locale = await getRequestLocale();
  const movieResult = await getMovieDetail(slug, locale);

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
  const sectionProps = { slug, locale };

  // Build BreadcrumbList structured data for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Movies",
        item: `${SITE_URL}/movies`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: movie.title,
        item: `${SITE_URL}/movies/${movie.slug}`,
      },
    ],
  };

  return (
    <MovieDetailProvider movie={movie}>
      <MovieSelectionProvider>
        {/* JSON-LD structured data for search engines (BreadcrumbList). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
          }}
        />
        {/* Movie schema (aggregate rating) needs the reviews — script only, so it
            flushes late without holding back or shifting anything. */}
        <Suspense fallback={null}>
          <MovieStructuredDataSection movie={movie} locale={locale} />
        </Suspense>

        {/* Mobile */}
        <div className="block md:hidden min-h-dvh bg-(--color-bg) w-full max-w-md mx-auto flex flex-col overflow-x-hidden">
          <MobileHeroSection />
          <div className="flex flex-col gap-8 py-6 pb-12">
            <MobileSynopsis />
            <MobileTopCast />
            <Suspense fallback={<MobileShowtimesSkeleton />}>
              <MobileShowtimesSection {...sectionProps} today={today} />
            </Suspense>
            <MobileBookTicketCTA />
            <Suspense fallback={<MobileReviewsSkeleton />}>
              <MobileReviewsSection {...sectionProps} />
            </Suspense>
            <Suspense fallback={<MobileRecommendedSkeleton />}>
              <MobileRecommendedSection key={slug} {...sectionProps} />
            </Suspense>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <DesktopMovieDetail
            showtimes={
              <Suspense fallback={<DesktopRailSkeleton />}>
                <DesktopShowtimesSection {...sectionProps} today={today} />
              </Suspense>
            }
            reviews={
              <Suspense fallback={<DesktopReviewsSkeleton />}>
                <DesktopReviewsSection {...sectionProps} />
              </Suspense>
            }
            recommended={
              <Suspense fallback={<DesktopRecommendedSkeleton />}>
                <DesktopRecommendedSection {...sectionProps} />
              </Suspense>
            }
          />
        </div>
      </MovieSelectionProvider>
    </MovieDetailProvider>
  );
}
