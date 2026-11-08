"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { AdminLiveShowtimeItem } from "@/features/admin/types";
import AdminPoster from "../shared/AdminPoster";

interface LiveShowtimesMonitorProps {
  showtimes: AdminLiveShowtimeItem[];
}

/**
 * Live showtime operations monitor reporting active screens and seat fill rates.
 */
export default function LiveShowtimesMonitor({ showtimes }: LiveShowtimesMonitorProps) {
  const { translate } = useLocale();

  // Board shows the 5 nearest operations: anything not ended outranks ended
  // rows, and the API's start-time order is kept inside each group.
  const visibleShowtimes = [
    ...showtimes.filter((item) => item.status !== "ended"),
    ...showtimes.filter((item) => item.status === "ended"),
  ].slice(0, 5);

  const getStatusBadge = (status: AdminLiveShowtimeItem["status"]) => {
    switch (status) {
      case "in_screen":
        return {
          label: translate("admin.dashboard.status_in_screen"),
          className: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
        };
      case "almost_full":
        return {
          label: translate("admin.dashboard.status_almost_full"),
          className: "bg-amber-500/15 text-amber-500 border-amber-500/30",
        };
      case "sold_out":
        return {
          label: translate("admin.dashboard.status_sold_out"),
          className: "bg-rose-500/15 text-rose-500 border-rose-500/30",
        };
      case "ended":
        return {
          label: translate("admin.dashboard.status_ended"),
          className: "bg-(--color-surface-2) text-(--color-text-muted) border-(--color-border)",
        };
      case "selling":
      default:
        return {
          label: translate("admin.dashboard.status_selling"),
          className: "bg-sky-500/15 text-sky-500 border-sky-500/30",
        };
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-(--color-text-primary)">
            {translate("admin.dashboard.live_showtimes_title")}
          </h2>
          <p className="text-2xs text-(--color-text-muted)">
            {translate("admin.dashboard.live_showtimes_subtitle")}
          </p>
        </div>

        <Link
          href="/admin/showtimes"
          prefetch={false}
          className="group inline-flex items-center gap-1 text-2xs font-semibold text-(--color-text-secondary) no-underline transition-colors hover:text-(--admin-accent-ink)"
        >
          <span>{translate("admin.dashboard.view_all_showtimes")}</span>
          <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {visibleShowtimes.length === 0 ? (
        <p className="mt-4 flex-1 rounded-xl border border-dashed border-(--color-border) px-4 py-8 text-center text-2xs text-(--color-text-muted)">
          {translate("admin.dashboard.empty_showtimes")}
        </p>
      ) : (
      <div className="mt-4 flex-1 space-y-2.5 overflow-x-auto">
        <div className="min-w-[560px]">
          {visibleShowtimes.map((item) => {
            const statusBadge = getStatusBadge(item.status);
            const fillPercent = Math.round((item.bookedSeats / item.totalSeats) * 100);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 border-b border-(--color-border)/50 py-2.5 last:border-b-0 hover:bg-(--color-surface-2)/30 px-2 rounded-lg transition-colors"
              >
                {/* Time & format */}
                <div className="w-24 shrink-0">
                  <span className="text-xs font-bold text-(--color-text-primary)">
                    {item.startTime}
                  </span>
                  <span className="text-3xs text-(--color-text-muted)"> - {item.endTime}</span>
                  <div className="mt-0.5">
                    <span className="inline-block rounded bg-(--color-surface-2) px-1.5 py-0.5 text-3xs font-semibold text-(--color-text-secondary)">
                      {item.format}
                    </span>
                  </div>
                </div>

                {/* Movie poster & Hall */}
                <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
                  <AdminPoster
                    src={item.posterUrl}
                    alt={item.movieTitle}
                    className="h-10 w-16 aspect-video"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate text-xs font-bold text-(--color-text-primary)">
                      {item.movieTitle}
                    </h3>
                    <p className="truncate text-3xs text-(--color-text-muted)">
                      {item.cinemaName} · {item.roomName}
                    </p>
                  </div>
                </div>

                {/* Booked / Total seats + check-in progress */}
                <div className="w-28 shrink-0 text-right">
                  <p className="text-xs font-semibold text-(--color-text-primary)">
                    {item.bookedSeats} / {item.totalSeats}{" "}
                    <span className="text-3xs text-(--color-text-muted)">{translate("admin.dashboard.seats_suffix")}</span>
                  </p>
                  <div className="mt-1 flex items-center justify-end gap-1.5">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-(--color-surface-2)">
                      <div
                        className="h-full rounded-full bg-(--color-gold)"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                    <span className="text-3xs text-(--color-text-muted)">{fillPercent}%</span>
                  </div>
                  <p className="mt-0.5 text-3xs text-(--color-text-muted)">
                    {translate("admin.dashboard.checkin_progress")}:{" "}
                    {item.checkedInSeats}/{item.bookedSeats}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="w-24 shrink-0 text-right">
                  <span
                    className={`inline-block rounded-md border px-2 py-0.5 text-3xs font-semibold ${statusBadge.className}`}
                  >
                    {statusBadge.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}
    </div>
  );
}
