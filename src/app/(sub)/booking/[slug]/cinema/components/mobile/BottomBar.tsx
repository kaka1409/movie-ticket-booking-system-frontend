"use client";

import { useMemo } from "react";
import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import BookingBottomBar from "@/components/shared/BookingBottomBar";
import { buildSeatsHref } from "@/features/booking/utils/cinema";
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

  const seatsHref = buildSeatsHref(movieSlug, { showtimeId, cinemaId, time, date });

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
