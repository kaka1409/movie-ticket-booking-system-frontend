"use client";

import { useMemo } from "react";
import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import BookingBottomBar from "@/components/shared/BookingBottomBar";
import type { Cinema } from "@/features/booking/types";

export default function BottomBar({
  movieSlug,
  cinemas,
}: {
  movieSlug: string;
  cinemas: Cinema[];
}) {
  const { cinemaId, time, date, showtimeId, clearCinemaSlot } = useBooking();
  const { translate } = useLocale();

  const selectedCinema = useMemo(
    () => cinemas.find((cinema) => cinema.id === cinemaId),
    [cinemas, cinemaId],
  );
  const hasSelection = Boolean(selectedCinema && time);

  const seatsQuery = new URLSearchParams();
  if (showtimeId) seatsQuery.set("showtimeId", showtimeId);
  if (selectedCinema) seatsQuery.set("cinema", selectedCinema.id);
  if (time) seatsQuery.set("time", time);
  if (date) seatsQuery.set("date", date);

  const query = seatsQuery.toString();
  const seatsHref = `/booking/${movieSlug}/seats${query ? `?${query}` : ""}`;

  return (
    <BookingBottomBar
      selectionInfo={
        hasSelection && selectedCinema
          ? {
              label: selectedCinema.name,
              subLabel: selectedCinema.address,
              secondaryLabel: time,
              secondaryLabelKey: translate("booking.cinema.showtime"),
              showClearButton: true,
              onClear: clearCinemaSlot,
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
