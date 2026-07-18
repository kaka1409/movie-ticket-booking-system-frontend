"use client";

import Image from "next/image";
import { useBooking } from "@/features/booking/context";
import { useStatus } from "@/features/booking/contexts/StatusContext";
import { useLocale } from "@/contexts/LocaleContext";
import DetailRow from "@/app/(sub)/booking/components/mobile/DetailRow";
import {
  MonitorPlay,
  CalendarDays,
  Armchair,
  Popcorn,
  CreditCard,
} from "lucide-react";

const ERROR_CODES: Record<string, string> = {
  payment_declined: "ERR_PAYMENT_DECLINED",
  insufficient_funds: "ERR_INSUFFICIENT_FUNDS",
  network_error: "ERR_NETWORK",
  expired_card: "ERR_CARD_EXPIRED",
};

export default function FailedOrderCard() {
  const {
    cinemaName,
    room,
    date,
    time,
    selectedSeats,
    seatType,
    paymentMethod,
    combos,
    foods,
    total,
  } = useBooking();
  const { transactionId, reason, movie, mounted } = useStatus();
  const { translate } = useLocale();

  const errorCode = ERROR_CODES[reason ?? ""] ?? "ERR_UNKNOWN";
  const hasSnacks = combos.length > 0 || foods.length > 0;

  return (
    <div
      className={`mx-4 rounded-3xl overflow-visible bg-(--color-surface) border border-red-500/20 shadow-[0_0_0_1px_rgba(239,68,68,0.06)] transition-all duration-700 delay-300 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* Top: movie info */}
      <div className="flex gap-3 p-4">
        {movie?.src && (
          <div className="w-20 flex-shrink-0 rounded-xl overflow-hidden relative opacity-70">
            <Image
              src={movie.src}
              alt={movie.title}
              width={80}
              height={120}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-bold text-base text-white mb-1">
            {movie?.title ?? "N/A"}
          </h3>
          <p className="text-xs text-white/60 mb-2">{movie?.ageRating}</p>
        </div>
      </div>

      {/* Tear line */}
      <div className="relative flex items-center">
        <div className="absolute -left-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
        <div className="flex-1 border-t-2 border-dashed border-(--color-border) mx-3" />
        <div className="absolute -right-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
      </div>

      {/* Booking details */}
      <div className="px-4 py-4 space-y-4">
        <div className="flex justify-between gap-4">
          <DetailRow
            icon={MonitorPlay}
            label={translate("booking.common.theater")}
            value={
              <>
                {cinemaName}
                {room && <>, {room}</>}
              </>
            }
          />
          <DetailRow
            icon={CalendarDays}
            label={translate("booking.common.date_time")}
            value={`${date} • ${time}`}
            valueClass="font-bold text-sm text-white text-right"
            labelClass="justify-end"
          />
        </div>

        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.16em] uppercase text-white/60">
            <Armchair size={10} />
            {translate("booking.common.seats")} ({selectedSeats.length})
          </p>
          <p className="text-lg font-extrabold text-white">
            {selectedSeats.map((s) => s.label).join(", ")}
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-white">{seatType} {translate("booking.common.ticket")}</span>
            <span className="font-medium text-white">
              {selectedSeats.length}×{" "}
              {selectedSeats[0]?.price.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>

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
                    {c.qty}× {(c.qty * c.price).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              ))}
              {foods.map((f) => (
                <div key={f.id} className="flex justify-between text-sm">
                  <span className="text-white">{f.name}</span>
                  <span className="font-medium text-white">
                    {f.qty}× {(f.qty * f.price).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-end gap-4">
          <DetailRow
            icon={CreditCard}
            label={translate("booking.common.payment_method")}
            value={paymentMethod || "N/A"}
          />
          <div className="text-right">
            <p className="flex items-center justify-end gap-1.5 text-[9px] font-black tracking-[0.16em] uppercase text-white/60">
              {translate("booking.common.total_price")}
            </p>
            <p className="font-bold text-base text-white">
              {total.toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>

        {/* Error code pill */}
        <div className="flex items-center gap-2 pt-1">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-red-500/10 text-red-400 border border-red-500/20">
            {errorCode}
          </span>
          <span className="text-[10px] text-white/60">
            {translate("booking.status.failed.card_not_charged")}
          </span>
        </div>
      </div>

      {/* Tear line */}
      <div className="relative flex items-center">
        <div className="absolute -left-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
        <div className="flex-1 border-t-2 border-dashed border-(--color-border) mx-3" />
        <div className="absolute -right-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
      </div>
    </div>
  );
}
