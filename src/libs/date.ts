/**
 * Local calendar-date helpers shared by the movies catalog, showtimes and
 * movie detail pages. Dates here are calendar days (booking grids, release
 * windows) — not instants — so everything intentionally uses LOCAL date parts
 * with no timezone conversion.
 */

import { toLocaleTag } from "./utils";

/** Showtime calendars are Vietnamese walls — the backend keys them on this zone. */
const CINEMA_TIMEZONE = "Asia/Ho_Chi_Minh";

/** Format a `Date` as `YYYY-MM-DD` from its local parts. */
export function formatDateOnly(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Today as `YYYY-MM-DD` in the cinema's timezone — showtime dates are keyed on
 * that calendar day, so the server's own timezone must not decide it.
 */
export function todayInCinemaZone(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: CINEMA_TIMEZONE });
}

/**
 * Day-of-month for display chips (`1` → `"01"`). Accepts the backend's number
 * or an already-string chip value — padding is a display concern, so the
 * `DateOption.day: number` / record types stay untouched.
 */
export function formatDayOfMonth(day: number | string): string {
  return String(day).padStart(2, "0");
}

/**
 * Value for `<input type="date">`. The backend serialises `dob` as an ISO
 * timestamp (e.g. `1999-05-12T00:00:00.000Z`), which a date input rejects —
 * it needs the calendar-day portion only. Returns `""` for null/unparseable
 * input so a missing value never renders a malformed field.
 */
export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match ? match[1] : "";
}

/**
 * Render a calendar day (`YYYY-MM-DD`, typically from `toDateInputValue`) in the
 * UI locale without the timezone drift `formatDate` would introduce by parsing
 * the string as a UTC instant.
 */
export function formatCalendarDate(value: string | null | undefined, locale: "en" | "vn"): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return "";
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString(toLocaleTag(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Showtime `date` (`YYYY-MM-DD`) + `startTime` (`HH:mm`) → card label
 * (`Fri, Nov 10, 20:00` in EN, `Th 6, 10 thg 11, 20:00` in VN). Both halves are
 * cinema wall clock, so the parts are composed with local setters — never the
 * host timezone — and the clock stays 24-hour in both locales.
 */
export function formatShowtimeWallClock(
  showtimeDate: string,
  showtimeStart: string,
  locale: "en" | "vn",
): string {
  const [year, month, day] = showtimeDate.split("-").map(Number);
  const [hours, minutes] = showtimeStart.split(":").map(Number);
  const at = new Date(year, month - 1, day, hours, minutes);
  const tag = toLocaleTag(locale);
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
