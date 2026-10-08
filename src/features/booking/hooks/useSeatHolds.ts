"use client";

import { useCallback, useEffect, useRef } from "react";
import type { SeatRow } from "../types";
import { getSeatMap, getSeatHolds, putSeatHolds, releaseSeatHolds } from "../api";
import { adaptSeatMap } from "../utils/seatMap";
import { selectCellsByIds } from "../utils/seat";

/** Server hold writes are debounced so rapid toggling coalesces into one PUT. */
const HOLD_DEBOUNCE_MS = 300;

function collectSelectedSeatIds(rows: SeatRow[]): string[] {
  return rows.flatMap((row) =>
    row.segments.flatMap((segment) =>
      segment.filter((cell) => cell.status === "selected").flatMap((cell) => cell.seatIds),
    ),
  );
}

function seatsSignature(seatIds: string[]): string {
  return [...seatIds].sort().join(",");
}

interface SeatHoldOptions {
  /** Current grid (may be the pre-adoption fallback) — drives the PUT signature. */
  rows: SeatRow[];
  setSeatGrid: (rows: SeatRow[], maxSeats: number) => void;
  selectHoldCells: (seatIds: string[]) => void;
  clearSeatSelection: () => void;
  showtimeId: string;
  token: string | null;
  holdExpiresAt: number | null;
  setHoldExpiresAt: (deadline: number | null) => void;
}

/**
 * The client-side seat-hold lifecycle (Bearer token from RAM, see API Layer):
 * `GET /seat-holds` restore on mount, debounced 300 ms `PUT /seat-holds`
 * (empty selection → `DELETE`), `409 SEAT_TAKEN` → map refetch + survivor
 * re-hold, and a 1 s expiry interval that clears the phantom selection when
 * the backend releases the hold. A signature guard prevents redundant PUTs.
 * All grid writes go through the booking reducer.
 */
export function useSeatHolds({
  rows,
  setSeatGrid,
  selectHoldCells,
  clearSeatSelection,
  showtimeId,
  token,
  holdExpiresAt,
  setHoldExpiresAt,
}: SeatHoldOptions): void {
  // null = not yet known, "" = no live hold, otherwise the held seatIds signature.
  const holdSignatureRef = useRef<string | null>(null);
  const restoredRef = useRef(false);

  // Hard-refresh restore: re-select the caller's live hold and adopt its deadline.
  useEffect(() => {
    if (!token || !showtimeId || restoredRef.current) return;
    restoredRef.current = true;

    void (async () => {
      const result = await getSeatHolds(showtimeId, token);
      if ("error" in result) return;

      const { seatIds, expiresAt } = result.data;
      const deadline = expiresAt ? Date.parse(expiresAt) : null;
      if (seatIds.length === 0 || deadline === null || deadline <= Date.now()) {
        holdSignatureRef.current = "";
        return;
      }

      holdSignatureRef.current = seatsSignature(seatIds);
      setHoldExpiresAt(deadline);
      // The reducer applies the ids to the grid it holds when the dispatch
      // lands, so a toggle made while the GET was in flight is not lost.
      selectHoldCells(seatIds);
    })();
  }, [token, showtimeId, setHoldExpiresAt, selectHoldCells]);

  /**
   * A 409 `SEAT_TAKEN` means another user holds/owns part of the selection.
   * Re-fetch the map and keep only the cells that are still idle — the taken
   * ones come back `occupied`, the survivors stay selected and re-hold below.
   */
  const recoverFromConflict = useCallback(
    (wantedSeatIds: string[]) => {
      void (async () => {
        const result = await getSeatMap(showtimeId);
        if ("error" in result) return;

        const adapted = adaptSeatMap(result.data);
        setSeatGrid(selectCellsByIds(adapted.rows, new Set(wantedSeatIds)), adapted.maxSeats);
      })();
    },
    [showtimeId, setSeatGrid],
  );

  // Debounced set-replacement: PUT the current selection, DELETE when it
  // empties (PUT rejects an empty array), 409 → map refetch + survivor re-hold.
  useEffect(() => {
    if (!token || !showtimeId) return;

    const selectedSeatIds = collectSelectedSeatIds(rows);
    const signature = seatsSignature(selectedSeatIds);
    if (signature === holdSignatureRef.current) return;

    const timer = setTimeout(() => {
      if (selectedSeatIds.length === 0) {
        if (holdSignatureRef.current === null || holdSignatureRef.current === "") return;
        holdSignatureRef.current = "";
        setHoldExpiresAt(null);
        void releaseSeatHolds(showtimeId, token);
        return;
      }

      holdSignatureRef.current = signature;
      void putSeatHolds(showtimeId, selectedSeatIds, token).then((result) => {
        if ("error" in result) {
          if (result.error.status === 409 || result.error.code === "SEAT_TAKEN") {
            recoverFromConflict(selectedSeatIds);
          }
          return;
        }
        setHoldExpiresAt(Date.parse(result.data.expiresAt));
      });
    }, HOLD_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [rows, token, showtimeId, setHoldExpiresAt, recoverFromConflict]);

  // Hold expiry: the backend releases our seats — drop the phantom selection
  // so the grid reflects reality (re-selecting re-holds with a fresh TTL).
  useEffect(() => {
    if (holdExpiresAt === null) return;

    const check = () => {
      if (Date.now() < holdExpiresAt) return;
      holdSignatureRef.current = "";
      setHoldExpiresAt(null);
      clearSeatSelection();
    };

    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [holdExpiresAt, setHoldExpiresAt, clearSeatSelection]);
}
