"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import SearchBar from "@/components/ui/SearchBar";

export default function SearchBarWrapper() {
  const { query, setQuery } = useModification();
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
