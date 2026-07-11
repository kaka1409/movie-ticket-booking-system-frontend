"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { ALL_MOVIES } from "@/features/movies/mock";
import { SEAT_ROWS, MAX_SEATS_PER_BOOKING } from "@/features/booking/mock";
import type { Seat } from "@/features/booking/types";

import StepBar from "./components/mobile/StepBar";
import CountdownBanner from "./components/mobile/CountdownBanner";
import SeatMap from "./components/mobile/SeatMap";
import Legend from "./components/mobile/Legend";
import BottomBar from "./components/mobile/BottomBar";

import DesktopSeatContent from "./components/desktop/SeatContent";

export default function SelectSeatPage() {
  const params = useParams();
  const slug = params.slug as string;
  const movie = ALL_MOVIES.find((m) => m.slug === slug);

  const [rows, setRows] = useState(SEAT_ROWS);

  const handleToggle = useCallback((rowLabel: string, clickedSeat: Seat) => {
    setRows((prev) => {
      const selectedCount = prev.flatMap((r) => r.segments.flat()).filter((s) => s.status === "selected").length;
      const isDeselecting = prev
        .find((r) => r.label === rowLabel)
        ?.segments.flat()
        .some((s) => s.kind === clickedSeat.kind && (clickedSeat.kind === "sweetbox" ? s.pairId === clickedSeat.pairId : s.col === clickedSeat.col) && s.status === "selected");

      if (!isDeselecting && selectedCount >= MAX_SEATS_PER_BOOKING) return prev;

      return prev.map((row) => {
        if (row.label !== rowLabel) return row;

        const toggleSeat = (seat: Seat): Seat => {
          const matches =
            clickedSeat.kind === "sweetbox"
              ? seat.pairId === clickedSeat.pairId
              : seat.col === clickedSeat.col && seat.kind === clickedSeat.kind;

          if (!matches) return seat;
          return { ...seat, status: seat.status === "selected" ? "idle" : "selected" };
        };

        return {
          ...row,
          segments: row.segments.map((seg) => seg.map(toggleSeat)),
        };
      });
    });
  }, []);

  if (!movie) {
    notFound();
  }

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <StepBar current={2} />

        <main className="space-y-5 pt-1 pb-10">
          <CountdownBanner />

          <SeatMap rows={rows} onToggle={handleToggle} />

          <Legend />
        </main>

        <BottomBar rows={rows} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopSeatContent />
      </div>
    </>
  );
}
