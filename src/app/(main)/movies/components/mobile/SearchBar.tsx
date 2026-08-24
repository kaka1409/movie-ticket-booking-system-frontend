"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useMovies } from "@/features/movies/context";
import SearchBar from "@/components/ui/SearchBar";

export default function SearchBarWrapper() {
  const { translate } = useLocale();
  const { query, setQuery } = useMovies();

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
