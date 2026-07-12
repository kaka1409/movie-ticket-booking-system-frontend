"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SeatRow, Seat } from "@/features/booking/types";
import { SEAT_PRICES } from "@/features/booking/mock";

interface Selection {
  label: string;
  price: number;
}

function collectSelections(rows: SeatRow[]): Selection[] {
  return rows.flatMap((row) =>
    row.segments.flatMap((seg) =>
      seg
        .filter((s) => s.status === "selected")
        .map((s) => ({
          label:
            s.kind === "sweetbox"
              ? `${row.label}(${s.pairId?.split("-").slice(1).join("-")})`
              : `${row.label}${s.col}`,
          price: SEAT_PRICES[s.kind],
        }))
    )
  );
}

export default function BottomBar({ rows }: { rows: SeatRow[] }) {
  const params = useParams();
  const slug = params.slug as string;
  const items = collectSelections(rows);
  const total = items.reduce((sum, s) => sum + s.price, 0);
  const labels = items.map((s) => s.label).join(", ");
  const hasSeats = items.length > 0;

  return (
    <div className="sticky bottom-0 z-50 bg-(--color-bg) border-t border-(--color-border) px-4 pb-6 pt-3">
      <div className="flex items-end justify-between mb-3 min-h-[40px]">
        <div>
          <p className="text-[9px] font-bold tracking-widest uppercase text-(--color-text-muted) mb-0.5">
            Selected Seats
          </p>
          <p
            className={`font-bold text-base ${
              hasSeats
                ? "text-(--color-text-primary)"
                : "text-(--color-text-muted)"
            }`}
          >
            {hasSeats ? labels : "—"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold tracking-widest uppercase text-(--color-text-muted) mb-0.5">
            Total Price
          </p>
          <p
            className={`font-extrabold text-xl tabular-nums ${
              hasSeats
                ? "text-(--color-gold)"
                : "text-(--color-text-muted)"
            }`}
          >
            {hasSeats ? `${total.toLocaleString("vi-VN")}₫` : "—"}
          </p>
        </div>
      </div>

      <Link
        href={hasSeats ? `/booking/${slug}/snack` : "#"}
        aria-disabled={!hasSeats}
        onClick={(e) => !hasSeats && e.preventDefault()}
        className={`flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 ${
          hasSeats
            ? "bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)] active:scale-[0.98]"
            : "bg-(--color-surface) text-(--color-text-muted) cursor-not-allowed border border-(--color-border)"
        }`}
      >
        Continue to Snacks
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}
