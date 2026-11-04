/**
 * Backend `YYYY-MM-DD` + `HH:mm` → concrete instant. Both halves are
 * server-local wall clock (the backend reads the DATE/TIME columns without a
 * zone conversion — see `formatTime`), so the browser builds the same local
 * instant `libs/date`'s `formatShowtimeWallClock` renders. One source: the card
 * label and the countdown can never drift apart.
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
