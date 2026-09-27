"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useMovieList } from "@/features/movies/context";
import SearchBar from "@/components/ui/SearchBar";

export default function SearchBarWrapper() {
  const { translate } = useLocale();
  const { query, setQuery } = useMovieList();

  return (
    <div className="px-(--space-md)">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={translate("movies.search_placeholder")}
      />
    </div>
  );
}
