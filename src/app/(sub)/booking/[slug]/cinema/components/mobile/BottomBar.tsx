"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useCinemaSelection } from "@/features/booking/contexts/CinemaSelectionContext";
import { useLocale } from "@/contexts/LocaleContext";

export default function BottomBar({ movieSlug }: { movieSlug: string }) {
  const { selectedCinema, selectedTime, selectedDate, hasSelection, clearSelection } =
    useCinemaSelection();
  const { translate } = useLocale();

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
                  {translate("booking.cinema.showtime")}
                </p>
                <p className="font-extrabold text-base text-(--color-gold)">
                  {selectedTime}
                </p>
              </div>
              <button
                onClick={clearSelection}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-(--color-surface-2) text-(--color-text-muted)"
                aria-label={translate("booking.cinema.clear_selection")}
              >
                <X size={13} />
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-(--color-text-muted)">
            {translate("booking.cinema.select_prompt")}
          </p>
        )}
      </div>

      {hasSelection ? (
        <Link
          href={`/booking/${movieSlug}/seats`}
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] bg-(--color-gold) text-[#0F0F0F] shadow-(--shadow-glow)"
        >
          {translate("booking.cinema.select_seats")}
          <ArrowRight size={17} />
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase bg-(--color-border) text-(--color-text-muted) cursor-not-allowed"
        >
          {translate("booking.cinema.select_seats")}
          <ArrowRight size={17} />
        </button>
      )}
    </div>
  );
}
