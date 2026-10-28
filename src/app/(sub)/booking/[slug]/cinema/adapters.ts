import enMessages from "@/locales/en.json";
import vnMessages from "@/locales/vn.json";
import { toShowtimeDateChips } from "@/features/showtimes/utils";
import type { ShowtimeDateOption, ShowtimesResponse } from "@/features/showtimes/types";
import type { Cinema, DateOption } from "@/features/booking/types";

/** Showtime `date` params are plain `YYYY-MM-DD` wall-clock days. */
export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Backend date records → the booking step's chips. `dayOfWeek` arrives in the
 * request locale; today's chip shows the translated "today" word instead.
 */
export function toDateOptions(
  records: ShowtimeDateOption[],
  today: string,
  locale: "en" | "vn",
): DateOption[] {
  const todayWord = (locale === "vn" ? vnMessages : enMessages).common.today.toUpperCase();
  const byDate = new Map(records.map((record) => [record.date, record]));
  return toShowtimeDateChips(records, locale).map((chip) => ({
    value: chip.value,
    day: byDate.get(chip.value)?.day ?? Number(chip.day),
    month: chip.label,
    weekday: chip.value === today ? todayWord : (chip.weekday ?? ""),
  }));
}

/** Showtimes arrive already grouped by cinema — reshape them for the step's cards. */
export function toCinemas(groups: ShowtimesResponse["cinemas"]): Cinema[] {
  return groups.map((group) => ({
    id: group.id,
    name: group.name,
    address: group.address,
    badge: group.badge,
    badgeColor: "",
    showtimes: group.showtimes.map((slot) => ({
      id: slot.id,
      time: slot.startTime,
      room: slot.roomName,
      available: slot.isAvailable,
    })),
  }));
}
