"use client";

import { useEffect, useRef } from "react";
import { useModification } from "../contexts/ModificationContext";
import { useTicketDetail } from "../contexts/TicketDetailContext";
import { resolveModifyShowtimeId } from "../utils";
import { getSeatMap } from "@/features/booking/api";
import { adaptSeatMap } from "@/features/booking/utils/seatMap";

/**
 * Effect-only mount helper for the modify seats step (renders nothing): adopts
 * the seat map of the flow's target showtime into the draft. Mounted at PAGE
 * level — both device trees render, so a per-branch mount would adopt twice.
 *
 * The target comes from `resolveModifyShowtimeId`, so a seats-only change always
 * reopens the ticket's own showtime map.
 */
export default function ModifySeatMapAdopter() {
  const {
    modificationType,
    selectedShowtime,
    setSeatRows,
    setSeatPrices,
    setSelectedSeats,
    setSeatMapStatus,
    setPaintedShowtimeId,
    seatMapRetryToken,
  } = useModification();
  const { ticket } = useTicketDetail();

  const showtimeId = resolveModifyShowtimeId(
    modificationType,
    selectedShowtime?.showtimeId,
    ticket.showtimeId,
  );

  // Which showtime the painted grid belongs to, resolved only when a load
  // succeeds: a key written up front made React's dev double-effect skip the
  // second run while the first was already cancelled, leaving the skeleton up.
  const paintedShowtimeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!showtimeId) return;

    let cancelled = false;
    setSeatMapStatus("loading");

    getSeatMap(showtimeId)
      .then((result) => {
        if (cancelled) return;
        if ("error" in result) {
          setSeatMapStatus("error");
          return;
        }
        // Seat ids belong to a room, so a different map invalidates every pick.
        if (paintedShowtimeRef.current !== null && paintedShowtimeRef.current !== showtimeId) {
          setSelectedSeats([]);
        }
        paintedShowtimeRef.current = showtimeId;
        const adapted = adaptSeatMap(result.data);
        setSeatRows(adapted.rows);
        setSeatPrices(adapted.seatPrices);
        setPaintedShowtimeId(showtimeId);
        setSeatMapStatus("ready");
      })
      .catch((error: unknown) => {
        // A rejected promise would otherwise leave "Loading seat map..." forever.
        console.warn("Loading seat map failed:", error);
        if (!cancelled) setSeatMapStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [
    showtimeId,
    seatMapRetryToken,
    setSeatRows,
    setSeatPrices,
    setSelectedSeats,
    setPaintedShowtimeId,
    setSeatMapStatus,
  ]);

  return null;
}
