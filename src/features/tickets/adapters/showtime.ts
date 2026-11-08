import { getRoomDisplayName, toLocaleTag } from "@/libs/utils";
import type { DateOption } from "@/features/booking/types";
import type { EligibleShowtime, EligibleShowtimeWire } from "../types";

/** Wire row → the modification UI shape (no address/distance in the source payload). */
export function toEligibleShowtime(
  row: EligibleShowtimeWire,
  locale: "en" | "vn",
): EligibleShowtime {
  return {
    showtimeId: row.showtimeId,
    date: row.date,
    time: row.startTime,
    room: getRoomDisplayName(row.room, locale),
    cinemaId: row.cinema.id,
    cinemaName: row.cinema.name,
    address: "",
    distance: "",
    format: row.format,
    requiresSeatSelection: row.requiresSeatSelection,
  };
}

/** Distinct showtime dates → the booking date-strip options (ascending). */
export function toEligibleDateOptions(
  showtimes: EligibleShowtime[],
  locale: "en" | "vn",
): DateOption[] {
  const tag = toLocaleTag(locale);
  const seen = new Set<string>();
  const options: DateOption[] = [];

  for (const showtime of showtimes) {
    if (seen.has(showtime.date)) continue;
    seen.add(showtime.date);
    const [year, month, day] = showtime.date.split("-").map(Number);
    const at = new Date(year, month - 1, day);
    options.push({
      value: showtime.date,
      day,
      month: at.toLocaleDateString(tag, { month: "short" }).toUpperCase(),
      weekday: at.toLocaleDateString(tag, { weekday: "short" }).toUpperCase(),
    });
  }

  return options.sort((first, second) => first.value.localeCompare(second.value));
}
