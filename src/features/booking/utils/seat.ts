import type { Seat, SeatRow } from "../types";

/**
 * Identity/display label for a seat: `A1` for regular and VIP seats, `A(2)`
 * for sweetbox pairs (the `pairId` segment after the first `-`). The exact
 * string is used as the seat's identity in BookingContext, ticket transfer
 * and the modify flow — changing the format would orphan saved selections.
 */
export function getSeatLabel(rowLabel: string, seat: Seat): string {
  if (seat.kind === "sweetbox" && seat.pairId) {
    return `${rowLabel}(${seat.pairId.split("-").slice(1).join("-")})`;
  }
  return `${rowLabel}${seat.col}`;
}

/**
 * After back-navigation, re-mark the seats saved in the booking draft as
 * `selected`. Labels are built with the same format as the draft sync
 * (`A1` for regular/VIP, `A(1)` for sweetbox pairs). Occupied cells are never
 * re-selected — after a `SEAT_TAKEN` bounce the stolen seats stay greyed out.
 */
export function restoreSelectedSeats(base: SeatRow[], savedSeats: { label: string }[]): SeatRow[] {
  if (savedSeats.length === 0) return base;
  return base.map((row) => ({
    ...row,
    segments: row.segments.map((segment) =>
      segment.map((seat) => {
        const found =
          seat.status === "idle" &&
          savedSeats.some((savedSeat) => savedSeat.label === getSeatLabel(row.label, seat));
        return found ? { ...seat, status: "selected" as const } : seat;
      }),
    ),
  }));
}

/** Select every idle cell carrying one of `wanted`'s seat ids (hold restore / conflict survivor). */
export function selectCellsByIds(base: SeatRow[], wanted: Set<string>): SeatRow[] {
  if (wanted.size === 0) return base;
  return base.map((row) => ({
    ...row,
    segments: row.segments.map((segment) =>
      segment.map((cell) =>
        cell.status === "idle" && cell.seatIds.some((id) => wanted.has(id))
          ? { ...cell, status: "selected" as const }
          : cell,
      ),
    ),
  }));
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
