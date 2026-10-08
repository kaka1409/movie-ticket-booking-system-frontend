"use client";

import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import SearchBar from "@/components/ui/SearchBar";

export default function SearchBarWrapper() {
  const { cinemaQuery, setCinemaQuery } = useBooking();
  const { translate } = useLocale();

  return (
    <SearchBar
      value={cinemaQuery}
      onChange={setCinemaQuery}
      placeholder={translate("booking.cinema.search")}
      className="px-4"
    />
  );
}
