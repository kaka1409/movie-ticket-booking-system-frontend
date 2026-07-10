"use client";

import { MapPin } from "lucide-react";
import { Cinema } from "@/features/booking/types";

export default function CinemaCard({
  cinema,
  selectedCinemaId,
  selectedTime,
  onSelect,
}: {
  cinema: Cinema;
  selectedCinemaId: number | null;
  selectedTime: string;
  onSelect: (cinemaId: number, time: string) => void;
}) {
  const isActive = selectedCinemaId === cinema.id;

  return (
    <article
      className={`rounded-2xl overflow-hidden transition-all duration-200 border ${
        isActive
          ? "bg-(--color-surface) border-(--color-gold) shadow-[0_0_0_1px_rgba(255,204,77,0.15)]"
          : "bg-(--color-surface) border-(--color-border)"
      }`}
    >
      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-1.5">
          <h3
            className={`font-extrabold text-sm tracking-wide leading-tight ${
              isActive ? "text-(--color-gold)" : "text-(--color-text-primary)"
            }`}
          >
            {cinema.name}
          </h3>
          <span className="flex items-center gap-1 shrink-0 ml-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-(--color-surface-2) text-(--color-text-muted)">
            <MapPin size={10} />
            {cinema.distance}
          </span>
        </div>

        {/* Address */}
        <p className="text-xs mb-4 text-(--color-text-muted)">
          {cinema.address}
        </p>

        {/* Showtime chips */}
        <div className="flex flex-wrap gap-2">
          {cinema.showtimes.map(({ time, available }) => {
            const isTimeActive = isActive && selectedTime === time;
            return (
              <button
                key={time}
                onClick={() => available && onSelect(cinema.id, time)}
                disabled={!available}
                aria-pressed={isTimeActive}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 active:scale-[0.96] ${
                  isTimeActive
                    ? "bg-(--color-gold) border-(--color-gold) text-[#0F0F0F] shadow-(--shadow-glow)"
                    : !available
                    ? "bg-transparent border-(--color-border) text-(--color-text-muted) line-through opacity-50 cursor-not-allowed"
                    : "bg-(--color-surface-2) border-(--color-border) text-(--color-text-primary)"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
