import type { SeatMapCell, SeatMapResponse, SeatMapRow, Seat, SeatRow, SeatPrice } from "../types";
import { getSeatMap } from "../api";
import { selectCellsByIds } from "./seat";

interface AdaptedSeatMap {
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

/**
 * `409 SEAT_TAKEN` recovery: another user holds/owns part of the wanted seats.
 * Refetch the map with the caller's Bearer token — the seats still held by the
 * caller come back `idle` (already held for them), the stolen cells
 * `occupied` — and re-mark the survivors `selected` so they re-hold on the
 * next attempt. Without identity the survivors could never be re-marked, so the
 * retry would always fail.
 */
export async function recoverSeatMap(
  showtimeId: string,
  wantedSeatIds: string[],
  setSeatGrid: (rows: SeatRow[], maxSeats: number) => void,
  token: string,
): Promise<void> {
  const result = await getSeatMap(showtimeId, { token });
  if ("error" in result) return;

  const adapted = adaptSeatMap(result.data);
  setSeatGrid(selectCellsByIds(adapted.rows, new Set(wantedSeatIds)), adapted.maxSeats);
}
