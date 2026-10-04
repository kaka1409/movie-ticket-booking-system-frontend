"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useBooking } from "@/features/booking/context";
import { useStatus } from "@/features/booking/contexts/StatusContext";
import { useLocale } from "@/contexts/LocaleContext";
import DetailRow from "@/app/(sub)/booking/components/mobile/DetailRow";
import TearLine from "@/components/ui/TearLine";
import { formatVND } from "@/libs/utils";
import { MonitorPlay, CalendarDays, Armchair, Popcorn, CreditCard } from "lucide-react";

export default function TicketCard() {
  const {
    cinemaName,
    room,
    location,
    date,
    time,
    selectedSeats,
    paymentMethod,
    combos,
    foods,
    total,
  } = useBooking();
  const { transactionId, movie, mounted } = useStatus();
  const { translate } = useLocale();

  const hasSnacks = combos.length > 0 || foods.length > 0;

  return (
    <div
      className={`mx-4 rounded-3xl overflow-visible bg-(--color-surface) border border-(--color-border) shadow-[--shadow-card] transition-all duration-700 delay-300 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* Top: movie info */}
      <div className="flex gap-3 p-4">
        {movie?.src && (
          <div className="w-20 h-30 flex-shrink-0 rounded-sm overflow-hidden relative">
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
          <h3 className="font-bold text-base text-white mb-1">{movie?.title ?? "N/A"}</h3>
          <p className="text-xs text-white/60 mb-2">{movie?.ageRating}</p>
        </div>
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
                {cinemaName}
                {room && <>, {room}</>}
                {location && <>, {location}</>}
              </>
            }
          />
          <DetailRow
            icon={CalendarDays}
            label={translate("booking.common.date_time")}
            value={`${date}  ${time}`}
            valueClass="text-white font-bold text-sm text-right"
            labelClass="justify-end"
          />
        </div>

        <div className="space-y-3">
          <p className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.16em] uppercase text-white/60">
            <Armchair size={10} />
            {translate("booking.common.seats")} ({selectedSeats.length})
          </p>
          {Object.entries(
            selectedSeats.reduce<Record<string, typeof selectedSeats>>((acc, seat) => {
              (acc[seat.type] ??= []).push(seat);
              return acc;
            }, {}),
          ).map(([type, seats]) => (
            <div key={type} className="space-y-1">
              <p className="text-sm font-bold text-white">{seats.map((s) => s.label).join(", ")}</p>
              <div className="flex justify-between text-sm">
                <span className="text-white">
                  {type} {translate("booking.common.ticket")}
                </span>
                <span className="font-medium text-white">
                  {seats.length}× {formatVND(seats[0].price)}
                </span>
              </div>
            </div>
          ))}
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
            <p className="font-bold text-base text-(--color-gold)">{formatVND(total)}</p>
          </div>
        </div>
      </div>

      {/* Tear line */}
      <TearLine className="px-0 my-0" lineClassName="mx-3" />

      {/* QR code */}
      <div className="px-4 pb-5 pt-4 flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-4 px-6 py-6 rounded-2xl bg-white">
          <QRCodeSVG value={`https://primseat.com/tickets/${transactionId}`} size={250} level="H" />
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">
            {translate("booking.common.scan_enter")}
          </p>
        </div>
        <p className="text-xs text-white/60 tracking-wide">
          {translate("booking.status.success.booking_id")}
          <span className="font-bold text-white">#{transactionId}</span>
        </p>
      </div>
    </div>
  );
}
