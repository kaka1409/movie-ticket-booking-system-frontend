"use client";

import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import MicroLabel from "@/components/ui/MicroLabel";

/**
 * Which theater and which screening the draft is for — the rail's identity
 * block from the seats step onwards. Reads the adopted cinema slot, so it fills
 * in as soon as the cinema step (or a `?showtimeId=` deep link) lands.
 */
export default function RailTheater() {
  const { translate } = useLocale();
  const { cinemaName, room, date, time } = useBooking();

  const theater = [cinemaName, room].filter(Boolean).join(", ");

  return (
    <div className="space-y-1">
      <MicroLabel className="text-(--color-text-muted)">
        {translate("booking.common.theater")}
      </MicroLabel>
      <p className="text-sm font-bold text-(--color-text-primary)">{theater || "—"}</p>
      {date && time && (
        <p className="text-xs text-(--color-text-muted)">
          {date} • {time}
        </p>
      )}
    </div>
  );
}
