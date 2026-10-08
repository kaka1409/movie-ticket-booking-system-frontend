import type { ShowtimeDateOption } from "./types";
import { formatDateOnly } from "@/libs/date";
import { DATE_STRIP_DAYS } from "./constants";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Shift a `YYYY-MM-DD` string by `days` calendar days (local time). */
function shiftISODate(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  return formatDateOnly(new Date(year, month - 1, day + days));
}

/**
 * Validate an external `?date=` deep-link value: it must be a real calendar
 * date and either on the API's available list or — when the dates API is
 * unavailable — inside the local fallback strip.
 */
export function isValidDateParam(value: string, availableDates: string[], today: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  if (availableDates.length > 0) return availableDates.includes(value);
  const last = shiftISODate(today, DATE_STRIP_DAYS - 1);
  return value >= today && value <= last;
}

export interface ShowtimeDateChip {
  label: string;
  day: string;
  weekday?: string;
  value: string;
  disabled?: boolean;
}

function toLocaleTag(locale: "en" | "vn"): string {
  return locale === "vn" ? "vi-VN" : "en-US";
}

function toMonthLabel(date: Date, locale: "en" | "vn"): string {
  return date.toLocaleDateString(toLocaleTag(locale), { month: "short" }).toUpperCase();
}

function toWeekdayLabel(date: Date, locale: "en" | "vn"): string {
  return date.toLocaleDateString(toLocaleTag(locale), { weekday: "short" }).toUpperCase();
}

/**
 * Map backend date records (real dates that have showtimes: YYYY-MM-DD + day
 * + month) to display-ready date chips.
 */
export function toShowtimeDateChips(
  records: ShowtimeDateOption[],
  locale: "en" | "vn",
): ShowtimeDateChip[] {
  return records.map((record) => {
    const [year, month, day] = record.date.split("-").map(Number);

    return {
      label: toMonthLabel(new Date(year, month - 1, day), locale),
      day: String(record.day),
      weekday: (
        record.dayOfWeek || toWeekdayLabel(new Date(year, month - 1, day), locale)
      ).toUpperCase(),
      value: record.date,
      disabled: !record.hasShowtimes,
    };
  });
}

/** Local fallback chips used only when the showtime-dates API is unavailable. */
export function buildFallbackDateChips(
  anchor: string,
  locale: "en" | "vn",
  days: number,
): ShowtimeDateChip[] {
  const [year, month, day] = anchor.split("-").map(Number);

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(year, month - 1, day + index);

    return {
      label: toMonthLabel(date, locale),
      day: String(date.getDate()),
      weekday: toWeekdayLabel(date, locale),
      value: formatDateOnly(date),
    };
  });
}
