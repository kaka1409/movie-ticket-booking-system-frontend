import { ShowtimesProvider } from "@/features/showtimes/context";
import { getMovieSchedule } from "@/features/showtimes/detail";
import { getMovieReviews } from "@/features/reviews/detail";
import { getMovieRecommendations } from "@/features/movies/detail";
import { SITE_URL } from "@/libs/site";
import type { Movie } from "@/features/movies/types";
import MobileShowtimes from "./components/mobile/Showtimes";
import MobileReviews from "./components/mobile/Reviews";
import MobileRecommended from "./components/mobile/Recommended";
import DesktopShowtimes from "./components/desktop/Showtimes";
import DesktopReviews from "./components/desktop/Reviews";
import DesktopRecommended from "./components/desktop/Recommended";

type ShowtimesSectionProps = { slug: string; locale: "en" | "vn"; today: string };
type ReviewsSectionProps = { slug: string; locale: "en" | "vn" };

/**
 * Async sections behind the detail page's Suspense boundaries. The showtimes
 * pair each owns a provider instance because the mobile list and the desktop
 * rail occupy different DOM positions; the schedule itself is `cache()`d, so the
 * split costs no extra backend call.
 */
export async function MobileShowtimesSection({ slug, locale, today }: ShowtimesSectionProps) {
  const schedule = await getMovieSchedule(slug, locale, today);

  return (
    <ShowtimesProvider
      movieSlug={slug}
      initialDate={schedule.date}
      dates={schedule.dates}
      datesAvailable={schedule.datesAvailable}
      today={today}
      initialCinemas={schedule.cinemas}
      initialError={schedule.error}
    >
      <MobileShowtimes />
    </ShowtimesProvider>
  );
}

export async function DesktopShowtimesSection({ slug, locale, today }: ShowtimesSectionProps) {
  const schedule = await getMovieSchedule(slug, locale, today);

  return (
    <ShowtimesProvider
      movieSlug={slug}
      initialDate={schedule.date}
      dates={schedule.dates}
      datesAvailable={schedule.datesAvailable}
      today={today}
      initialCinemas={schedule.cinemas}
      initialError={schedule.error}
    >
      <DesktopShowtimes />
    </ShowtimesProvider>
  );
}

export async function MobileReviewsSection({ slug, locale }: ReviewsSectionProps) {
  const result = await getMovieReviews(slug, locale);

  return (
    <MobileReviews
      initialData={"error" in result ? null : result.data}
      initialError={"error" in result ? result.error.message : null}
    />
  );
}

export async function DesktopReviewsSection({ slug, locale }: ReviewsSectionProps) {
  const result = await getMovieReviews(slug, locale);

  return (
    <DesktopReviews
      initialData={"error" in result ? null : result.data}
      initialError={"error" in result ? result.error.message : null}
    />
  );
}

type RecommendedSectionProps = { slug: string; locale: "en" | "vn" };

export async function MobileRecommendedSection({ slug, locale }: RecommendedSectionProps) {
  const result = await getMovieRecommendations(slug, locale);
  if ("error" in result || result.data.length === 0) return null;
  return <MobileRecommended movies={result.data} />;
}

export async function DesktopRecommendedSection({ slug, locale }: RecommendedSectionProps) {
  const result = await getMovieRecommendations(slug, locale);
  if ("error" in result || result.data.length === 0) return null;
  return <DesktopRecommended movies={result.data} />;
}

/**
 * Movie structured data (aggregate rating + reviews). It needs the review read,
 * so it lives in its own `fallback={null}` boundary: the tags flush when the
 * reviews land instead of holding the hero back, and the schema.org payload
 * still ships in the same HTML.
 */
export async function MovieStructuredDataSection({
  movie,
  locale,
}: {
  movie: Movie;
  locale: "en" | "vn";
}) {
  const result = await getMovieReviews(movie.slug, locale);
  const reviewsData = "error" in result ? null : result.data;

  const schema = {
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
          review: reviewsData.reviews.slice(0, 10).map((review) => ({
            "@type": "Review",
            author: { "@type": "Person", name: review.user.name },
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 10,
              worstRating: 1,
            },
            reviewBody: review.comment,
            datePublished: review.createdAt,
          })),
        }
      : {}),
  };

  return (
    // JSON.stringify output is safe for script content; `<` is escaped so the
    // payload can never break out of the script element.
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
