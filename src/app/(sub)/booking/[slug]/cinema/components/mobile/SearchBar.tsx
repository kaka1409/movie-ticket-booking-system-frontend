"use client";

import { Search, X } from "lucide-react";
import { useCinemaSelection } from "@/features/booking/contexts/CinemaSelectionContext";
import { useLocale } from "@/contexts/LocaleContext";

export default function SearchBar() {
  const { query, setQuery } = useCinemaSelection();
  const { translate } = useLocale();

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-(--color-surface) border border-(--color-border)">
      <Search size={15} className="text-(--color-text-muted) shrink-0" />
      <input
        type="search"
        placeholder={translate("booking.cinema.search")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-transparent text-sm outline-none text-(--color-text-primary) placeholder:text-(--color-text-muted)"
      />
      {query && (
        <button onClick={() => setQuery("")} aria-label={translate("booking.cinema.clear_search")}>
          <X size={14} className="text-(--color-text-muted)" />
        </button>
      )}
    </div>
  );
}
