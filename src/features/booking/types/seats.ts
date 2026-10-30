/* ─── Seat Types ─────────────────────────────────────────── */

export type SeatKind = "available" | "vip" | "sweetbox";
export type SeatStatus = "idle" | "selected" | "occupied";

export interface Seat {
  col: number;
  kind: SeatKind;
  status: SeatStatus;
  pairId?: string;
  /** Backend seat UUIDs — one per chair; a sweetbox cell carries its pair. */
  seatIds: string[];
  /** Price of this cell; a sweetbox cell covers both chairs of the pair. */
  price: number;
}

export interface SeatRow {
  label: string;
  segments: Seat[][];
}

export interface SeatPrice {
  available: number;
  vip: number;
  sweetbox: number;
}

