/**
 * Local calendar-date helpers shared by the movies catalog, showtimes and
 * movie detail pages. Dates here are calendar days (booking grids, release
 * windows) — not instants — so everything intentionally uses LOCAL date parts
 * with no timezone conversion.
 */

/** Format a `Date` as `YYYY-MM-DD` from its local parts. */
export function formatDateOnly(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
