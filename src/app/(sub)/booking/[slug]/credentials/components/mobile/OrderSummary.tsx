"use client";

import Image from "next/image";
import { CalendarDays, MapPin, Armchair, Ticket, Popcorn } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import type { Movie } from "@/features/movies/types";

export default function OrderSummary({ movie }: { movie: Movie }) {
  const { translate } = useLocale();
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
    total,
  } = useBooking();

  const seatLabels = selectedSeats.map((s) => s.label).join(", ");

  return (
    <div className="px-4 space-y-3">
      <h2 className="font-bold text-lg text-white">{translate("booking.common.order_summary")}</h2>

      <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) overflow-hidden">
        {/* Movie info */}
        <div className="flex gap-3 p-4 border-b border-(--color-border)">
          {movie?.src && (
            <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-(--color-surface-2)">
              <Image
                src={movie.src}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-white leading-snug mb-1">
              {movie?.title ?? "—"}
            </h3>
            <p className="text-xs text-(--color-text-secondary)">
              {movie?.genre} • {movie?.duration} min
            </p>
          </div>
        </div>

        {/* Screening details */}
        <div className="p-4 border-b border-(--color-border) space-y-1.5">
          <p className="flex items-center gap-2 text-sm text-white">
            <CalendarDays size={13} className="text-(--color-text-muted) flex-shrink-0" />
            {date && time ? `${date} • ${time}` : "—"}
          </p>
          <p className="flex items-center gap-2 text-sm text-white">
            <MapPin size={13} className="text-(--color-text-muted) flex-shrink-0" />
            {cinemaName || "—"}
            {room && (
              <>
                <span className="text-(--color-border)">•</span>
                {room}
              </>
            )}
          </p>
          <p className="flex items-center gap-2 text-sm text-white">
            <Armchair size={13} className="text-(--color-text-muted) flex-shrink-0" />
            {translate("booking.common.seats")}: {seatLabels || "—"}
          </p>
        </div>

        {/* Line items */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-white">
              <Ticket size={13} className="text-(--color-text-muted)" />
              {ticketCount}× {seatType} {translate("booking.common.ticket")}
            </span>
            <span className="font-semibold text-sm text-white">
              {ticketPrice.toLocaleString("vi-VN")}₫
            </span>
          </div>

          {combos.map((c) => (
            <div key={c.id} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-white">
                <Popcorn size={13} className="text-(--color-text-muted)" />
                {c.name} ×{c.qty}
              </span>
              <span className="font-semibold text-sm text-white">
                {(c.price * c.qty).toLocaleString("vi-VN")}₫
              </span>
            </div>
          ))}

          {foods.map((f) => (
            <div key={f.id} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-white">
                <Popcorn size={13} className="text-(--color-text-muted)" />
                {f.name} ×{f.qty}
              </span>
              <span className="font-semibold text-sm text-white">
                {(f.price * f.qty).toLocaleString("vi-VN")}₫
              </span>
            </div>
          ))}

          <div className="h-px bg-(--color-border) my-1" />

          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white">{translate("booking.common.total")}</span>
            <span className="font-extrabold text-lg text-(--color-gold)">
              {total.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
