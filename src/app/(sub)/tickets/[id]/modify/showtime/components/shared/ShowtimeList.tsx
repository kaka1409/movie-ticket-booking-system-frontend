"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import CinemaCard from "@/components/shared/showtimes/CinemaCard";
import MicroLabel from "@/components/ui/MicroLabel";
import type { Cinema } from "@/features/booking/types";
import type { EligibleShowtime } from "@/features/tickets/types";

function groupToCinemas(showtimes: EligibleShowtime[], stripDate?: boolean): Cinema[] {
  const grouped = showtimes.reduce<Record<string, EligibleShowtime[]>>((acc, showtime) => {
    (acc[showtime.cinemaId] ??= []).push(showtime);
    return acc;
  }, {});

  return Object.entries(grouped).map(([id, items]) => ({
    id,
    name: items[0].cinemaName,
    address: items[0].address,
    distance: items[0].distance,
    badge: "",
    badgeColor: "",
    showtimes: items.map((slot) => ({
      time: slot.time,
      room: slot.room,
      available: true,
      date: stripDate ? undefined : slot.date,
      format: slot.format,
    })),
  }));
}

/**
 * Eligible slots grouped by cinema, filtered by the draft's search text and the
 * picked day. Selection writes to the draft so the rail can read it; picking the
 * already-selected slot clears it.
 */
export default function ShowtimeList() {
  const { translate } = useLocale();
  const { showtimes, selectedShowtime, setSelectedShowtime, selectedDate, query } =
    useModification();

  if (showtimes.length === 0) {
    return (
      <section className="py-8 text-center">
        <p className="text-sm text-(--color-text-muted)">
          {translate("tickets.modify.showtime.no_showtimes")}
        </p>
      </section>
    );
  }

  const normalizedQuery = query.toLowerCase();

  const searched = normalizedQuery
    ? showtimes.filter(
        (showtime) =>
          showtime.cinemaName.toLowerCase().includes(normalizedQuery) ||
          showtime.address.toLowerCase().includes(normalizedQuery),
      )
    : showtimes;

  const filtered =
    selectedDate && searched.length > 0
      ? searched.filter((showtime) => showtime.date === selectedDate)
      : searched;

  if (filtered.length === 0) {
    return (
      <section className="py-8 text-center">
        <p className="text-sm text-(--color-text-muted)">
          {query
            ? translate("tickets.modify.showtime.no_results")
            : translate("tickets.modify.showtime.no_showtimes")}
        </p>
      </section>
    );
  }

  const cinemas = groupToCinemas(filtered, !!selectedDate);

  const selectedCinemaId = selectedShowtime?.cinemaId ?? null;
  const selectedTime = selectedShowtime?.time ?? "";

  const handleSelect = (
    cinemaId: string,
    time: string,
    meta?: { room?: string; date?: string; showtimeId?: string },
  ) => {
    const matched = filtered.find(
      (showtime) =>
        showtime.cinemaId === cinemaId &&
        showtime.time === time &&
        (meta?.date ? showtime.date === meta.date : true),
    );

    if (matched) {
      setSelectedShowtime(
        selectedShowtime?.cinemaId === cinemaId && selectedShowtime?.time === time ? null : matched,
      );
    }
  };

  return (
    <section className="space-y-4">
      <MicroLabel className="text-(--color-text-muted)">
        {translate("tickets.modify.showtime.available_showtimes")}
      </MicroLabel>
      <div className="space-y-3">
        {cinemas.map((cinema) => (
          <CinemaCard
            key={cinema.id}
            cinema={cinema}
            selectedCinemaId={selectedCinemaId}
            selectedTime={selectedTime}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </section>
  );
}
