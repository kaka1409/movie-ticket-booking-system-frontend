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
  /** Showtime the live hold belongs to — may differ from `showtimeId` after a slot change. */
  holdShowtimeId: string | null;
  setSeatHold: (deadline: number | null, showtimeId: string | null) => void;
}

/**
 * The client-side seat-hold lifecycle (Bearer token from RAM, see API Layer).
 * A hold is only ever **created** at the seats-step CTA (`PUT /seat-holds` in
 * `BottomBar`), so while the user is still picking seats nothing is written to
 * the server. This hook covers the surrounding lifecycle instead:
 * `GET /seat-holds` restore on mount, a release when the selection empties or
 * when the slot changes, and a 1 s interval that clears the phantom selection
 * if the backend drops the hold early. The 10-minute session deadline itself is
 * enforced by `SessionExpiryWatcher` (layout-level, so it fires on every
 * step) — the banner counts from the first CTA and re-presses never extend it.
 */
export function useSeatHolds({
  rows,
  selectHoldCells,
  clearSeatSelection,
  showtimeId,
  token,
  holdExpiresAt,
  holdShowtimeId,
  setSeatHold,
}: SeatHoldOptions): void {
  // Keyed by showtime: a failed restore must not latch `restored`, and a slot
  // change inside the same mount still gets its own restore attempt.
  const restoredForRef = useRef<string | null>(null);
  const latestShowtimeRef = useRef(showtimeId);

  // Tracks the slot across renders so an in-flight restore GET can tell its
  // seats belong to a showtime the user already navigated away from.
  useEffect(() => {
    latestShowtimeRef.current = showtimeId;
  }, [showtimeId]);

  // Hard-refresh restore: re-select the caller's live hold and adopt its deadline.
  useEffect(() => {
    if (!token || !showtimeId || restoredForRef.current === showtimeId) return;

    void (async () => {
      const result = await getSeatHolds(showtimeId, token);
      // The slot moved while the GET was in flight — its seats belong to the
      // old showtime and must not be applied to the new grid.
      if (latestShowtimeRef.current !== showtimeId) return;
      if ("error" in result) return;

      const { seatIds, expiresAt } = result.data;
      const deadline = expiresAt ? Date.parse(expiresAt) : null;
      if (seatIds.length === 0 || deadline === null || deadline <= Date.now()) return;

      restoredForRef.current = showtimeId;
      setSeatHold(deadline, showtimeId);
      // The reducer applies the ids to the grid it holds when the dispatch
      // lands, so a toggle made while the GET was in flight is not lost.
      selectHoldCells(seatIds);
    })();
  }, [token, showtimeId, setSeatHold, selectHoldCells]);

  // The slot changed: the live hold still pins those seats on the OLD showtime.
  // `DELETE /seat-holds` releases per showtime, so it must name `holdShowtimeId`
  // — releasing against the new `showtimeId` would free nothing and leave the
  // old seats blocked until their TTL.
  useEffect(() => {
    if (!token || holdExpiresAt === null || holdShowtimeId === null) return;
    if (holdShowtimeId === showtimeId) return;

    setSeatHold(null, null);
    void releaseSeatHolds(holdShowtimeId, token);
  }, [token, showtimeId, holdExpiresAt, holdShowtimeId, setSeatHold]);

  // Releasing: emptying the selection drops a live hold (`holdExpiresAt` is
  // the draft's "we hold seats" flag). Guarded so idle seats never send DELETE,
  // and scoped to the hold's own showtime (the orphan effect owns the rest).
  useEffect(() => {
    if (!token || !showtimeId || holdExpiresAt === null) return;
    if (holdShowtimeId !== showtimeId) return;
    if (collectSelectedSeatIds(rows).length > 0) return;

    setSeatHold(null, null);
    void releaseSeatHolds(showtimeId, token);
  }, [rows, token, showtimeId, holdExpiresAt, holdShowtimeId, setSeatHold]);

  // Hold expiry: the backend dropped our hold early (the normal session end
  // is handled by SessionExpiryWatcher) — drop the phantom selection so the
  // grid reflects reality, then re-picking + CTA re-holds.
  useEffect(() => {
    if (holdExpiresAt === null) return;

    const check = () => {
      if (Date.now() < holdExpiresAt) return;
      setSeatHold(null, null);
      clearSeatSelection();
    };

    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [holdExpiresAt, setSeatHold, clearSeatSelection]);
}
