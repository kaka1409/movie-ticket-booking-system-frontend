"use client";

import { useState, useRef, useEffect, useMemo, useTransition } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  DATE_STRIP_DAYS,
  INITIAL_CINEMAS_VISIBLE,
} from "@/features/showtimes/constants";
import { useMovieSelection } from "@/features/movies/context";
import { useLocale } from "@/contexts/LocaleContext";
import type {
  GroupedShowtimeCinema,
  ShowtimeDateOption,
} from "@/features/showtimes/types";
import {
  buildFallbackDateChips,
  toShowtimeDateChips,
} from "@/features/showtimes/utils";

const BADGE_COLOR: Record<string, string> = {
  IMAX: "bg-(--color-gold) text-(--color-bg)",
  STANDARD: "bg-(--color-border) text-(--color-text-secondary)",
  PREMIUM: "bg-(--color-gold) text-(--color-bg)",
  "DOLBY ATMOS": "bg-(--color-gold) text-(--color-bg)",
};

function badgeColor(badge: string): string {
  return BADGE_COLOR[badge] ?? "bg-(--color-border) text-(--color-text-secondary)";
}

interface ShowtimesProps {
  date: string;
  today: string;
  dates: ShowtimeDateOption[];
  cinemas: GroupedShowtimeCinema[];
  error: string | null;
}

export default function Showtimes({
  date,
  today,
  dates,
  cinemas,
  error,
}: ShowtimesProps) {
  const { selectedShowtime, setSelectedShowtime } = useMovieSelection();
  const { translate, locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const dateOptions = useMemo(
    () =>
      dates.length > 0
        ? toShowtimeDateChips(dates, locale)
        : buildFallbackDateChips(today, locale, DATE_STRIP_DAYS),
    [dates, today, locale],
  );

  // Cinema section's states
  const [showAll, setShowAll] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [maxH, setMaxH] = useState<string>("none");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedShowtime(null);
  }, [date, setSelectedShowtime]);

  const shouldShowAll = showAll || isCollapsing;
  const visibleCinemas = shouldShowAll
    ? cinemas
    : cinemas.slice(0, INITIAL_CINEMAS_VISIBLE);
  const hasMore = cinemas.length > INITIAL_CINEMAS_VISIBLE;

  useEffect(() => {
    if (!containerRef.current) return;

    if (isCollapsing) {
      const cards = containerRef.current.children;
      let collapsedHeight = 0;
      const count = Math.min(INITIAL_CINEMAS_VISIBLE, cards.length);

      for (let i = 0; i < count; i++) {
        const card = cards[i] as HTMLElement;
        collapsedHeight += card.getBoundingClientRect().height;
      }

      collapsedHeight += (count - 1) * 16;
      setMaxH(collapsedHeight + "px");
    } else setMaxH(containerRef.current.scrollHeight + "px");
  }, [showAll, isCollapsing, cinemas.length]);

  useEffect(() => {
    if (!isCollapsing) return;

    const timer = setTimeout(() => {
      setShowAll(false);
      setIsCollapsing(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [isCollapsing]);

  const toggleShowAll = () => {
    if (showAll) setIsCollapsing(true);
    else setShowAll(true);
  };

  const selectTime = (
    cinema: GroupedShowtimeCinema,
    showtimeId: string,
    time: string,
  ) => {
    const next =
      selectedShowtime?.showtimeId === showtimeId
        ? null
        : { cinemaId: cinema.id, showtimeId, time };

    setSelectedShowtime(next ? { ...next, date } : null);
  };

  const selectDate = (value: string) => {
    if (value === date) return;
    startTransition(() =>
      router.replace(`${pathname}?date=${value}`, { scroll: false }),
    );
  };

  const retry = () => {
    startTransition(() => router.refresh());
  };

  return (
    <section className="px-4">
      <SectionHeader variant="goldBar">
        {translate("movies.detail.showtimes")}
      </SectionHeader>

      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {dateOptions.map((option) => {
          const active = option.value === date;
          return (
            <button type="button"
              key={option.value}
              onClick={() => selectDate(option.value)}
              disabled={option.disabled}
              className={`
                shrink-0 flex flex-col items-center justify-center
                w-14 rounded-xl py-2 border transition-all duration-150
                ${
                  active
                    ? "bg-(--color-gold) border-(--color-gold) shadow-[0_0_12px_rgba(255,204,77,0.3)]"
                    : option.disabled
                      ? "bg-transparent border-(--color-border) opacity-40 cursor-not-allowed"
                      : "bg-(--color-surface) border-(--color-border) hover:border-(--color-gold)/40"
                }
              `}
              aria-pressed={active}
            >
              <span
                className={`text-[9px] font-bold tracking-widest ${
                  active
                    ? "text-(--color-bg)"
                    : option.disabled
                      ? "text-(--color-text-muted) line-through"
                      : "text-(--color-text-muted)"
                }`}
              >
                {option.label}
              </span>
              <span
                className={`text-xl font-extrabold leading-tight ${
                  active
                    ? "text-(--color-bg)"
                    : option.disabled
                      ? "text-(--color-text-muted)"
                      : "text-(--color-text-primary)"
                }`}
              >
                {option.day}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-4 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-(--color-text-muted)">
            {error || translate("common.error")}
          </p>
          <button type="button"
            onClick={retry}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border border-(--color-gold) text-(--color-gold) hover:bg-(--color-gold) hover:text-(--color-bg) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw size={14} /> {translate("common.try_again")}
          </button>
        </div>
      )}

      {!error && cinemas.length === 0 && (
        <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) px-4 py-8 text-center">
          <p className="text-sm text-(--color-text-muted)">
            {translate("movies.detail.no_showtimes")}
          </p>
        </div>
      )}

      {!error && cinemas.length > 0 && (
        <div
          ref={containerRef}
          style={{ maxHeight: maxH }}
          className={`animate-expand space-y-4 transition-opacity duration-200 ${
            isPending
              ? "opacity-40 pointer-events-none"
              : "opacity-100"
          }`}
          aria-busy={isPending}
        >
          {visibleCinemas.map((cinema, index) => (
            <div
              key={cinema.id}
              className="animate-fade-in rounded-2xl bg-(--color-surface) border border-(--color-border) p-4"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-(--color-text-primary) font-bold text-sm">
                    {cinema.name}
                  </p>
                  <p className="text-(--color-text-muted) text-xs mt-0.5">
                    {cinema.address}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-md ${badgeColor(cinema.badge)}`}
                >
                  {cinema.badge}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {cinema.showtimes.map((slot) => {
                  const active = selectedShowtime?.showtimeId === slot.id;
                  return (
                    <button type="button"
                      key={slot.id}
                      onClick={() =>
                        slot.isAvailable &&
                        selectTime(cinema, slot.id, slot.startTime)
                      }
                      disabled={!slot.isAvailable}
                      className={`
                        px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-150
                        ${
                          active
                            ? "bg-(--color-gold) border-(--color-gold) text-(--color-bg) shadow-[0_0_10px_rgba(255,204,77,0.25)]"
                            : !slot.isAvailable
                            ? "bg-transparent border-(--color-border) text-(--color-text-muted) line-through opacity-50 cursor-not-allowed"
                            : "bg-(--color-surface-2) border-(--color-border) text-(--color-text-primary) hover:border-(--color-gold)/40"
                        }
                      `}
                      aria-pressed={active}
                    >
                      {slot.startTime}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <button type="button"
          onClick={toggleShowAll}
          className="w-full mt-4 py-3 rounded-2xl border border-(--color-border) text-(--color-gold) font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-1 hover:bg-(--color-surface) transition-colors"
        >
          {showAll ? (
            <>
              {translate("movies.detail.show_less")} <ChevronUp size={16} />
            </>
          ) : (
            <>
              {translate("movies.detail.load_more_cinemas")}{" "}
              <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </section>
  );
}
