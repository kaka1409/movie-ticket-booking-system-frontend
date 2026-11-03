"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useMovieList } from "@/features/movies/contexts/MovieListContext";
import DesktopPageHeader from "@/components/shared/DesktopPageHeader";

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
    <DesktopPageHeader
      title={translate(`movies.${activeTab}`)}
      // Held open while the first page lands — `total` reads 0 until then,
      // and "0 Results Found" would be a lie.
      subtitle={isFetching && total === 0 ? "" : `${total} ${translate("movies.results_found")}`}
    />
  );
}
