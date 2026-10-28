import { Suspense } from "react";
import type { Metadata } from "next";
import {
  readFiltersFromParams,
  readQueryFromParams,
  readTabFromParams,
} from "@/features/movies/url";
import { getRequestLocale } from "@/libs/session";
import MoviesPageSkeleton from "./components/MoviesSkeletons";
import { MoviesCatalogSection } from "./sections";

export const metadata: Metadata = {
  title: "Now Showing & Coming Soon Movies",
  description:
    "Browse now showing and coming soon movies, search by title and filter by genre, format, rating and release date.",
  alternates: { canonical: "/movies" },
};

/**
 * The page awaits only the query string and the locale cookie, so the shell (and
 * this route's skeleton) reaches the browser at once; the catalog — four
 * independent feeds — fills in behind one boundary because the list provider has
 * to own rows and filter options at mount.
 */
export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawSearchParams = await searchParams;
  const normalizedSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(rawSearchParams)) {
    if (typeof value === "string") normalizedSearchParams.set(key, value);
  }
  // See home/page.tsx: the locale cookie forces per-request rendering; the
  // fetch cache (keyed per ?lang= URL) still shields the backend.
  const locale = await getRequestLocale();

  return (
    <Suspense fallback={<MoviesPageSkeleton />}>
      <MoviesCatalogSection
        tab={readTabFromParams(normalizedSearchParams)}
        query={readQueryFromParams(normalizedSearchParams)}
        filters={readFiltersFromParams(normalizedSearchParams)}
        locale={locale}
      />
    </Suspense>
  );
}
