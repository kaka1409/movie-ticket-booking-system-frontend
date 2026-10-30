"use client";

import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import SearchBar from "@/components/ui/SearchBar";

export default function SearchBarWrapper({ className = "px-4" }: { className?: string }) {
  const { cinemaQuery, setCinemaQuery } = useBooking();
  const { translate } = useLocale();

  return (
    <SearchBar
      value={cinemaQuery}
      onChange={setCinemaQuery}
      placeholder={translate("booking.cinema.search")}
      className={className}
    />
  );
}
