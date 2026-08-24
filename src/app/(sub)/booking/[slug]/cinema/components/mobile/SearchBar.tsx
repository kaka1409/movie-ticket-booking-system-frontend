"use client";

import { useCinemaSelection } from "@/features/booking/contexts/CinemaSelectionContext";
import { useLocale } from "@/contexts/LocaleContext";
import SearchBar from "@/components/ui/SearchBar";

export default function SearchBarWrapper() {
  const { query, setQuery } = useCinemaSelection();
  const { translate } = useLocale();

  return (
    <SearchBar
      value={query}
      onChange={setQuery}
      placeholder={translate("booking.cinema.search")}
      className="px-4"
    />
  );
}
