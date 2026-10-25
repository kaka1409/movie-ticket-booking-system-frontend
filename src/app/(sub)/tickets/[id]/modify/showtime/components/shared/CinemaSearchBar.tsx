"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import SearchBar from "@/components/ui/SearchBar";

/** Draft-bound cinema search; layout-free, so each skin owns its own spacing. */
export default function CinemaSearchBar() {
  const { query, setQuery } = useModification();
  const { translate } = useLocale();

  return (
    <SearchBar value={query} onChange={setQuery} placeholder={translate("booking.cinema.search")} />
  );
}
