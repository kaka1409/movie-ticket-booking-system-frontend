"use client";

import Image from "next/image";
import { CalendarDays, MapPin, Armchair, Ticket, Popcorn } from "lucide-react";
import { ORDER_SUMMARY } from "@/features/booking/mock";

export default function OrderSummary() {
  const subtotal = ORDER_SUMMARY.ticketPrice;
  const comboTotal = ORDER_SUMMARY.combos.reduce((s, c) => s + c.price * c.qty, 0);
  const foodTotal = ORDER_SUMMARY.foods.reduce((s, f) => s + f.price * f.qty, 0);
  const total = subtotal + comboTotal + foodTotal + ORDER_SUMMARY.convFee;

  return (
    <div className="px-4 space-y-3">
      <h2 className="font-bold text-lg text-white">Order Summary</h2>

      <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) overflow-hidden">
        {/* Movie info */}
        <div className="flex gap-3 p-4 border-b border-(--color-border)">
          <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-(--color-surface-2)">
            <Image
              src={ORDER_SUMMARY.image}
              alt={ORDER_SUMMARY.movie}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-white leading-snug mb-1">
              {ORDER_SUMMARY.movie}
            </h3>
            <p className="text-xs text-(--color-text-secondary)">
              {ORDER_SUMMARY.genre} • {ORDER_SUMMARY.duration} min
            </p>
          </div>
        </div>

        {/* Screening details */}
        <div className="p-4 border-b border-(--color-border) space-y-1.5">
          <p className="flex items-center gap-2 text-sm text-white">
            <CalendarDays size={13} className="text-(--color-text-muted) flex-shrink-0" />
            {ORDER_SUMMARY.datetime}
          </p>
          <p className="flex items-center gap-2 text-sm text-white">
            <MapPin size={13} className="text-(--color-text-muted) flex-shrink-0" />
            {ORDER_SUMMARY.cinema}
            <span className="text-(--color-border)">•</span>
            {ORDER_SUMMARY.room}
          </p>
          <p className="flex items-center gap-2 text-sm text-white">
            <Armchair size={13} className="text-(--color-text-muted) flex-shrink-0" />
            Seats: {ORDER_SUMMARY.seats.join(", ")}
          </p>
        </div>

        {/* Line items */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-white">
              <Ticket size={13} className="text-(--color-text-muted)" />
              {ORDER_SUMMARY.ticketCount}× {ORDER_SUMMARY.seatType} Ticket
            </span>
            <span className="font-semibold text-sm text-white">
              {subtotal.toLocaleString("vi-VN")}₫
            </span>
          </div>

          {ORDER_SUMMARY.combos.map((c) => (
            <div key={c.name} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-white">
                <Popcorn size={13} className="text-(--color-text-muted)" />
                {c.name} ×{c.qty}
              </span>
              <span className="font-semibold text-sm text-white">
                {(c.price * c.qty).toLocaleString("vi-VN")}₫
              </span>
            </div>
          ))}

          {ORDER_SUMMARY.foods.map((f) => (
            <div key={f.name} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-white">
                <Popcorn size={13} className="text-(--color-text-muted)" />
                {f.name} ×{f.qty}
              </span>
              <span className="font-semibold text-sm text-white">
                {(f.price * f.qty).toLocaleString("vi-VN")}₫
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Convenience Fee</span>
            <span className="font-semibold text-sm text-white">
              {ORDER_SUMMARY.convFee.toLocaleString("vi-VN")}₫
            </span>
          </div>

          <div className="h-px bg-(--color-border) my-1" />

          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white">Total</span>
            <span className="font-extrabold text-lg text-(--color-gold)">
              {total.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
