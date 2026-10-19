"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useMovieList } from "@/features/movies/context";
import SearchBar from "@/components/ui/SearchBar";

/**
 * Movie search bound to the movies context (debounced in the provider, so every
 * keystroke only updates the draft and the list refetches once it settles).
 *
 * Shared by both device trees and deliberately layout-free — the callers own
 * their own horizontal inset (the mobile tree pads it, the desktop header sets
 * its width).
 */
export default function MovieSearchBar({ className = "" }: { className?: string }) {
  const { translate } = useLocale();
  const { query, setQuery } = useMovieList();

  return (
    <SearchBar
      value={query}
      onChange={setQuery}
      placeholder={translate("movies.search_placeholder")}
      className={className}
    />
  );
}
