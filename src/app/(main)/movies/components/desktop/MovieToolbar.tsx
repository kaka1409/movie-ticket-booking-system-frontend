import MovieTabs from "../shared/Tabs";
import MovieSearchBar from "../shared/SearchBar";

/**
 * Desktop toolbar: tab switch left, search right (`items-end` aligns the tab
 * underline with the search field's bottom edge). Clear All lives in the filter
 * sidebar, with the filters it resets — three controls do not fit at `lg:`.
 */
export default function MovieToolbar() {
  return (
    <div className="flex items-end justify-between gap-6">
      <MovieTabs stretch={false} className="min-w-0 flex-1" />

      <MovieSearchBar className="w-full max-w-xs shrink-0 lg:max-w-sm" />
    </div>
  );
}
