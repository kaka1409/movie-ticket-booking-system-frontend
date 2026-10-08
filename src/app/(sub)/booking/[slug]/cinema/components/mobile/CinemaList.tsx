"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { resolveSlotSelection } from "@/features/booking/utils/cinema";
import { useLocale } from "@/contexts/LocaleContext";
import CinemaCard from "@/components/ui/CinemaCard";
import type { Cinema } from "@/features/booking/types";

export default function CinemaList({ cinemas }: { cinemas: Cinema[] }) {
  const {
    cinemaQuery,
    setCinemaQuery,
    cinemaId: selectedCinemaId,
    time: selectedTime,
    date,
    setCinema,
    clearCinemaSlot,
  } = useBooking();
  const { translate } = useLocale();

  const filteredCinemas = useMemo(
    () =>
      cinemas.filter(
        (cinema) =>
          cinema.name.toLowerCase().includes(cinemaQuery.toLowerCase()) ||
          cinema.address.toLowerCase().includes(cinemaQuery.toLowerCase()),
      ),
    [cinemas, cinemaQuery],
  );

  /* Same cinema + time = toggle off; otherwise write the slot into the draft
     (room/showtime id resolved against this cinema's slots). */
  const handleSelect = (
    cinemaId: string,
    time: string,
    meta?: { room?: string; date?: string; showtimeId?: string },
  ) => {
    if (selectedCinemaId === cinemaId && selectedTime === time) {
      clearCinemaSlot();
      return;
    }

    const cinema = cinemas.find((entry) => entry.id === cinemaId);
    if (!cinema) return;

    setCinema(resolveSlotSelection(cinema, time, date, meta?.showtimeId ?? ""));
  };

  if (filteredCinemas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <MapPin size={36} className="text-(--color-border)" />
        <p className="text-sm text-center text-(--color-text-muted)">
          {translate("booking.cinema.no_results")} &ldquo;{cinemaQuery}&rdquo;
        </p>
        <button
          type="button"
          onClick={() => setCinemaQuery("")}
          className="text-sm font-bold underline underline-offset-2 text-(--color-gold)"
        >
          {translate("booking.cinema.clear_search")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredCinemas.map((cinema) => (
        <CinemaCard
          key={cinema.id}
          cinema={cinema}
          selectedCinemaId={selectedCinemaId}
          selectedTime={selectedTime}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
