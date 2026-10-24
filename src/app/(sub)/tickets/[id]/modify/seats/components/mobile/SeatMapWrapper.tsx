"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { getSeatMap } from "@/features/booking/api";
import { adaptSeatMap } from "@/features/booking/utils/seatMap";
import type { Seat } from "@/features/booking/types";
import { getSeatLabel } from "@/features/booking/utils/seat";
import SeatGrid from "@/features/booking/components/seats/SeatGrid";
import Button from "@/components/ui/Button";

export default function SeatMapWrapper() {
  const { translate } = useLocale();
  const {
    modificationType,
    toggleSeat,
    selectedSeats,
    setSelectedSeats,
    seatRows,
    setSeatRows,
    seatPrices,
    setSeatPrices,
    selectedShowtime,
  } = useModification();
  const { ticket } = useTicketDetail();

  // A seats-only change always reopens the ticket's current showtime map; a
  // stale target showtime from an earlier "both" attempt must not leak in.
  const isSeatsOnly = modificationType === "seats";
  const showtimeId = (!isSeatsOnly && selectedShowtime?.showtimeId) || ticket.showtimeId || "";

  // Which showtime the painted grid belongs to. Resolved only when a load
  // succeeds — a key written up front made React's dev double-effect skip the
  // second run while the first one was already cancelled, leaving the skeleton
  // up forever.
  const [paintedShowtimeId, setPaintedShowtimeId] = useState<string | null>(null);
  const paintedShowtimeRef = useRef<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    if (!showtimeId) return;

    let cancelled = false;
    getSeatMap(showtimeId)
      .then((result) => {
        if (cancelled) return;
        if ("error" in result) {
          setLoadError(true);
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
      })
      .catch((error: unknown) => {
        // A rejected promise would otherwise leave "Loading seat map..." forever.
        console.warn("Loading seat map failed:", error);
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [showtimeId, retryNonce, setSeatRows, setSeatPrices, setSelectedSeats]);

  const handleRetry = () => {
    setLoadError(false);
    setRetryNonce((nonce) => nonce + 1);
  };

  const handleToggle = useCallback(
    (rowLabel: string, seat: Seat) => {
      if (seat.status === "occupied") return;

      const label = getSeatLabel(rowLabel, seat);
      const type =
        seat.kind === "available"
          ? translate("booking.seats.standard")
          : seat.kind === "vip"
            ? "VIP"
            : "SweetBox";

      toggleSeat({ seatIds: seat.seatIds, label, type, price: seat.price });
    },
    [toggleSeat, translate],
  );

  if (loadError) {
    return (
      <div className="px-4 py-8 text-center text-(--color-text-muted)">
        <p className="text-sm text-red-400 mb-3">{translate("error.title")}</p>
        <Button variant="outline" onClick={handleRetry}>
          {translate("error.try_again")}
        </Button>
      </div>
    );
  }

  if (!seatPrices || seatRows.length === 0 || paintedShowtimeId !== showtimeId) {
    return (
      <div className="px-4 py-8 text-center text-(--color-text-muted)">
        {translate("tickets.modify.loading_seat_map")}
      </div>
    );
  }

  const selectedLabels = selectedSeats.map((selectedSeat) => selectedSeat.label);
  const originalLabels = ticket.seatItems.map((seatItem) => seatItem.label);

  return (
    <SeatGrid
      rows={seatRows}
      onToggle={handleToggle}
      selectedLabels={selectedLabels}
      originalLabels={originalLabels}
    />
  );
}
