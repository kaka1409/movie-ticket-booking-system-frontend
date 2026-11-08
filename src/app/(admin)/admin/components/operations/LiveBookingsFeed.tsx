"use client";

import Link from "next/link";
import { ChevronRight, CreditCard } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatCalendarDate } from "@/libs/date";
import { formatRelativeTime, formatVND } from "@/libs/utils";
import type {
  AdminLiveBookingItem,
  AdminPaymentMethod,
} from "@/features/admin/types";
import AdminAvatar from "../shared/AdminAvatar";
import AdminPoster from "../shared/AdminPoster";

interface LiveBookingsFeedProps {
  bookings: AdminLiveBookingItem[];
  paymentMethods: AdminPaymentMethod[];
}

function paymentMethodLabel(
  methods: AdminPaymentMethod[],
  methodId: string,
  locale: "en" | "vn",
): string {
  const match = methods.find((method) => method.id === methodId);
  if (match) return locale === "vn" && match.nameVi ? match.nameVi : match.nameEn;
  return methodId;
}

/**
 * Real-time transaction feed detailing recent bookings, payment channels, and items.
 */
export default function LiveBookingsFeed({ bookings, paymentMethods }: LiveBookingsFeedProps) {
  const { locale, translate } = useLocale();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-(--color-text-primary)">
            {translate("admin.dashboard.live_bookings_title")}
          </h2>
          <p className="text-2xs text-(--color-text-muted)">
            {translate("admin.dashboard.live_bookings_subtitle")}
          </p>
        </div>

        <Link
          href="/admin/transactions"
          prefetch={false}
          className="group inline-flex items-center gap-1 text-2xs font-semibold text-(--color-text-secondary) no-underline transition-colors hover:text-(--admin-accent-ink)"
        >
          <span>{translate("admin.dashboard.view_all_bookings")}</span>
          <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {bookings.length === 0 ? (
        <p className="mt-4 flex-1 rounded-xl border border-dashed border-(--color-border) px-4 py-8 text-center text-2xs text-(--color-text-muted)">
          {translate("admin.dashboard.empty_bookings")}
        </p>
      ) : (
      <div className="mt-4 flex-1 space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col gap-2 rounded-xl border border-(--color-border)/50 bg-(--color-surface-2)/30 p-3 transition-colors hover:bg-(--color-surface-2)"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AdminAvatar
                  name={booking.customerName}
                  avatarUrl={booking.customerAvatarUrl}
                  size={22}
                />
                <span className="font-mono text-xs font-bold text-(--admin-accent-ink)">
                  #{booking.bookingCode}
                </span>
                <span className="text-xs font-semibold text-(--color-text-primary)">
                  {booking.customerName}
                </span>
              </div>
              <span className="text-3xs text-(--color-text-muted)">
                {formatRelativeTime(booking.createdAt, locale)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 text-2xs text-(--color-text-secondary)">
              <span className="flex min-w-0 items-center gap-2">
                <AdminPoster
                  src={booking.moviePosterUrl}
                  alt={booking.movieTitle}
                  className="h-9 w-14 aspect-video"
                />
                <span className="truncate font-medium text-(--color-text-primary)">
                  {booking.movieTitle}
                </span>
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
                <span>
                  {booking.paymentMethod
                    ? paymentMethodLabel(paymentMethods, booking.paymentMethod, locale)
                    : translate("admin.dashboard.no_payment")}
                </span>
                <span className="text-(--color-text-muted)">·</span>
                <span>
                  {booking.showtime.startTime} {formatCalendarDate(booking.showtime.date, locale)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-(--color-text-primary)">
                  {formatVND(booking.totalAmount, locale)}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-3xs font-semibold ${
                    booking.status === "paid"
                      ? "bg-emerald-500/15 text-emerald-500"
                      : booking.status === "cancelled"
                        ? "bg-rose-500/15 text-rose-500"
                        : "bg-amber-500/15 text-amber-500"
                  }`}
                >
                  {booking.status === "paid"
                    ? translate("admin.dashboard.paid")
                    : booking.status === "cancelled"
                      ? translate("admin.dashboard.cancelled")
                      : translate("admin.dashboard.holding")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
