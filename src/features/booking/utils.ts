import type { Seat } from "./types";

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
