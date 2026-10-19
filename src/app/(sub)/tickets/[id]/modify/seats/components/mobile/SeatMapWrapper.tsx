"use client";

import { useEffect, useCallback } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { getSeatMap } from "@/features/booking/api";
import { adaptSeatMap } from "@/features/booking/utils/seatMap";
import type { Seat } from "@/features/booking/types";
import { getSeatLabel } from "@/features/booking/utils/seat";
import SeatGrid from "@/components/ui/SeatGrid";

export default function SeatMapWrapper() {
  const { translate } = useLocale();
  const {
    toggleSeat,
    selectedSeats,
    seatRows,
    setSeatRows,
    seatPrices,
    setSeatPrices,
    selectedShowtime,
  } = useModification();
  const { ticket } = useTicketDetail();

  // "Both"/"showtime" picked a target showtime; a seats-only change reopens the
  // ticket's current showtime map.
  const showtimeId = selectedShowtime?.showtimeId ?? ticket.showtimeId ?? "";

  useEffect(() => {
    if (seatRows.length > 0 && seatPrices) return;
    if (!showtimeId) return;

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
  }, [showtimeId, seatRows.length, seatPrices, setSeatRows, setSeatPrices]);

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

  const selectedLabels = selectedSeats.map((s) => s.label);
  const originalLabels = ticket.seatItems.map((s) => s.label);

  return (
    <SeatGrid
      rows={seatRows}
      onToggle={handleToggle}
      selectedLabels={selectedLabels}
      originalLabels={originalLabels}
    />
  );
}
