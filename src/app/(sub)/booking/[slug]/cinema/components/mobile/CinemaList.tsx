"use client";

import { MapPin } from "lucide-react";
import { useCinemaSelection } from "@/features/booking/hooks/useCinemaSelection";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useLocale } from "@/contexts/LocaleContext";
import CinemaCard from "@/components/shared/showtimes/CinemaCard";
import { PRESS_CLASS } from "@/libs/press";
import type { Cinema } from "@/features/booking/types";

export default function CinemaList({ cinemas }: { cinemas: Cinema[] }) {
  const { translate } = useLocale();
  const { userCoordinates, status, retry } = useUserLocation();
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

  const statusText =
    status === "locating"
      ? translate("booking.cinema.location_loading")
      : status === "ready"
        ? translate("booking.cinema.location_enabled")
        : status === "denied"
          ? translate("booking.cinema.location_denied")
          : status === "unavailable"
            ? translate("booking.cinema.location_unavailable")
            : "";
  const canRetry = status === "denied" || status === "unavailable";

  return (
    <div className="space-y-3">
      {(statusText || canRetry) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {statusText && (
            <p
              role="status"
              className="inline-flex items-center gap-2 text-xs text-(--color-text-muted)"
            >
              <MapPin size={14} />
              {statusText}
            </p>
          )}
          {canRetry && (
            <button
              type="button"
              onClick={retry}
              className={`inline-flex text-xs font-bold text-(--color-gold) underline underline-offset-2 ${PRESS_CLASS}`}
            >
              {translate("booking.cinema.location_retry")}
            </button>
          )}
        </div>
      )}
      {filteredCinemas.map((cinema) => (
        <CinemaCard
          key={cinema.id}
          cinema={cinema}
          selectedCinemaId={selectedCinemaId}
          selectedTime={selectedTime}
          onSelect={handleSelect}
          userCoordinates={userCoordinates}
        />
      ))}
    </div>
  );
}
