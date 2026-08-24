"use client";

import Image from "next/image";
import { MonitorPlay, CalendarDays, Armchair, Popcorn } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import DetailRow from "@/app/(sub)/booking/components/mobile/DetailRow";
import TearLine from "@/components/ui/TearLine";
import type { Movie } from "@/features/movies/types";

export default function OrderSummary({ movie }: { movie: Movie }) {
  const { translate } = useLocale();
  const {
    cinemaName,
    room,
    location,
    date,
    time,
    selectedSeats,
    combos,
    foods,
    total,
  } = useBooking();

  const hasSnacks = combos.length > 0 || foods.length > 0;

  return (
    <div className="mx-4 rounded-2xl bg-(--color-surface) border border-(--color-border) overflow-visible">
      <div className="px-4 pt-3 pb-2">
        <p className="text-[9px] font-black tracking-[0.18em] uppercase text-(--color-text-muted)">
          {translate("booking.common.order_summary")}
        </p>
      </div>

      {/* Movie info */}
      <div className="flex items-start justify-between gap-3 px-4 pb-4">
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

      {/* Tear line */}
      <TearLine className="px-0 my-0" lineClassName="mx-3" />

      {/* Booking details */}
      <div className="px-4 py-4 space-y-4">
        <div className="flex justify-between gap-4">
          <DetailRow
            icon={MonitorPlay}
            label={translate("booking.common.theater")}
            value={
              <>
                {cinemaName || "—"}
                {room && <>, {room}</>}
                {location && <>, {location}</>}
              </>
            }
          />
          <DetailRow
            icon={CalendarDays}
            label={translate("booking.common.date_time")}
            value={date && time ? `${date} • ${time}` : "—"}
            valueClass="text-white font-bold text-sm text-right"
            labelClass="justify-end"
          />
        </div>

        {/* Seats grouped by type */}
        <div className="space-y-3">
          <p className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.16em] uppercase text-white/60">
            <Armchair size={10} />
            {translate("booking.common.seats")} ({selectedSeats.length})
          </p>
          {Object.entries(
            selectedSeats.reduce<Record<string, typeof selectedSeats>>((acc, seat) => {
              (acc[seat.type] ??= []).push(seat);
              return acc;
            }, {})
          ).map(([type, seats]) => (
            <div key={type} className="space-y-1">
              <p className="text-sm font-bold text-white">
                {seats.map((s) => s.label).join(", ")}
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-white">{type} {translate("booking.common.ticket")}</span>
                <span className="font-medium text-white">
                  {seats.length}× {formatVND(seats[0].price)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Snacks */}
        {hasSnacks && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.16em] uppercase text-white/60">
              <Popcorn size={10} />
              {translate("booking.common.snacks_combos")}
            </p>
            <div className="space-y-1">
              {combos.map((c) => (
                <div key={c.id} className="flex justify-between text-sm">
                  <span className="text-white">{c.name}</span>
                  <span className="font-medium text-white">
                    {c.qty}× {formatVND(c.qty * c.price)}
                  </span>
                </div>
              ))}
              {foods.map((f) => (
                <div key={f.id} className="flex justify-between text-sm">
                  <span className="text-white">{f.name}</span>
                  <span className="font-medium text-white">
                    {f.qty}× {formatVND(f.qty * f.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-end">
          <div className="text-right">
            <p className="flex items-center justify-end gap-1.5 text-[9px] font-black tracking-[0.16em] uppercase text-white/60">
              {translate("booking.common.total_price")}
            </p>
            <p className="font-bold text-base text-(--color-gold)">
              {formatVND(total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
