"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { useCinemaSelection } from "./CinemaSelectionContext";

export default function BottomBar({ movieSlug }: { movieSlug: string }) {
  const { setCinema } = useBooking();
  const { selectedCinema, selectedTime, selectedDate, hasSelection, clearSelection } =
    useCinemaSelection();

  const handleSaveAndNavigate = () => {
    if (selectedCinema && hasSelection) {
      setCinema(selectedCinema.id, selectedCinema.name, selectedTime, selectedDate, selectedCinema.badge);
    }
  };

  return (
    <div className="sticky bottom-0 z-50 px-4 pb-6 pt-3 bg-(--color-bg) border-t border-(--color-border)">
      <div className="flex items-center justify-between mb-3 px-1">
        {hasSelection && selectedCinema ? (
          <>
            <div>
              <p className="font-bold text-sm text-(--color-text-primary)">
                {selectedCinema.name}
              </p>
              <p className="text-xs text-(--color-text-muted)">
                {selectedCinema.address}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[9px] font-bold tracking-widest uppercase text-(--color-text-muted)">
                  SHOWTIME
                </p>
                <p className="font-extrabold text-base text-(--color-gold)">
                  {selectedTime}
                </p>
              </div>
              <button
                onClick={clearSelection}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-(--color-surface-2) text-(--color-text-muted)"
                aria-label="Clear selection"
              >
                <X size={13} />
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-(--color-text-muted)">
            Select a cinema &amp; showtime
          </p>
        )}
      </div>

      {hasSelection ? (
        <Link
          href={`/booking/${movieSlug}/seats`}
          onClick={handleSaveAndNavigate}
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] bg-(--color-gold) text-[#0F0F0F] shadow-(--shadow-glow)"
        >
          SELECT SEATS
          <ArrowRight size={17} />
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase bg-(--color-border) text-(--color-text-muted) cursor-not-allowed"
        >
          SELECT SEATS
          <ArrowRight size={17} />
        </button>
      )}
    </div>
  );
}
