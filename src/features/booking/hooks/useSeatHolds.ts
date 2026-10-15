"use client";

import { useEffect, useRef } from "react";
import type { SeatRow } from "../types";
import { getSeatHolds, releaseSeatHolds } from "../api";

function collectSelectedSeatIds(rows: SeatRow[]): string[] {
  return rows.flatMap((row) =>
    row.segments.flatMap((segment) =>
      segment.filter((cell) => cell.status === "selected").flatMap((cell) => cell.seatIds),
    ),
  );
}

interface SeatHoldOptions {
  /** Current grid (may be the pre-adoption fallback) — drives the release check. */
  rows: SeatRow[];
  selectHoldCells: (seatIds: string[]) => void;
  clearSeatSelection: () => void;
  showtimeId: string;
  token: string | null;
  holdExpiresAt: number | null;
  setHoldExpiresAt: (deadline: number | null) => void;
}

/**
 * The client-side seat-hold lifecycle (Bearer token from RAM, see API Layer).
 * A hold is only ever **created** at the seats-step CTA (`PUT /seat-holds` in
 * `BottomBar`), so while the user is still picking seats nothing is written to
 * the server. This hook covers the surrounding lifecycle instead:
 * `GET /seat-holds` restore on mount, a release when the selection empties,
 * and a 1 s interval that clears the phantom selection if the backend drops
 * the hold early. The 10-minute session deadline itself is enforced by
 * `SessionExpiryWatcher` (layout-level, so it fires on every step) — the
 * banner counts from the first CTA and re-presses never extend it.
 */
export function useSeatHolds({
  rows,
  selectHoldCells,
  clearSeatSelection,
  showtimeId,
  token,
  holdExpiresAt,
  setHoldExpiresAt,
}: SeatHoldOptions): void {
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
      if (seatIds.length === 0 || deadline === null || deadline <= Date.now()) return;

      setHoldExpiresAt(deadline);
      // The reducer applies the ids to the grid it holds when the dispatch
      // lands, so a toggle made while the GET was in flight is not lost.
      selectHoldCells(seatIds);
    })();
  }, [token, showtimeId, setHoldExpiresAt, selectHoldCells]);

  // Releasing: emptying the selection drops a live hold (`holdExpiresAt` is
  // the draft's "we hold seats" flag). Guarded so idle seats never send DELETE.
  useEffect(() => {
    if (!token || !showtimeId || holdExpiresAt === null) return;
    if (collectSelectedSeatIds(rows).length > 0) return;

    setHoldExpiresAt(null);
    void releaseSeatHolds(showtimeId, token);
  }, [rows, token, showtimeId, holdExpiresAt, setHoldExpiresAt]);

  // Hold expiry: the backend dropped our hold early (the normal session end
  // is handled by SessionExpiryWatcher) — drop the phantom selection so the
  // grid reflects reality, then re-picking + CTA re-holds.
  useEffect(() => {
    if (holdExpiresAt === null) return;

    const check = () => {
      if (Date.now() < holdExpiresAt) return;
      setHoldExpiresAt(null);
      clearSeatSelection();
    };

    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [holdExpiresAt, setHoldExpiresAt, clearSeatSelection]);
}
