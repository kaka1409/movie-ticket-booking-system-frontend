import type { Seat, SeatRow } from "../types";

/**
 * Identity/display label for a seat: `A1` for regular and VIP seats, `A(2)`
 * for sweetbox pairs (the `pairId` segment after the first `-`). Display only —
 * a seat's identity is its `seatIds` UUIDs, which is what the draft, the hold
 * and every restore matches on.
 */
export function getSeatLabel(rowLabel: string, seat: Seat): string {
  if (seat.kind === "sweetbox" && seat.pairId) {
    return `${rowLabel}(${seat.pairId.split("-").slice(1).join("-")})`;
  }
  return `${rowLabel}${seat.col}`;
}

/**
 * Re-mark cells as `selected` by seat id. `occupied` cells are skipped unless
 * `includeOccupied` is set: a server-confirmed hold of the caller's own
 * (`GET`/`PUT /seat-holds`) overrules the map, which can only paint an
 * identity-less request's held seats as `occupied` (contract §4.1.4).
 */
export function selectCellsByIds(
  base: SeatRow[],
  wanted: Set<string>,
  options: { includeOccupied?: boolean } = {},
): SeatRow[] {
  if (wanted.size === 0) return base;
  const { includeOccupied = false } = options;

  return base.map((row) => ({
    ...row,
    segments: row.segments.map((segment) =>
      segment.map((cell) =>
        cell.seatIds.some((id) => wanted.has(id)) &&
        (cell.status === "idle" || (includeOccupied && cell.status === "occupied"))
          ? { ...cell, status: "selected" as const }
          : cell,
      ),
    ),
  }));
}

/**
 * After back-navigation, re-mark the draft's seats on a fresh server map.
 * Matching is by `seatIds`, never by label: labels repeat across rooms, so a
 * label match would re-select a different seat after a showtime change.
 */
export function restoreSelectedSeats(
  base: SeatRow[],
  savedSeats: { seatIds: string[] }[],
  options: { includeOccupied?: boolean } = {},
): SeatRow[] {
  const wanted = new Set(savedSeats.flatMap((seat) => seat.seatIds));
  return selectCellsByIds(base, wanted, options);
}

/** Drop every selected cell (hold expiry — the backend released our seats). */
export function clearGridSelection(base: SeatRow[]): SeatRow[] {
  return base.map((row) => ({
    ...row,
    segments: row.segments.map((segment) =>
      segment.map((cell) =>
        cell.status === "selected" ? { ...cell, status: "idle" as const } : cell,
      ),
    ),
  }));
}
