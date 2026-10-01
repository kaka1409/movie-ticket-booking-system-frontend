"use client";

import { useCinemaSelection } from "@/features/booking/contexts/CinemaSelectionContext";
import { useLocale } from "@/contexts/LocaleContext";
import BookingBottomBar from "@/components/booking/BookingBottomBar";

export default function BottomBar({ movieSlug }: { movieSlug: string }) {
  const {
    selectedCinema,
    selectedTime,
    selectedShowtimeId,
    selectedDate,
    hasSelection,
    clearSelection,
  } = useCinemaSelection();
  const { translate } = useLocale();

  const seatsQuery = new URLSearchParams();
  if (selectedShowtimeId) seatsQuery.set("showtimeId", selectedShowtimeId);
  if (selectedCinema) seatsQuery.set("cinema", selectedCinema.id);
  if (selectedTime) seatsQuery.set("time", selectedTime);
  if (selectedDate) seatsQuery.set("date", selectedDate);

  const query = seatsQuery.toString();
  const seatsHref = `/booking/${movieSlug}/seats${query ? `?${query}` : ""}`;

  return (
    <BookingBottomBar
      selectionInfo={
        hasSelection && selectedCinema
          ? {
              label: selectedCinema.name,
              subLabel: selectedCinema.address,
              secondaryLabel: selectedTime,
              secondaryLabelKey: translate("booking.cinema.showtime"),
              showClearButton: true,
              onClear: clearSelection,
            }
          : undefined
      }
      canProceed={hasSelection}
      ctaText={translate("booking.cinema.select_seats")}
      ctaHref={seatsHref}
      promptText={translate("booking.cinema.select_prompt")}
    />
  );
}
