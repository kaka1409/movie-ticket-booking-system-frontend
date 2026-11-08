"use client";

import Link from "next/link";
import { Trophy, ChevronRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND, toLocaleTag } from "@/libs/utils";
import AdminPoster from "../shared/AdminPoster";
import type { AdminTopMoviePerformance } from "@/features/admin/types";

interface TopBoxOfficeTableProps {
  movies: AdminTopMoviePerformance[];
}

/**
 * Top box office ranking table with movie art, revenue, and occupancy progress bars.
 */
export default function TopBoxOfficeTable({ movies }: TopBoxOfficeTableProps) {
  const { locale, translate } = useLocale();

  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) return "bg-amber-500/15 text-amber-500 border-amber-500/30";
    if (rank === 2) return "bg-slate-400/15 text-slate-300 border-slate-400/30";
    if (rank === 3) return "bg-amber-700/15 text-amber-600 border-amber-700/30";
    return "bg-(--color-surface-2) text-(--color-text-muted) border-transparent";
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-gold)/15 text-(--admin-accent-ink)">
            <Trophy size={16} aria-hidden />
          </div>
          <div>
            <h2 className="text-sm font-bold text-(--color-text-primary)">
              {translate("admin.dashboard.top_movies_title")}
            </h2>
            <p className="text-2xs text-(--color-text-muted)">
              {translate("admin.dashboard.top_movies_subtitle")}
            </p>
          </div>
        </div>

        <Link
          href="/admin/movies"
          prefetch={false}
          className="group inline-flex items-center gap-1 text-2xs font-semibold text-(--color-text-secondary) no-underline transition-colors hover:text-(--admin-accent-ink)"
        >
          <span>{translate("admin.dashboard.view_all_movies")}</span>
          <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {movies.length === 0 ? (
        <p className="mt-4 flex-1 rounded-xl border border-dashed border-(--color-border) px-4 py-8 text-center text-2xs text-(--color-text-muted)">
          {translate("admin.dashboard.empty_top_movies")}
        </p>
      ) : (
      <div className="mt-4 flex-1 space-y-3">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex items-center gap-3 rounded-xl border border-(--color-border)/50 bg-(--color-surface-2)/40 p-2.5 transition-colors hover:bg-(--color-surface-2)"
          >
            {/* Rank badge */}
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${getRankBadgeClass(
                movie.rank,
              )}`}
            >
              {movie.rank}
            </span>

            {/* Movie Poster */}
            <AdminPoster
              src={movie.posterUrl}
              alt={movie.title}
              className="h-11 w-20"
            />

            {/* Title & Genre */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xs font-bold text-(--color-text-primary)">
                {movie.title}
              </h3>
              <p className="truncate text-3xs text-(--color-text-muted)">{movie.genre}</p>
            </div>

            {/* Revenue & Tickets */}
            <div className="shrink-0 text-right">
              <p className="text-xs font-bold text-(--color-text-primary)">
                {formatVND(movie.revenue, locale)}
              </p>
              <p className="text-3xs text-(--color-text-muted)">
                {movie.ticketsSold.toLocaleString(toLocaleTag(locale))}{" "}
                {translate("admin.dashboard.tickets_suffix")}
              </p>
            </div>

            {/* Occupancy Progress Mini Bar */}
            <div className="hidden w-16 shrink-0 sm:block">
              <div className="flex items-center justify-between text-3xs font-medium text-(--color-text-muted)">
                <span>{movie.occupancyRate}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-(--color-surface)">
                <div
                  className="h-full rounded-full bg-(--color-gold)"
                  style={{ width: `${movie.occupancyRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
