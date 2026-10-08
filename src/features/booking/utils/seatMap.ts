import type { SeatMapCell, SeatMapResponse, SeatMapRow, Seat, SeatRow, SeatPrice } from "../types";

export interface AdaptedSeatMap {
  rows: SeatRow[];
  /** `{ available, vip, sweetbox }` — the FE vocabulary (`available` = BE `standard`). */
  seatPrices: SeatPrice;
  maxSeats: number;
  holdTtlSeconds: number;
}

function toSeat(cell: SeatMapCell): Seat {
  return {
    col: cell.col,
    kind: cell.kind === "standard" ? "available" : cell.kind,
    status: cell.status,
    ...(cell.pairId ? { pairId: cell.pairId } : {}),
    seatIds: cell.seatIds,
    price: cell.price,
  };
}

/**
 * `SeatGrid` renders exactly two half-row segments (`segments[0]` / `segments[1]`).
 * The backend returns one segment per `room_seat_config` entry — 2 for every
 * room today (regular `1-5`/`6-10`, sweetbox `1-2`/`3-4`), but a room with
 * more sweetbox pairs would arrive as 4+ segments, so fold them into halves.
 */
function toHalfSegments(segments: SeatMapCell[][]): [Seat[], Seat[]] {
  if (segments.length <= 2) {
    return [(segments[0] ?? []).map(toSeat), (segments[1] ?? []).map(toSeat)];
  }

  const middle = Math.ceil(segments.length / 2);
  return [segments.slice(0, middle).flat().map(toSeat), segments.slice(middle).flat().map(toSeat)];
}

function toRow(row: SeatMapRow): SeatRow {
  const [left, right] = toHalfSegments(row.segments);
  return { label: row.label, segments: [left, right] };
}

/**
 * Adapt `GET /seats` (contract §4.1) to the FE grid types:
 * - `kind: "standard"` → `"available"` (`SeatKind` vocabulary)
 * - every row normalized to exactly two half-row segments for `SeatGrid`
 * - `seatPrices.standard` → `seatPrices.available`
 * - per-cell `seatIds` + `price` ride along for totals and `POST /bookings`
 */
export function adaptSeatMap(response: SeatMapResponse): AdaptedSeatMap {
  return {
    rows: response.rows.map(toRow),
    seatPrices: {
      available: response.seatPrices.standard,
      vip: response.seatPrices.vip,
      sweetbox: response.seatPrices.sweetbox,
    },
    maxSeats: response.maxSeatsPerBooking,
    holdTtlSeconds: response.holdTtlSeconds,
  };
}
