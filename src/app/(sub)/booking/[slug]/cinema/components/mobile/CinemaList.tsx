"use client";

import { MapPin } from "lucide-react";
import { Cinema } from "@/features/booking/types";
import CinemaCard from "./CinemaCard";

export default function CinemaList({
  cinemas,
  selectedCinemaId,
  selectedTime,
  onSelect,
  query,
  onClearQuery,
}: {
  cinemas: Cinema[];
  selectedCinemaId: number | null;
  selectedTime: string;
  onSelect: (cinemaId: number, time: string) => void;
  query: string;
  onClearQuery: () => void;
}) {
  if (cinemas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <MapPin size={36} className="text-(--color-border)" />
        <p className="text-sm text-center text-(--color-text-muted)">
          No cinemas found for &ldquo;{query}&rdquo;
        </p>
        <button
          onClick={onClearQuery}
          className="text-sm font-bold underline underline-offset-2 text-(--color-gold)"
        >
          Clear search
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cinemas.map((cinema) => (
        <CinemaCard
          key={cinema.id}
          cinema={cinema}
          selectedCinemaId={selectedCinemaId}
          selectedTime={selectedTime}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
