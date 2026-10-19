"use client";

import MovieTabs from "../shared/Tabs";
import MovieSearchBar from "../shared/SearchBar";

/**
 * Toolbar at the top of the desktop movie panel: the Now Showing / Coming Soon
 * switch on the left, the search field on the right.
 *
 * The search sits with the list it filters (the page header above is only the
 * title band). Clear All is not here either — the filter sidebar owns it, next
 * to the filters it resets: at `lg:` the panel is ~600px wide and tabs + search
 * + a third control would not fit on one row.
 *
 * `items-end` keeps the tab row's underline on the same line as the bottom edge
 * of the search field, so the two read as one toolbar band.
 */
export default function MovieToolbar() {
  return (
    <div className="flex items-end justify-between gap-6">
      <MovieTabs stretch={false} className="min-w-0 flex-1" />

      <MovieSearchBar className="w-full max-w-xs shrink-0 lg:max-w-sm" />
    </div>
  );
}
