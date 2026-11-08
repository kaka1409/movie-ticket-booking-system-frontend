import type {
  AdminSeatLayoutInput,
  AdminSeatLayoutRowInput,
  AdminSeatType,
} from "../types";
import { seatKindOfTypeName, type AdminSeatKind } from "./seat-kind";

/** One physical seat inside a packed editor row. */
export interface EditorSeat {
  id: string;
  typeId: string;
}

/** A packed row: `seats[i]` is seat number `i + 1` once saved. */
export interface EditorRow {
  id: string;
  label: string;
  seats: EditorSeat[];
}

export interface SeatEditorMaps {
  kindById: Map<string, AdminSeatKind>;
  typeById: Map<string, AdminSeatType>;
}

export type SeatLayoutPayloadResult =
  | { ok: true; payload: AdminSeatLayoutInput }
  | { ok: false; error: SeatLayoutError };

export type SeatLayoutError =
  | "no_seats"
  | "row_label_required"
  | "row_label_too_long"
  | "row_label_duplicate"
  | "sweetbox_pair"
  | "too_many_segments"
  | "too_many_rows";

const MAX_PAYLOAD_ROWS = 30;
const MAX_SEGMENTS_PER_ROW = 20;
const MAX_ROW_LABEL_LENGTH = 4;

export function createEditorId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `seat-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createEditorSeat(typeId: string): EditorSeat {
  return { id: createEditorId(), typeId };
}

export function createEditorRow(label: string, seats: EditorSeat[] = []): EditorRow {
  return { id: createEditorId(), label, seats };
}

export function seatKindOfTypeId(typeId: string, maps: SeatEditorMaps): AdminSeatKind {
  return maps.kindById.get(typeId) ?? "available";
}

function isSweetBoxSeat(seat: EditorSeat, maps: SeatEditorMaps): boolean {
  return seatKindOfTypeId(seat.typeId, maps) === "sweetbox";
}

/** Contiguous SweetBox run containing `index`, or null when the seat is not SweetBox. */
function sweetBoxRunBounds(
  seats: EditorSeat[],
  index: number,
  maps: SeatEditorMaps,
): { start: number; end: number } | null {
  if (index < 0 || index >= seats.length || !isSweetBoxSeat(seats[index], maps)) {
    return null;
  }

  let start = index;
  while (start > 0 && isSweetBoxSeat(seats[start - 1], maps)) start -= 1;

  let end = index;
  while (end + 1 < seats.length && isSweetBoxSeat(seats[end + 1], maps)) end += 1;

  return { start, end };
}

/**
 * Pair membership inside a SweetBox run: pairs chunk sequentially from the run
 * start, matching how `buildSeatLayoutPayload` emits segments. Returns null for
 * a lone trailing seat so callers can repair it as a single seat.
 */
function sweetBoxPairIndices(
  seats: EditorSeat[],
  index: number,
  maps: SeatEditorMaps,
): [number, number] | null {
  const run = sweetBoxRunBounds(seats, index, maps);
  if (!run) return null;

  const runLength = run.end - run.start + 1;
  const offset = index - run.start;
  const pairOffset = offset - (offset % 2);

  if (pairOffset + 1 >= runLength) return null;
  return [run.start + pairOffset, run.start + pairOffset + 1];
}

/** Change one seat's type, keeping SweetBox pairs atomic. */
export function applySeatType(
  seats: EditorSeat[],
  index: number,
  typeId: string,
  maps: SeatEditorMaps,
): EditorSeat[] {
  if (index < 0 || index >= seats.length) return seats;

  const next = [...seats];
  const targetKind = seatKindOfTypeId(typeId, maps);
  const currentKind = seatKindOfTypeId(seats[index].typeId, maps);

  if (targetKind === "sweetbox") {
    if (currentKind === "sweetbox") {
      const pair = sweetBoxPairIndices(seats, index, maps);
      if (pair) {
        next[pair[0]] = { ...next[pair[0]], typeId };
        next[pair[1]] = { ...next[pair[1]], typeId };
      } else {
        next[index] = { ...next[index], typeId };
      }
      return next;
    }

    const partner = index + 1 < seats.length ? index + 1 : index - 1;
    next[index] = { ...next[index], typeId };
    if (partner >= 0) next[partner] = { ...next[partner], typeId };
    return next;
  }

  if (currentKind === "sweetbox") {
    const pair = sweetBoxPairIndices(seats, index, maps);
    if (pair) {
      next[pair[0]] = { ...next[pair[0]], typeId };
      next[pair[1]] = { ...next[pair[1]], typeId };
      return next;
    }
  }

  next[index] = { ...next[index], typeId };
  return next;
}

/** Remove one seat; SweetBox removes its whole pair so no lone seat remains. */
export function eraseSeat(
  seats: EditorSeat[],
  index: number,
  maps: SeatEditorMaps,
): EditorSeat[] {
  if (index < 0 || index >= seats.length) return seats;

  if (seatKindOfTypeId(seats[index].typeId, maps) === "sweetbox") {
    const pair = sweetBoxPairIndices(seats, index, maps);
    if (pair) {
      return seats.filter((_, seatIndex) => seatIndex !== pair[0] && seatIndex !== pair[1]);
    }
  }

  return seats.filter((_, seatIndex) => seatIndex !== index);
}

/**
 * Paint into empty slots: seats are packed, so filling slot `targetLength - 1`
 * appends every missing seat up to that column. SweetBox tails are balanced by
 * one extra seat when capacity allows, keeping pairs even.
 */
export function fillSeatsToLength(
  seats: EditorSeat[],
  targetLength: number,
  typeId: string,
  maps: SeatEditorMaps,
  maxLength: number,
): EditorSeat[] {
  const next = [...seats];
  const wanted = Math.min(Math.max(targetLength, next.length), maxLength);

  while (next.length < wanted) {
    next.push(createEditorSeat(typeId));
  }

  if (seatKindOfTypeId(typeId, maps) === "sweetbox") {
    for (let guard = 0; guard < 2; guard += 1) {
      const run = sweetBoxRunBounds(next, next.length - 1, maps);
      if (!run) break;
      const runLength = run.end - run.start + 1;
      if (runLength % 2 === 0 || next.length >= maxLength) break;
      next.push(createEditorSeat(typeId));
    }
  }

  return next;
}

/** Append seats at the end of a packed row (used by the row-level add button). */
export function appendSeats(
  seats: EditorSeat[],
  typeId: string,
  maps: SeatEditorMaps,
  count: number,
  maxLength: number,
): EditorSeat[] {
  const room = Math.max(maxLength - seats.length, 0);
  const additions = Math.min(count, room);
  if (additions <= 0) return seats;

  const next = [...seats];
  for (let index = 0; index < additions; index += 1) {
    next.push(createEditorSeat(typeId));
  }
  return next;
}

/** Packed rows → backend segment payload, with client-side rule checks. */
export function buildSeatLayoutPayload(
  rows: EditorRow[],
  maps: SeatEditorMaps,
): SeatLayoutPayloadResult {
  const payloadRows: AdminSeatLayoutRowInput[] = [];
  const seenLabels = new Set<string>();

  for (const row of rows) {
    const label = row.label.trim();
    const hasSeats = row.seats.length > 0;

    if (!label) {
      if (hasSeats) return { ok: false, error: "row_label_required" };
      continue;
    }
    if (label.length > MAX_ROW_LABEL_LENGTH) {
      if (hasSeats) return { ok: false, error: "row_label_too_long" };
      continue;
    }

    const labelKey = label.toUpperCase();
    if (seenLabels.has(labelKey)) {
      if (hasSeats) return { ok: false, error: "row_label_duplicate" };
      continue;
    }
    seenLabels.add(labelKey);

    if (!hasSeats) continue;

    const segments: NonNullable<AdminSeatLayoutRowInput["segments"]> = [];
    let seatIndex = 0;

    while (seatIndex < row.seats.length) {
      const typeId = row.seats[seatIndex].typeId;
      let runEnd = seatIndex + 1;
      while (runEnd < row.seats.length && row.seats[runEnd].typeId === typeId) {
        runEnd += 1;
      }

      const runLength = runEnd - seatIndex;
      const kind = seatKindOfTypeId(typeId, maps);

      if (kind === "sweetbox") {
        if (runLength % 2 !== 0) {
          return { ok: false, error: "sweetbox_pair" };
        }
        for (let pairStart = seatIndex; pairStart < runEnd; pairStart += 2) {
          segments.push({
            start: pairStart + 1,
            end: pairStart + 2,
            seatTypeId: typeId,
          });
        }
      } else {
        segments.push({
          start: seatIndex + 1,
          end: runEnd,
          seatTypeId: typeId,
        });
      }

      seatIndex = runEnd;
    }

    if (segments.length > MAX_SEGMENTS_PER_ROW) {
      return { ok: false, error: "too_many_segments" };
    }

    payloadRows.push({ rowLabel: label, segments });
  }

  if (payloadRows.length === 0) return { ok: false, error: "no_seats" };
  if (payloadRows.length > MAX_PAYLOAD_ROWS) {
    return { ok: false, error: "too_many_rows" };
  }

  return { ok: true, payload: { rows: payloadRows } };
}

/** Seat-type name for titles/tooltips; falls back to the raw id. */
export function seatTypeNameById(
  typeId: string,
  maps: SeatEditorMaps,
): string {
  return maps.typeById.get(typeId)?.name ?? typeId;
}

export function mapsFromSeatTypes(seatTypes: AdminSeatType[]): SeatEditorMaps {
  return {
    kindById: new Map(
      seatTypes.map((type) => [type.id, seatKindOfTypeName(type.name)]),
    ),
    typeById: new Map(seatTypes.map((type) => [type.id, type])),
  };
}

/* ── Grid painter adapter ──────────────────────────────────────────────
 * The editor paints a fixed rows×cols grid; on save the painted cells are
 * compacted into packed `EditorRow`s so seat numbers stay contiguous.
 */

export type EditorGrid = Map<string, string>;

export function gridKey(row: number, col: number): string {
  return `${row}:${col}`;
}

/** Column pair a SweetBox seat occupies: even cols pair right, odd pair left. */
export function sweetBoxPairColumns(col: number, colCount: number): number[] {
  const partner = col % 2 === 0 ? col + 1 : col - 1;
  return partner >= 0 && partner < colCount ? [col, partner] : [col];
}

function gridCellKind(typeId: string | undefined, maps: SeatEditorMaps) {
  return typeId ? seatKindOfTypeId(typeId, maps) : null;
}

/**
 * Apply the brush to one grid cell. SweetBox always paints/erases/converts its
 * aligned column pair so a lone SweetBox seat cannot be produced.
 */
export function applyBrushToGrid(
  cells: EditorGrid,
  row: number,
  col: number,
  brushId: string | null,
  maps: SeatEditorMaps,
  colCount: number,
): EditorGrid {
  const key = gridKey(row, col);
  const next = new Map(cells);
  const existing = next.get(key);

  if (brushId === null) {
    next.delete(key);
    if (gridCellKind(existing, maps) === "sweetbox") {
      for (const partner of sweetBoxPairColumns(col, colCount)) {
        if (partner === col) continue;
        const partnerKey = gridKey(row, partner);
        if (gridCellKind(next.get(partnerKey), maps) === "sweetbox") {
          next.delete(partnerKey);
        }
      }
    }
    return next;
  }

  const targetKind = seatKindOfTypeId(brushId, maps);

  if (targetKind === "sweetbox") {
    for (const partner of sweetBoxPairColumns(col, colCount)) {
      next.set(gridKey(row, partner), brushId);
    }
    return next;
  }

  const wasSweetBox = gridCellKind(existing, maps) === "sweetbox";
  next.set(key, brushId);
  if (wasSweetBox) {
    for (const partner of sweetBoxPairColumns(col, colCount)) {
      if (partner === col) continue;
      const partnerKey = gridKey(row, partner);
      if (gridCellKind(next.get(partnerKey), maps) === "sweetbox") {
        next.set(partnerKey, brushId);
      }
    }
  }
  return next;
}

/** Painted grid → packed editor rows (painted columns become seats 1..n). */
export function gridToEditorRows(
  cells: EditorGrid,
  rowCount: number,
  colCount: number,
  rowLabels: string[],
): EditorRow[] {
  const rows: EditorRow[] = [];

  for (let row = 0; row < rowCount; row += 1) {
    const seats: EditorSeat[] = [];
    for (let col = 0; col < colCount; col += 1) {
      const typeId = cells.get(gridKey(row, col));
      if (typeId) seats.push(createEditorSeat(typeId));
    }
    rows.push(createEditorRow(rowLabels[row] ?? "", seats));
  }

  return rows;
}
