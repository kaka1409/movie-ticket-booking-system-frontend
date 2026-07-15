"use client";

import Image from "next/image";
import { useBooking } from "@/features/booking/context";
import type { Movie } from "@/features/movies/types";

export default function OrderSummary({ movie }: { movie: Movie }) {
  const {
    cinemaName,
    room,
    date,
    time,
    selectedSeats,
    seatType,
    ticketCount,
    ticketPrice,
    combos,
    foods,
    snackTotal,
    total,
  } = useBooking();

  const seatLabels = selectedSeats.map((s) => s.label).join(", ");

  return (
    <div className="mx-4 rounded-2xl bg-(--color-surface) border border-(--color-border) overflow-hidden">
      <div className="px-4 pt-3 pb-2 border-b border-(--color-border)">
        <p className="text-[9px] font-black tracking-[0.18em] uppercase text-(--color-text-muted)">
          Order Summary
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Movie info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            {movie?.src && (
              <div className="relative w-12 h-18 flex-shrink-0 rounded-sm overflow-hidden bg-(--color-surface-2)">
                <Image
                  src={movie.src}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="font-bold text-base text-(--color-text-primary) leading-snug mb-1">
                {movie?.title ?? "—"}
              </h3>
              <p className="text-xs text-(--color-text-muted)">
                {movie?.genre} • {movie?.duration} min
              </p>
            </div>
          </div>
          {movie?.ageRating && (
            <span className="flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-(--color-border) text-(--color-text-secondary) bg-(--color-surface-2)">
              {movie.ageRating}
            </span>
          )}
        </div>

        <div className="h-px bg-(--color-border)" />

        {/* Cinema + datetime */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-(--color-text-muted)">
            {cinemaName || "—"}
            {room && ` • ${room}`}
          </span>
          <span className="text-sm text-right font-semibold text-(--color-text-primary)">
            {date && time ? `${date} • ${time}` : "—"}
          </span>
        </div>

        {/* Seats */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-(--color-text-muted)">
            Seats ({ticketCount})
          </span>
          <span className="font-bold text-sm text-(--color-gold)">
            {seatLabels || "—"}
          </span>
        </div>

        {/* Combos */}
        {combos.map((c) => (
          <div key={c.id} className="flex items-center justify-between">
            <span className="text-sm text-(--color-text-muted)">
              {c.name} ×{c.qty}
            </span>
            <span className="font-semibold text-sm text-(--color-text-primary)">
              {(c.price * c.qty).toLocaleString("vi-VN")}₫
            </span>
          </div>
        ))}

        {/* Foods */}
        {foods.map((f) => (
          <div key={f.id} className="flex items-center justify-between">
            <span className="text-sm text-(--color-text-muted)">
              {f.name} ×{f.qty}
            </span>
            <span className="font-semibold text-sm text-(--color-text-primary)">
              {(f.price * f.qty).toLocaleString("vi-VN")}₫
            </span>
          </div>
        ))}

        <div className="h-px bg-(--color-border)" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-base text-(--color-text-primary)">
            Total
          </span>
          <span className="font-extrabold text-xl text-(--color-gold) tabular-nums">
            {total.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>
    </div>
  );
}
