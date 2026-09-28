import type { ShowtimeDateOption } from "./types";

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
  return date
    .toLocaleDateString(toLocaleTag(locale), { month: "short" })
    .toUpperCase();
}

function toWeekdayLabel(date: Date, locale: "en" | "vn"): string {
  return date
    .toLocaleDateString(toLocaleTag(locale), { weekday: "short" })
    .toUpperCase();
}

/* Backend sends the real dates that have showtimes (YYYY-MM-DD + day + month). */
export function toShowtimeDateChips(
  records: ShowtimeDateOption[],
  locale: "en" | "vn",
): ShowtimeDateChip[] {
  return records.map((record) => {
    const [year, month, day] = record.date.split("-").map(Number);

    return {
      label: toMonthLabel(new Date(year, month - 1, day), locale),
      day: String(record.day),
      weekday: (record.dayOfWeek || toWeekdayLabel(new Date(year, month - 1, day), locale)).toUpperCase(),
      value: record.date,
      disabled: !record.hasShowtimes,
    };
  });
}

/* Local fallback used only when the showtime-dates API is unavailable. */
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
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
    };
  });
}