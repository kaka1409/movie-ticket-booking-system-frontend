"use client";

import { useMemo, useState } from "react";
import { CalendarClock, ChevronDown, Popcorn, Users } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Badge from "@/components/ui/Badge";
import type { AdminScheduleResult, AdminScheduleSlot } from "@/features/admin/types";

/**
 * Cinema → room → showtime hierarchy for one wall-clock day. `movieFilter`
 * dims non-matching cards instead of hiding them, so the day layout stays
 * readable while one title is being traced across rooms.
 */
export default function ScheduleHierarchy({
  schedule,
  movieFilter,
  onSlotClick,
}: {
  schedule: AdminScheduleResult;
  movieFilter: string;
  onSlotClick: (
    slot: AdminScheduleSlot,
    roomId: string,
    roomName: string,
    cinemaName: string,
  ) => void;
}) {
  const { translate } = useLocale();
  const [openMovieSlug, setOpenMovieSlug] = useState<string | null>(null);

  const slotsByMovie = useMemo(() => {
    const map = new Map<
      string,
      { slot: AdminScheduleSlot; roomId: string; roomName: string; cinemaName: string }[]
    >();
    for (const cinema of schedule.cinemas) {
      for (const room of cinema.rooms) {
        for (const slot of room.showtimes) {
          const list = map.get(slot.movie.slug) ?? [];
          list.push({ slot, roomId: room.id, roomName: room.name, cinemaName: cinema.name });
          map.set(slot.movie.slug, list);
        }
      }
    }
    return map;
  }, [schedule]);

  const totalSlots = schedule.cinemas.reduce(
    (sum, cinema) => sum + cinema.rooms.reduce((acc, room) => acc + room.showtimes.length, 0),
    0,
  );

  if (totalSlots === 0) {
    return (
      <div className="py-10 text-center">
        <CalendarClock size={28} className="mx-auto mb-2 text-(--color-text-muted)" />
        <p className="text-sm font-bold text-(--color-text-primary)">
          {translate("admin.showtimes.empty_title")}
        </p>
        <p className="mt-1 text-[12px] text-(--color-text-muted)">
          {translate("admin.showtimes.empty_body")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedule.cinemas.map((cinema) => (
        <section
          key={cinema.id}
          className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4"
        >
          <header className="mb-3 flex flex-wrap items-baseline justify-between gap-1">
            <div>
              <h3 className="text-sm font-bold text-(--color-text-primary)">{cinema.name}</h3>
              <p className="text-[11px] text-(--color-text-muted)">
                {cinema.address}
                {cinema.badge ? ` · ${cinema.badge}` : ""}
              </p>
            </div>
          </header>

          <div className="space-y-3">
            {cinema.rooms.map((room) => (
              <div
                key={room.id}
                className="rounded-xl border border-(--color-border) bg-(--color-surface-2) p-3"
              >
                <div className="mb-2 flex items-center justify-between text-[11px] font-bold tracking-wider text-(--color-text-muted) uppercase">
                  <span>
                    {translate("admin.showtimes.room_label")} {room.name}
                  </span>
                  <span className="flex items-center gap-1 normal-case">
                    <Users size={11} aria-hidden />
                    {room.totalSeats}
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {room.showtimes.map((slot) => {
                    const matches =
                      movieFilter === "" || slot.movie.slug === movieFilter;
                    const isMovieOpen = openMovieSlug === slot.movie.slug;
                    const movieSlots = slotsByMovie.get(slot.movie.slug) ?? [];
                    return (
                      <div key={slot.id} className="relative">
                        <button
                          type="button"
                          onClick={() => onSlotClick(slot, room.id, room.name, cinema.name)}
                          className={`w-full rounded-xl border p-3 text-left transition hover:border-(--color-gold)/60 ${
                            slot.isPast
                              ? "border-(--color-border) bg-(--color-surface) opacity-50"
                              : "border-(--color-border) bg-(--color-bg)"
                          } ${matches ? "" : "opacity-40"}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold tabular-nums text-(--color-text-primary)">
                              {slot.startTime}–{slot.endTime}
                            </span>
                            <Badge variant="neutral" size="xs">
                              {slot.format}
                            </Badge>
                          </div>
                          <div className="mt-1.5 flex items-start gap-2">
                            {slot.movie.posterUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={slot.movie.posterUrl}
                                alt=""
                                className="h-10 w-7 shrink-0 rounded object-cover"
                              />
                            ) : (
                              <span className="flex h-10 w-7 shrink-0 items-center justify-center rounded bg-(--color-surface-2) text-(--color-text-muted)">
                                <Popcorn size={12} aria-hidden />
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[12px] font-bold text-(--color-text-primary)">
                                {slot.movie.title}
                              </p>
                              <p className="text-[10px] text-(--color-text-muted)">
                                {slot.movie.ageRating ?? "—"}
                                {slot.movie.duration ? ` · ${slot.movie.duration}m` : ""}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[10px]">
                            <span className="font-bold tabular-nums text-(--color-text-muted)">
                              {slot.bookedSeats + slot.heldSeats}/{slot.totalSeats}
                            </span>
                            {slot.isPast && (
                              <Badge variant="neutral" size="xs">
                                {translate("admin.showtimes.past_badge")}
                              </Badge>
                            )}
                          </div>
                        </button>

                        {/* Movie title shortcut: lists every slot of this title
                            on the selected day — the old board's use case. */}
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setOpenMovieSlug(isMovieOpen ? null : slot.movie.slug);
                          }}
                          className="mt-1 text-[10px] font-bold text-(--color-gold) underline-offset-2 hover:underline"
                        >
                          {movieSlots.length} {translate("admin.showtimes.sessions_label")}
                          <ChevronDown
                            size={10}
                            aria-hidden
                            className={`ml-0.5 inline ${isMovieOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {isMovieOpen && (
                          <div className="absolute top-full right-0 z-20 mt-1 w-64 rounded-xl border border-(--color-border) bg-(--color-surface) p-2 shadow-xl">
                            <p className="mb-1 px-1 text-[10px] font-bold tracking-wider text-(--color-text-muted) uppercase">
                              {slot.movie.title}
                            </p>
                            <div className="max-h-56 space-y-1 overflow-y-auto">
                              {movieSlots.map(({ slot: other, roomId, roomName, cinemaName }) => (
                                <button
                                  key={other.id}
                                  type="button"
                                  onClick={() => {
                                    setOpenMovieSlug(null);
                                    onSlotClick(other, roomId, roomName, cinemaName);
                                  }}
                                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[11px] hover:bg-(--color-surface-2)"
                                >
                                  <span className="font-bold tabular-nums">
                                    {other.startTime}
                                  </span>
                                  <span className="truncate text-(--color-text-muted)">
                                    {cinemaName} · {roomName}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
