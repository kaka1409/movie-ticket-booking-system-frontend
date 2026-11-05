"use client";

import { MapPinOff } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { ADMIN_CARD_CLASS } from "@/features/admin/constants";
import type { AdminCinema } from "@/features/admin/types";

/**
 * Google Maps embed preview of the selected cinema — the same keyless iframe
 * the booking rail uses (`output=embed`). Coordinates beat the address text
 * when the cinema carries them, since a lat/lng query pins the exact spot.
 */
export default function CinemaMap({ cinema }: { cinema: AdminCinema | null }) {
  const { translate } = useLocale();

  if (!cinema) {
    return (
      <div
        className={`${ADMIN_CARD_CLASS} flex h-[420px] flex-col items-center justify-center gap-2 px-6 text-center`}
      >
        <MapPinOff size={22} className="text-(--color-text-muted)" aria-hidden />
        <p className="text-xs font-bold text-(--color-text-primary)">
          {translate("admin.cinemas.map_empty_title")}
        </p>
        <p className="max-w-xs text-[11px] text-(--color-text-muted)">
          {translate("admin.cinemas.map_empty_body")}
        </p>
      </div>
    );
  }

  const query =
    cinema.latitude !== null && cinema.longitude !== null
      ? `${cinema.latitude},${cinema.longitude}`
      : cinema.address || cinema.name;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;

  return (
    <div className={`${ADMIN_CARD_CLASS} h-[420px] overflow-hidden`}>
      <iframe
        title={`${translate("admin.cinemas.title")} — ${cinema.name}`}
        src={embedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    </div>
  );
}
