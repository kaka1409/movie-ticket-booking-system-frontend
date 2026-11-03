"use client";

import { MapPin } from "lucide-react";
import type { Cinema, Showtime } from "@/features/showtimes/types";
import { useLocale } from "@/contexts/LocaleContext";
import { buildMapsHref, formatDistanceKm, getDistanceKm, type Coordinates } from "@/libs/geo";
import { PRESS_SOFT_CLASS } from "@/libs/press";

/** Split a cinema's slots into 2D / IMAX / … blocks, mirroring the movie detail. */
function groupByFormat(showtimes: Showtime[]): [string, Showtime[]][] {
  const groups = new Map<string, Showtime[]>();

  for (const showtime of showtimes) {
    const format = showtime.format || "2D";
    const slots = groups.get(format);
    if (slots) slots.push(showtime);
    else groups.set(format, [showtime]);
  }

  return [...groups.entries()];
}

export default function CinemaCard({
  cinema,
  selectedCinemaId,
  selectedTime,
  onSelect,
  userCoordinates,
}: {
  cinema: Cinema;
  selectedCinemaId: string | null;
  selectedTime: string;
  userCoordinates?: Coordinates | null;
  onSelect: (
    cinemaId: string,
    time: string,
    meta?: { room?: string; date?: string; showtimeId?: string },
  ) => void;
}) {
  const { locale, translate } = useLocale();
  // Every caller picks cinema + slot in one dispatch (booking `handleSelect`,
  // modify `selectedShowtime`), so the id alone identifies the active card.
  const isActive = selectedCinemaId === cinema.id;
  const distanceKm =
    userCoordinates && cinema.latitude != null && cinema.longitude != null
      ? getDistanceKm(userCoordinates, { latitude: cinema.latitude, longitude: cinema.longitude })
      : null;
  // The chip stays short so a phone-width card never wraps; the full
  // "(straight-line)" wording rides along as the accessible name and tooltip.
  const shortDistance =
    distanceKm === null ? cinema.distance : `${formatDistanceKm(distanceKm, locale)} km`;
  const fullDistance =
    distanceKm === null
      ? undefined
      : `${formatDistanceKm(distanceKm, locale)} ${translate("booking.cinema.distance_away")}`;

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
          {shortDistance && (
            <span
              title={fullDistance}
              className="flex items-center gap-1 shrink-0 ml-3 px-2.5 py-1 rounded-full text-2xs font-bold bg-(--color-surface-2) text-(--color-text-muted)"
            >
              <MapPin size={10} aria-hidden="true" />
              <span aria-hidden={fullDistance ? true : undefined}>{shortDistance}</span>
              {fullDistance && <span className="sr-only">{fullDistance}</span>}
            </span>
          )}
        </div>

        {/* Modify rows carry no address, so the link falls back to the cinema name. */}
        {cinema.address && (
          <p className="text-xs mb-1.5 text-(--color-text-muted)">{cinema.address}</p>
        )}
        <a
          href={buildMapsHref(cinema)}
          target="_blank"
          rel="noreferrer"
          aria-label={`${translate("booking.common.open_map")} — ${cinema.name}`}
          className={`mb-4 inline-flex items-center gap-1 text-2xs font-bold text-(--color-text-muted) hover:text-(--color-gold) ${PRESS_SOFT_CLASS}`}
        >
          <MapPin size={10} aria-hidden="true" />
          {translate("booking.common.open_map_short")}
        </a>

        <div className="space-y-2.5">
          {groupByFormat(cinema.showtimes).map(([format, showtimes]) => (
            <div key={format}>
              <p className="mb-1.5 text-3xs font-black uppercase tracking-widest text-(--color-text-muted)">
                {format}
              </p>
              <div className="flex flex-wrap gap-2">
                {showtimes.map(({ id, time, available, room, date }) => {
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
          ))}
        </div>
      </div>
    </article>
  );
}
