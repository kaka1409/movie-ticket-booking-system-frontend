"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarClock, ChevronDown, Popcorn, Users } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Badge from "@/components/ui/Badge";
import { getRoomDisplayName } from "@/libs/utils";
import type { AdminScheduleResult, AdminScheduleSlot } from "@/features/admin/types";

type SessionEntry = {
  slot: AdminScheduleSlot;
  roomId: string;
  roomName: string;
  roomNameVi: string | null;
  cinemaName: string;
};

/**
 * Cinema → room → showtime hierarchy for one wall-clock day. `movieFilter`
 * dims non-matching cards instead of hiding them, so the day layout stays
 * readable while one title is being traced across rooms. Cinema and room
 * sections collapse independently; the "N sessions" popover lists every slot
 * of a title that day, but only on the card that opened it.
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
    roomNameVi: string | null,
    cinemaName: string,
  ) => void;
}) {
  const { translate, locale } = useLocale();
  // `${roomId}:${slotId}` — unique per card, so only the clicked one opens.
  const [openMovieKey, setOpenMovieKey] = useState<string | null>(null);
  const [collapsedCinemas, setCollapsedCinemas] = useState<Set<string>>(new Set());
  const [collapsedRooms, setCollapsedRooms] = useState<Set<string>>(new Set());
  const popoverRef = useRef<HTMLDivElement>(null);

  const slotsByMovie = useMemo(() => {
    const map = new Map<string, SessionEntry[]>();
    for (const cinema of schedule.cinemas) {
      for (const room of cinema.rooms) {
        for (const slot of room.showtimes) {
          const list = map.get(slot.movie.slug) ?? [];
          list.push({
            slot,
            roomId: room.id,
            roomName: room.name,
            roomNameVi: room.nameVi,
            cinemaName: cinema.name,
          });
          map.set(slot.movie.slug, list);
        }
      }
    }
    return map;
  }, [schedule]);

  const toggleSetMember = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  // Only one sessions popover can be open at a time, so a single ref covers it.
  useEffect(() => {
    if (!openMovieKey) return;
    const onPointerDown = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpenMovieKey(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMovieKey(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMovieKey]);

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
      {schedule.cinemas.map((cinema) => {
        const cinemaCollapsed = collapsedCinemas.has(cinema.id);
        const cinemaSlotCount = cinema.rooms.reduce((sum, room) => sum + room.showtimes.length, 0);
        return (
          <section
            key={cinema.id}
            className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4"
          >
            <button
              type="button"
              onClick={() => setCollapsedCinemas((current) => toggleSetMember(current, cinema.id))}
              aria-expanded={!cinemaCollapsed}
              className="mb-3 flex w-full flex-wrap items-baseline justify-between gap-1 text-left"
            >
              <div>
                <h3 className="text-sm font-bold text-(--color-text-primary)">{cinema.name}</h3>
                <p className="text-[11px] text-(--color-text-muted)">
                  {cinema.address}
                  {cinema.badge ? ` · ${cinema.badge}` : ""}
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-muted)">
                {cinemaSlotCount}
                <ChevronDown
                  size={14}
                  aria-hidden
                  className={`transition-transform ${cinemaCollapsed ? "" : "rotate-180"}`}
                />
              </span>
            </button>

            {!cinemaCollapsed && (
              <div className="space-y-3">
                {cinema.rooms.map((room) => {
                  const roomCollapsed = collapsedRooms.has(room.id);
                  return (
                    <div
                      key={room.id}
                      className="rounded-xl border border-(--color-border) bg-(--color-surface-2) p-3"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setCollapsedRooms((current) => toggleSetMember(current, room.id))
                        }
                        aria-expanded={!roomCollapsed}
                        className="mb-2 flex w-full items-center justify-between text-[11px] font-bold tracking-wider text-(--color-text-muted) uppercase"
                      >
                        <span>
                          {translate("admin.showtimes.room_label")}{" "}
                          {getRoomDisplayName(room, locale)}
                        </span>
                        <span className="flex items-center gap-1.5 normal-case">
                          <Users size={11} aria-hidden />
                          {room.totalSeats}
                          <span className="text-[10px] font-semibold normal-case">
                            {room.showtimes.length}
                          </span>
                          <ChevronDown
                            size={12}
                            aria-hidden
                            className={`transition-transform ${roomCollapsed ? "" : "rotate-180"}`}
                          />
                        </span>
                      </button>

                      {!roomCollapsed && (
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                          {room.showtimes.map((slot) => {
                            const matches = movieFilter === "" || slot.movie.slug === movieFilter;
                            const movieKey = `${room.id}:${slot.id}`;
                            const isMovieOpen = openMovieKey === movieKey;
                            const movieSlots = slotsByMovie.get(slot.movie.slug) ?? [];
                            return (
                              <div key={slot.id} className="relative">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onSlotClick(
                                      slot,
                                      room.id,
                                      room.name,
                                      room.nameVi,
                                      cinema.name,
                                    )
                                  }
                                  className={`w-full rounded-xl border p-2.5 text-left transition hover:border-(--color-gold)/60 ${
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
                                  <div className="mt-1.5 flex items-center gap-2">
                                    {slot.movie.posterUrl ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={slot.movie.posterUrl}
                                        alt=""
                                        className="h-10 aspect-[3/2] shrink-0 rounded object-cover"
                                      />
                                    ) : (
                                      <span className="flex h-10 aspect-[3/2] shrink-0 items-center justify-center rounded bg-(--color-surface-2) text-(--color-text-muted)">
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

                                {/* Movie title shortcut: lists every slot of this
                                    title on the selected day. */}
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setOpenMovieKey(isMovieOpen ? null : movieKey);
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
                                  <div
                                    ref={popoverRef}
                                    className="absolute top-full left-0 z-30 mt-1 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card)"
                                  >
                                    <div className="border-b border-(--color-border) px-3.5 py-2.5">
                                      <p className="truncate text-sm font-bold text-(--color-text-primary)">
                                        {slot.movie.title}
                                      </p>
                                      <p className="text-2xs text-(--color-text-muted)">
                                        {schedule.date}
                                      </p>
                                    </div>
                                    <ul className="max-h-64 space-y-1 overflow-y-auto p-1.5 [scrollbar-width:thin]">
                                      {movieSlots.map(
                                        ({
                                          slot: other,
                                          roomId,
                                          roomName,
                                          roomNameVi,
                                          cinemaName: roomCinema,
                                        }) => (
                                          <li key={other.id}>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setOpenMovieKey(null);
                                                onSlotClick(
                                                  other,
                                                  roomId,
                                                  roomName,
                                                  roomNameVi,
                                                  roomCinema,
                                                );
                                              }}
                                              className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition hover:bg-(--color-surface-2)"
                                            >
                                              <span className="min-w-0">
                                                <span className="block text-sm font-bold tabular-nums text-(--color-text-primary)">
                                                  {other.startTime}–{other.endTime}
                                                </span>
                                                <span className="block truncate text-2xs text-(--color-text-muted)">
                                                  {roomCinema} ·{" "}
                                                  {getRoomDisplayName(
                                                    { name: roomName, nameVi: roomNameVi },
                                                    locale,
                                                  )}{" "}
                                                  · {other.format}
                                                </span>
                                              </span>
                                              <span className="shrink-0 text-2xs font-bold tabular-nums text-(--color-text-muted)">
                                                {other.bookedSeats + other.heldSeats}/
                                                {other.totalSeats}
                                              </span>
                                            </button>
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
