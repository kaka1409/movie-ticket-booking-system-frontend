"use client";

import { Search, X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useMovies } from "@/features/movies/context";

export default function SearchBar() {
  const { translate } = useLocale();
  const { query, setQuery } = useMovies();

  return (
    <div className="px-(--space-md)">
      <div className="flex items-center gap-3 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-4 py-3 transition-colors focus-within:border-(--color-gold)/50">
        <Search size={16} className="shrink-0 text-(--color-text-muted)" />
        <input
          type="search"
          placeholder={translate("movies.search_placeholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-(--color-text-muted)"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear search">
            <X
              size={14}
              className="text-(--color-text-muted) transition-colors hover:text-white"
            />
          </button>
        )}
      </div>
    </div>
  );
}
