"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import CinemaCard from "@/components/ui/CinemaCard";
import type { Cinema } from "@/features/booking/types";
import type { EligibleShowtime } from "@/features/tickets/types";

function groupToCinemas(
  showtimes: EligibleShowtime[],
  stripDate?: boolean
): Cinema[] {
  const grouped = showtimes.reduce<Record<string, EligibleShowtime[]>>(
    (acc, showtime) => {
      (acc[showtime.cinemaId] ??= []).push(showtime);
      return acc;
    },
    {}
  );

  return Object.entries(grouped).map(([id, items]) => ({
    id,
    name: items[0].cinemaName,
    address: items[0].address,
    distance: items[0].distance,
    badge: "",
    badgeColor: "",
    showtimes: items.map((s) => ({
      time: s.time,
      room: s.room,
      available: true,
      date: stripDate ? undefined : s.date,
    })),
  }));
}

export default function ShowtimeList() {
  const { translate } = useLocale();
  const {
    showtimes,
    selectedShowtime,
    setSelectedShowtime,
    selectedDate,
    query,
  } = useModification();

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
        (s) =>
          s.cinemaName.toLowerCase().includes(normalizedQuery) ||
          s.address.toLowerCase().includes(normalizedQuery)
      )
    : showtimes;

  const filtered =
    selectedDate && searched.length > 0
      ? searched.filter((s) => s.date === selectedDate)
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
    meta?: { room?: string; date?: string; showtimeId?: string }
  ) => {
    const matched = filtered.find(
      (showtime) =>
        showtime.cinemaId === cinemaId &&
        showtime.time === time &&
        (meta?.date ? showtime.date === meta.date : true)
    );

    if (matched) {
      setSelectedShowtime(
        selectedShowtime?.cinemaId === cinemaId &&
          selectedShowtime?.time === time
          ? null
          : matched
      );
    }
  };

  return (
    <section className="space-y-4">
      <p className="text-[9px] font-black tracking-[0.16em] uppercase text-(--color-text-muted)">
        {translate("tickets.modify.showtime.available_showtimes")}
      </p>
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
