"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useMovieList } from "@/features/movies/contexts/MovieListContext";

/**
 * Desktop page heading for /movies: the active tab as the title and the server
 * result total under it.
 *
 * The tab name doubles as the title (the panel's toolbar repeats it as the
 * switch), so the visitor always knows which catalog the grid is showing. The
 * search field belongs to the list, not the page band, and lives in the panel
 * toolbar instead.
 */
export default function MoviesHeader() {
  const { translate } = useLocale();
  const { activeTab, total, isFetching } = useMovieList();

  return (
    <header className="min-w-0">
      <h1 className="flex items-center gap-2.5 text-[26px] font-black tracking-tight text-white">
        <span className="inline-block h-[26px] w-1 rounded-sm bg-(--color-gold)" />
        {translate(`movies.${activeTab}`)}
      </h1>
      {/* Held open while the first page lands — `total` reads 0 until then,
          and "0 Results Found" would be a lie. */}
      <p className="mt-1.5 min-h-4 text-xs text-(--color-text-muted)">
        {isFetching && total === 0 ? "" : `${total} ${translate("movies.results_found")}`}
      </p>
    </header>
  );
}
