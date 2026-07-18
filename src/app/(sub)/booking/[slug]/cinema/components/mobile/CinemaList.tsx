"use client";

import { MapPin } from "lucide-react";
import { useCinemaSelection } from "@/features/booking/contexts/CinemaSelectionContext";
import { useLocale } from "@/contexts/LocaleContext";
import CinemaCard from "./CinemaCard";

export default function CinemaList() {
  const { filteredCinemas, selectedCinemaId, selectedTime, handleSelect, query, setQuery } =
    useCinemaSelection();
  const { translate } = useLocale();

  if (filteredCinemas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <MapPin size={36} className="text-(--color-border)" />
        <p className="text-sm text-center text-(--color-text-muted)">
          {translate("booking.cinema.no_results")} &ldquo;{query}&rdquo;
        </p>
        <button
          onClick={() => setQuery("")}
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
