import { Suspense } from "react";
import { MovieListProvider } from "@/features/movies/contexts/MovieListContext";
import type { getAgeRatings, getFormats, getGenres, getMovies } from "@/features/movies/api";
import { resolveFilterCatalog } from "@/features/movies/utils/filterOptions";
import type { FilterOptions, Filters, Tab } from "@/features/movies/types";
import { SITE_URL } from "@/libs/site";
import FilterOptionsAdopter from "./components/shared/FilterOptionsAdopter";
import MovieFeedAdopter from "./components/shared/MovieFeedAdopter";

// Mobile
import Tabs from "./components/shared/Tabs";
import SearchBar from "./components/shared/SearchBar";
import FilterPanel from "./components/mobile/FilterPanel";
import MobileMovieGrid from "./components/mobile/MovieGrid";

// Desktop
import MoviesHeader from "./components/desktop/MoviesHeader";
import FilterSidebar from "./components/desktop/FilterSidebar";
import MovieToolbar from "./components/desktop/MovieToolbar";
import DesktopMovieGrid from "./components/desktop/MovieGrid";

type MoviesSectionProps = {
  tab: Tab;
  query: string;
  filters: Filters;
  locale: "en" | "vn";
  moviesPromise: ReturnType<typeof getMovies>;
  genresPromise: ReturnType<typeof getGenres>;
  formatsPromise: ReturnType<typeof getFormats>;
  ageRatingsPromise: ReturnType<typeof getAgeRatings>;
  initialFilterOptions: FilterOptions;
};

/**
 * The movie feed initializes the provider; independent filter catalogs stream
 * into it afterward and update their own option lists.
 */
export function MoviesPageSections({
  tab,
  query,
  filters,
  locale,
  moviesPromise,
  genresPromise,
  formatsPromise,
  ageRatingsPromise,
  initialFilterOptions,
}: MoviesSectionProps) {
  return (
    <MovieListProvider
      initialMovies={[]}
      initialTab={tab}
      initialQuery={query}
      initialFilters={filters}
      initialFilterOptions={initialFilterOptions}
      deferInitialFetch
    >
      <Suspense fallback={null}>
        <MoviesInitialFeedSection
          moviesPromise={moviesPromise}
          tab={tab}
          query={query}
          filters={filters}
        />
      </Suspense>
      <Suspense fallback={null}>
        <MoviesFilterOptionsSection catalog="genres" promise={genresPromise} locale={locale} />
      </Suspense>
      <Suspense fallback={null}>
        <MoviesFilterOptionsSection catalog="formats" promise={formatsPromise} locale={locale} />
      </Suspense>
      <Suspense fallback={null}>
        <MoviesFilterOptionsSection
          catalog="ageRatings"
          promise={ageRatingsPromise}
          locale={locale}
        />
      </Suspense>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="space-y-4 py-(--space-md)">
          <Tabs />
          <div className="px-(--space-md)">
            <SearchBar />
          </div>
          <FilterPanel />
          <MobileMovieGrid />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <MoviesHeader />

          {/* One column at 740–1023px (the filter card stacks above the grid);
                sidebar + content from `lg:`. */}
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
            <FilterSidebar />

            {/* The movie container: toolbar (tabs + search) over the grid, in
                  one panel so the controls sit with the list they act on.
                  `surface-raised` lifts the nested cards — and the search field —
                  to `--color-surface-2` so they read on the panel. */}
            <div className="min-w-0 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
              <div className="surface-raised">
                <MovieToolbar />
                <div className="mt-6">
                  <DesktopMovieGrid />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MovieListProvider>
  );
}

async function MoviesInitialFeedSection({
  moviesPromise,
  tab,
  query,
  filters,
}: Pick<MoviesSectionProps, "moviesPromise" | "tab" | "query" | "filters">) {
  const result = await moviesPromise;
  const movies = "error" in result ? [] : result.data;
  const meta = "error" in result ? undefined : result.meta;
  const error = "error" in result ? result.error : null;
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: movies.map((movie, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/movies/${movie.slug}`,
      name: movie.title,
      image: movie.src,
      datePublished: movie.releaseDate,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c"),
        }}
      />
      <MovieFeedAdopter
        tab={tab}
        query={query}
        filters={filters}
        movies={movies}
        meta={meta}
        error={error}
      />
    </>
  );
}

type CatalogPromise =
  ReturnType<typeof getGenres> | ReturnType<typeof getFormats> | ReturnType<typeof getAgeRatings>;

async function MoviesFilterOptionsSection({
  catalog,
  promise,
  locale,
}: {
  catalog: keyof FilterOptions;
  promise: CatalogPromise;
  locale: "en" | "vn";
}) {
  const result = await promise;
  const options = resolveFilterCatalog(catalog, "error" in result ? null : result.data, locale);
  return <FilterOptionsAdopter catalog={catalog} options={options} />;
}
