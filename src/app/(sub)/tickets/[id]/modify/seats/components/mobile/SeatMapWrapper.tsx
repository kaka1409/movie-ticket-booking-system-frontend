"use client";

import { useEffect, useCallback, useRef } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { getSeatMap } from "@/features/booking/api";
import { adaptSeatMap } from "@/features/booking/utils/seatMap";
import type { Seat } from "@/features/booking/types";
import { getSeatLabel } from "@/features/booking/utils/seat";
import SeatGrid from "@/features/booking/components/seats/SeatGrid";

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

  const loadedShowtimeId = useRef<string | null>(null);

  useEffect(() => {
    if (!showtimeId || loadedShowtimeId.current === showtimeId) return;

    // Seat ids belong to a room, so a different map invalidates every pick.
    if (loadedShowtimeId.current !== null) setSelectedSeats([]);
    loadedShowtimeId.current = showtimeId;
    setSeatRows([]);

    let cancelled = false;
    getSeatMap(showtimeId).then((result) => {
      if (cancelled || "error" in result) return;
      const adapted = adaptSeatMap(result.data);
      setSeatRows(adapted.rows);
      setSeatPrices(adapted.seatPrices);
    });

    return () => {
      cancelled = true;
    };
  }, [showtimeId, setSeatRows, setSeatPrices, setSelectedSeats]);

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

  if (!seatPrices || seatRows.length === 0) {
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
