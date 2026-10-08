import { getMovieDetail, getMovies } from "@/features/movies/api";
import { getShowtimeDates, getShowtimes } from "@/features/showtimes/api";
import type { ShowtimeDateOption } from "@/features/showtimes/types";
import { ShowtimesProvider } from "@/features/showtimes/context";
import { getReviews } from "@/features/reviews/api";
import SectionFallback from "@/components/ui/SectionFallback";
import { REVIEWS_PAGE_SIZE } from "@/features/reviews/constants";
import { MovieDetailProvider, MovieSelectionProvider } from "@/features/movies/context";
import { SITE_NAME, SITE_URL } from "@/libs/site";
import type { Metadata } from "next";

// Mobile
import MobileHeroSection from "./components/mobile/HeroSection";
import MobileSynopsis from "./components/mobile/Synopsis";
import MobileTopCast from "./components/mobile/TopCast";
import MobileShowtimes from "./components/mobile/Showtimes";
import MobileBookTicketCTA from "./components/mobile/BookTicketCTA";
import MobileReviews from "./components/mobile/Reviews";
import MobileMovieNotFound from "./components/mobile/MovieNotFound";

// Desktop
import DesktopMovieDetail from "./components/desktop/MovieDetailDesktop";

/** Statically generated movie pages rebuild every 60s (catalog edits show up). */
export const revalidate = 60;

/** Trim to a social-preview friendly length without cutting mid-word. */
function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), limit - 20))}…`;
}

function todayISO(): string {
  return new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

/* Backend only returns the upcoming dates that actually have showtimes. */
function toAvailableDates(records: ShowtimeDateOption[]): string[] {
  return records.filter((record) => record.hasShowtimes).map((record) => record.date);
}

/**
 * Prefer the current day when it really has showtimes (from the API),
 * otherwise jump to the first available one. `?date=` deep links are applied
 * client-side in `ShowtimesProvider` — the static HTML always renders this
 * default so the page never has to read `searchParams`.
 */
function resolveDate(availableDates: string[], today: string): string {
  if (availableDates.length === 0) return today;
  return availableDates.includes(today) ? today : availableDates[0];
}

/**
 * Pre-render the catalog's movie pages at build time; unknown slugs still
 * render on demand (`dynamicParams` stays on) and follow the same ISR policy.
 * When the API is down during the build nothing is pre-rendered — the pages
 * degrade to on-demand rendering and heal on their 60s revalidation.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const result = await getMovies({ page: 1, limit: 100 });
  if ("error" in result) return [];
  return result.data.map((movie) => ({ slug: movie.slug }));
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

export default async function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const today = todayISO();

  /* One parallel round trip: the usual case resolves the default day to
     `today`, so no waterfall — a second fetch only runs when today has no
     sessions and the strip jumps to the first available day. */
  const [movieResult, showtimeDatesResult, reviewsResult, todayShowtimesResult] = await Promise.all(
    [
      getMovieDetail(slug),
      getShowtimeDates(slug),
      getReviews({
        movieSlug: slug,
        skip: 0,
        limit: REVIEWS_PAGE_SIZE,
      }),
      getShowtimes(slug, today),
    ],
  );

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
  const dateOptions = "error" in showtimeDatesResult ? [] : showtimeDatesResult.data;
  const date = resolveDate(toAvailableDates(dateOptions), today);

  const showtimesResult = date === today ? todayShowtimesResult : await getShowtimes(slug, date);
  const showtimeCinemas = "error" in showtimesResult ? [] : showtimesResult.data.cinemas;
  const showtimesError = "error" in showtimesResult ? showtimesResult.error.message : null;
  const reviewsData = "error" in reviewsResult ? null : reviewsResult.data;
  const reviewsError = "error" in reviewsResult ? reviewsResult.error.message : null;

  return (
    <MovieDetailProvider movie={movie}>
      <MovieSelectionProvider>
        <ShowtimesProvider
          movieSlug={slug}
          initialDate={date}
          dates={dateOptions}
          today={today}
          initialCinemas={showtimeCinemas}
          initialError={showtimesError}
        >
          {/* JSON-LD structured data for search engines (Movie + aggregate rating).
              JSON.stringify output is safe for script content; `<` is escaped so
              the payload can never break out of the script element. */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Movie",
                name: movie.title,
                url: `${SITE_URL}/movies/${movie.slug}`,
                ...(movie.src ? { image: movie.src } : {}),
                description: movie.synopsis,
                genre: movie.genre,
                datePublished: movie.releaseDate,
                duration: `PT${movie.duration}M`,
                director: { "@type": "Person", name: movie.director },
                contentRating: movie.ageRating,
                actor: movie.cast.map((member) => ({ "@type": "Person", name: member.name })),
                ...(reviewsData && reviewsData.ratingSummary.total > 0
                  ? {
                      aggregateRating: {
                        "@type": "AggregateRating",
                        ratingValue: reviewsData.ratingSummary.average,
                        reviewCount: reviewsData.ratingSummary.total,
                        bestRating: 10,
                        worstRating: 1,
                      },
                    }
                  : {}),
              }).replace(/</g, "\\u003c"),
            }}
          />
          {/* Mobile */}
          <div className="block md:hidden min-h-dvh bg-(--color-bg) w-full max-w-md mx-auto flex flex-col overflow-x-hidden">
            <MobileHeroSection />
            <div className="flex flex-col gap-8 py-6 pb-12">
              <MobileSynopsis />
              <MobileTopCast />
              <MobileShowtimes />
              <MobileBookTicketCTA />
              <MobileReviews initialData={reviewsData} initialError={reviewsError} />
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <DesktopMovieDetail reviewsData={reviewsData} reviewsError={reviewsError} />
          </div>
        </ShowtimesProvider>
      </MovieSelectionProvider>
    </MovieDetailProvider>
  );
}
