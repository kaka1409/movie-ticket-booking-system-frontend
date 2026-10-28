"use client";

import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import BookingBottomBar from "@/components/shared/BookingBottomBar";
import { buildSeatsHref } from "@/features/booking/utils/cinema";

/**
 * Cinema-step bottom bar. The draft already carries the picked cinema's name and
 * address (`resolveSlotSelection` writes them with the id), so the bar does not
 * need the schedule list — it paints, and updates, without the streamed slots.
 */
export default function BottomBar({ movieSlug }: { movieSlug: string }) {
  const { cinemaId, cinemaName, location, time, date, showtimeId, clearCinemaSlot } = useBooking();
  const { translate } = useLocale();

  const hasSelection = Boolean(cinemaId && time);
  const seatsHref = buildSeatsHref(movieSlug, { showtimeId, cinemaId, time, date });

  return (
    <BookingBottomBar
      selectionInfo={
        hasSelection
          ? {
              label: cinemaName,
              subLabel: location,
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
