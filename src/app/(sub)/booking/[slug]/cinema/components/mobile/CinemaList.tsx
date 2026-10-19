"use client";

import { MapPin } from "lucide-react";
import { useCinemaSelection } from "@/features/booking/hooks/useCinemaSelection";
import { useLocale } from "@/contexts/LocaleContext";
import CinemaCard from "@/components/ui/CinemaCard";
import type { Cinema } from "@/features/booking/types";

export default function CinemaList({ cinemas }: { cinemas: Cinema[] }) {
  const { translate } = useLocale();
  const { query, setQuery, filteredCinemas, selectedCinemaId, selectedTime, handleSelect } =
    useCinemaSelection(cinemas);

  if (filteredCinemas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <MapPin size={36} className="text-(--color-border)" />
        <p className="text-sm text-center text-(--color-text-muted)">
          {translate("booking.cinema.no_results")} &ldquo;{query}&rdquo;
        </p>
        <button
          type="button"
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
