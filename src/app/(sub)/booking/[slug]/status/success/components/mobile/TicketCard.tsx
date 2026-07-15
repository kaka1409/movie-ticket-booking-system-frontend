"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useBooking } from "@/features/booking/context";
import { useStatus } from "../../../components/mobile/StatusContext";
import DetailRow from "@/features/booking/components/common/DetailRow";
import {
  MonitorPlay,
  CalendarDays,
  Armchair,
  Popcorn,
  CreditCard,
} from "lucide-react";

export default function TicketCard() {
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
  const { transactionId, movie, mounted } = useStatus();

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
          <div className="w-20 flex-shrink-0 rounded-xl overflow-hidden relative">
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
      <div className="relative flex items-center px-0 my-0">
        <div className="absolute -left-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
        <div className="flex-1 border-t-2 border-dashed border-(--color-border) mx-3" />
        <div className="absolute -right-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
      </div>

      {/* Booking details */}
      <div className="px-4 py-4 space-y-4">
        <div className="flex justify-between gap-4">
          <DetailRow
            icon={MonitorPlay}
            label="Theater"
            value={
              <>
                {cinemaName}
                {room && <>, {room}</>}
              </>
            }
          />
          <DetailRow
            icon={CalendarDays}
            label="Date & Time"
            value={`${date} • ${time}`}
            valueClass="text-white font-bold text-sm text-right"
            labelClass="justify-end"
          />
        </div>

        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.16em] uppercase text-white/60">
            <Armchair size={10} />
            Seats ({selectedSeats.length})
          </p>
          <p className="text-lg font-extrabold text-white">
            {selectedSeats.map((s) => s.label).join(", ")}
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-white">{seatType} Ticket</span>
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
              Snacks & Combos
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
            label="Payment Method"
            value={paymentMethod || "N/A"}
          />
          <div className="text-right">
            <p className="flex items-center justify-end gap-1.5 text-[9px] font-black tracking-[0.16em] uppercase text-white/60">
              Total Price
            </p>
            <p className="font-bold text-base text-(--color-gold)">
              {total.toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>
      </div>

      {/* Tear line */}
      <div className="relative flex items-center px-0 my-0">
        <div className="absolute -left-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
        <div className="flex-1 border-t-2 border-dashed border-(--color-border) mx-3" />
        <div className="absolute -right-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
      </div>

      {/* QR code */}
      <div className="px-4 pb-5 pt-4 flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-4 px-6 py-6 rounded-2xl bg-white">
          <QRCodeSVG
            value={`https://primseat.com/tickets/${transactionId}`}
            size={250}
            level="H"
          />
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">
            Scan to Enter
          </p>
        </div>
        <p className="text-xs text-white/60 tracking-wide">
          Booking ID:{" "}
          <span className="font-bold text-white">#{transactionId}</span>
        </p>
      </div>
    </div>
  );
}
