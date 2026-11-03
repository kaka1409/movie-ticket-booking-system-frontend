"use client";

import { CreditCard, Activity } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import type { AdminLiveBookingItem } from "@/features/admin/types";

interface LiveBookingsFeedProps {
  bookings: AdminLiveBookingItem[];
}

/**
 * Real-time transaction feed detailing recent bookings, payment channels, and items.
 */
export default function LiveBookingsFeed({ bookings }: LiveBookingsFeedProps) {
  const { locale, translate } = useLocale();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-surface-2) text-(--color-text-secondary)">
            <Activity size={16} aria-hidden />
          </div>
          <div>
            <h2 className="text-sm font-bold text-(--color-text-primary)">
              {translate("admin.dashboard.live_bookings_title")}
            </h2>
            <p className="text-2xs text-(--color-text-muted)">
              {translate("admin.dashboard.live_bookings_subtitle")}
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-3xs font-semibold text-emerald-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {translate("admin.dashboard.realtime_active")}
        </span>
      </div>

      <div className="mt-4 flex-1 space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col gap-2 rounded-xl border border-(--color-border)/50 bg-(--color-surface-2)/30 p-3 transition-colors hover:bg-(--color-surface-2)"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-(--admin-accent-ink)">
                  #{booking.bookingCode}
                </span>
                <span className="text-xs font-semibold text-(--color-text-primary)">
                  {booking.customerName}
                </span>
                {booking.isGuest && (
                  <span className="rounded bg-(--color-surface-2) px-1.5 py-0.5 text-3xs text-(--color-text-muted)">
                    {translate("admin.dashboard.guest")}
                  </span>
                )}
              </div>
              <span className="text-3xs text-(--color-text-muted)">{booking.createdAt}</span>
            </div>

            <div className="flex items-center justify-between text-2xs text-(--color-text-secondary)">
              <span className="truncate max-w-[200px] font-medium text-(--color-text-primary)">
                {booking.movieTitle}
              </span>
              <span>
                {booking.seatCount} {translate("admin.dashboard.seats_suffix")}
                {booking.comboCount > 0 &&
                  ` + ${booking.comboCount} ${translate("admin.dashboard.combo_suffix")}`}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-(--color-border)/30">
              <div className="flex items-center gap-1.5 text-3xs text-(--color-text-muted)">
                <CreditCard size={12} aria-hidden />
                <span>{booking.paymentMethod}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-(--color-text-primary)">
                  {formatVND(booking.totalAmount, locale)}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-3xs font-semibold ${
                    booking.status === "paid"
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-amber-500/15 text-amber-500"
                  }`}
                >
                  {booking.status === "paid"
                    ? translate("admin.dashboard.paid")
                    : translate("admin.dashboard.holding")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
