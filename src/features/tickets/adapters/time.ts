import { toLocaleTag } from "@/libs/utils";

/**
 * Backend `YYYY-MM-DD` + `HH:mm` → concrete instant. Both halves are
 * server-local wall clock (the backend reads the DATE/TIME columns without a
 * zone conversion — see `formatTime`), so the browser builds the same local
 * instant the formatter below renders. One source: the card label and the
 * countdown can never drift apart.
 */
export function buildShowtimeStart(showtimeDate: string, showtimeStart: string): Date {
  const [year, month, day] = showtimeDate.split("-").map(Number);
  const [hours, minutes] = showtimeStart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

/**
 * Epoch ms of the showtime end. A screening can run past midnight (`endTime`
 * before `startTime`), so roll the date-only half to the next day instead of
 * producing an end that precedes the start.
 */
export function buildShowtimeEnd(
  showtimeDate: string,
  showtimeEnd: string,
  startMs: number,
): number {
  const end = buildShowtimeStart(showtimeDate, showtimeEnd);
  if (end.getTime() <= startMs) end.setDate(end.getDate() + 1);
  return end.getTime();
}

/**
 * Backend `YYYY-MM-DD` + `HH:mm` → card display (`Fri, Nov 10, 20:00` in EN,
 * `Th 6, 10 thg 11, 20:00` in VN). 24-hour clock in both locales to match the
 * backend `HH:MM` convention — the backend sends structured parts, never a
 * preformatted string.
 */
export function formatTicketDatetime(
  showtimeDate: string,
  showtimeStart: string,
  locale: "en" | "vn",
): string {
  const tag = toLocaleTag(locale);
  const at = buildShowtimeStart(showtimeDate, showtimeStart);
  const datePart = new Intl.DateTimeFormat(tag, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(at);
  const timePart = new Intl.DateTimeFormat(tag, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(at);
  return `${datePart}, ${timePart}`;
}
