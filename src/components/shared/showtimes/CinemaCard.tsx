"use client";

import { MapPin } from "lucide-react";
import type { Cinema } from "@/features/showtimes/types";

export default function CinemaCard({
  cinema,
  selectedCinemaId,
  selectedTime,
  onSelect,
}: {
  cinema: Cinema;
  selectedCinemaId: string | null;
  selectedTime: string;
  onSelect: (
    cinemaId: string,
    time: string,
    meta?: { room?: string; date?: string; showtimeId?: string },
  ) => void;
}) {
  // Every caller picks cinema + slot in one dispatch (booking `handleSelect`,
  // modify `selectedShowtime`), so the id alone identifies the active card.
  const isActive = selectedCinemaId === cinema.id;

  return (
    <article
      className={`rounded-2xl overflow-hidden transition duration-200 border ${
        isActive
          ? "bg-(--color-surface) border-(--color-gold) shadow-[0_0_0_1px_rgba(255,204,77,0.15)]"
          : "bg-(--color-surface) border-(--color-border)"
      }`}
    >
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-1.5">
          <h3
            className={`font-extrabold text-sm tracking-wide leading-tight ${
              isActive ? "text-(--color-gold)" : "text-(--color-text-primary)"
            }`}
          >
            {cinema.name}
          </h3>
          {cinema.distance && (
            <span className="flex items-center gap-1 shrink-0 ml-3 px-2.5 py-1 rounded-full text-2xs font-bold bg-(--color-surface-2) text-(--color-text-muted)">
              <MapPin size={10} />
              {cinema.distance}
            </span>
          )}
        </div>

        <p className="text-xs mb-4 text-(--color-text-muted)">{cinema.address}</p>

        <div className="flex flex-wrap gap-2">
          {cinema.showtimes.map(({ id, time, available, room, date }) => {
            const isTimeActive = isActive && selectedTime === time;
            return (
              <button
                type="button"
                key={`${id ?? time}-${date ?? ""}`}
                onClick={() => {
                  if (available) onSelect(cinema.id, time, { room, date, showtimeId: id });
                }}
                disabled={!available}
                aria-pressed={isTimeActive}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition duration-150 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold) ${
                  isTimeActive
                    ? "bg-(--color-gold) border-(--color-gold) text-(--color-bg) shadow-(--shadow-glow)"
                    : !available
                      ? "bg-transparent border-(--color-border) text-(--color-text-muted) line-through opacity-50 cursor-not-allowed"
                      : "bg-(--color-surface-2) border-(--color-border) text-(--color-text-primary) hover:border-(--color-gold)/50 hover:text-(--color-gold)"
                }`}
              >
                <span>{time}</span>
                {date && <span className="block text-3xs mt-0.5 opacity-70">{date}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
