import { MovieListProvider } from "@/features/movies/context";
import { getMoviesListing } from "@/features/movies/listing";
import type { Filters, Tab } from "@/features/movies/types";
import { SITE_URL } from "@/libs/site";

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
};

/**
 * The catalog itself, streamed. Rows and filter options all arrive in one round
 * trip, and the provider has to own both at mount (tab, search and filters are
 * client state that refetches page 1), so this block is the smallest unit that
 * can paint — the page around it is the skeleton.
 */
export async function MoviesCatalogSection({ tab, query, filters, locale }: MoviesSectionProps) {
  const { movies, meta, filterOptions } = await getMoviesListing(tab, query, filters, locale);

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
      {/* JSON-LD structured data for search engines (ItemList of movies). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c"),
        }}
      />
      <MovieListProvider
        initialMovies={movies}
        initialMeta={meta}
        initialTab={tab}
        initialQuery={query}
        initialFilters={filters}
        initialFilterOptions={filterOptions}
      >
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
    </>
  );
}
