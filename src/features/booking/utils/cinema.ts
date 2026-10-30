import enMessages from "@/locales/en.json";
import vnMessages from "@/locales/vn.json";
import { toShowtimeDateChips } from "@/features/showtimes/utils";
import type { ShowtimeDateOption, ShowtimesResponse } from "@/features/showtimes/types";
/** Showtime `date` params are plain `YYYY-MM-DD` wall-clock days. */
export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

import type { Cinema, DateOption } from "@/features/showtimes/types";
import type { CinemaDraft } from "../types";

/** Locate a showtime (and its cinema) coming from a movie-detail deep link. */
function findShowtime(cinemas: Cinema[], showtimeId?: string | null) {
  if (!showtimeId) return null;

  for (const cinema of cinemas) {
    const showtime = cinema.showtimes.find((slot) => slot.id === showtimeId);
    if (showtime) {
      return { cinema, time: showtime.time, room: showtime.room };
    }
  }

  return null;
}

/**
 * Build the full cinema-slice payload for the booking draft. The slot is
 * matched by id first (deep links), then by time (click handler) — the same
 * rule both paths have always used.
 */
export function resolveSlotSelection(
  cinema: Cinema,
  time: string,
  date: string,
  showtimeId: string,
): CinemaDraft {
  const matchedShowtime = cinema.showtimes.find(
    (slot) => (showtimeId !== "" && slot.id === showtimeId) || slot.time === time,
  );

  return {
    cinemaId: cinema.id,
    cinemaName: cinema.name,
    time,
    date,
    room: matchedShowtime?.room ?? "",
    location: cinema.address,
    showtimeId: matchedShowtime?.id ?? showtimeId,
  };
}

/**
 * One-time URL adoption for the cinema step: URL params win over the saved
 * draft, and a URL date that differs drops the stale selection (the same rule
 * as clicking another date). Pure — called once from `CinemaAdopt`.
 */
export function resolveCinemaAdoption(input: {
  cinemas: Cinema[];
  dates: DateOption[];
  initialCinemaId: string | null;
  initialTime: string;
  initialDate: string;
  initialShowtimeId: string | null;
  draft: Pick<CinemaDraft, "cinemaId" | "time" | "date" | "showtimeId">;
}): CinemaDraft {
  const { cinemas, dates, initialCinemaId, initialTime, initialDate, initialShowtimeId, draft } =
    input;

  const preselected = findShowtime(cinemas, initialShowtimeId);
  const urlHasSelection = Boolean(preselected || initialCinemaId);
  const keepSavedSelection = initialDate === draft.date;
  const cinemaId =
    preselected?.cinema.id ?? initialCinemaId ?? (keepSavedSelection ? draft.cinemaId : null);
  const time = preselected?.time || initialTime || (keepSavedSelection ? draft.time : "");
  const showtimeId = (urlHasSelection ? initialShowtimeId : draft.showtimeId) || "";
  const date = initialDate || draft.date || dates[0]?.value || "";

  const cinema = cinemaId ? cinemas.find((entry) => entry.id === cinemaId) : undefined;
  if (!cinema || !time) {
    return {
      cinemaId: null,
      cinemaName: "",
      time: "",
      date,
      room: "",
      location: "",
      showtimeId: "",
    };
  }

  return resolveSlotSelection(cinema, time, date, showtimeId);
}

/**
 * The seats-step URL for a resolved cinema slice. Every booked slot travels in
 * the query so a cold entry (refresh, shared link, or a back/forward jump from
 * step 5) rebuilds the map and its showtime context without the draft.
 * Single source for both the mobile bottom bar and the desktop rail CTA.
 */
export function buildSeatsHref(
  movieSlug: string,
  selection: Pick<CinemaDraft, "showtimeId" | "cinemaId" | "time" | "date">,
): string {
  const query = new URLSearchParams();
  if (selection.showtimeId) query.set("showtimeId", selection.showtimeId);
  if (selection.cinemaId) query.set("cinema", selection.cinemaId);
  if (selection.time) query.set("time", selection.time);
  if (selection.date) query.set("date", selection.date);

  const search = query.toString();
  return `/booking/${movieSlug}/seats${search ? `?${search}` : ""}`;
}



/**
 * Backend date records → the booking step's chips. `dayOfWeek` arrives in the
 * request locale; today's chip shows the translated "today" word instead.
 */
export function toDateOptions(
  records: ShowtimeDateOption[],
  today: string,
  locale: "en" | "vn",
): DateOption[] {
  const todayWord = (locale === "vn" ? vnMessages : enMessages).common.today.toUpperCase();
  const byDate = new Map(records.map((record) => [record.date, record]));
  return toShowtimeDateChips(records, locale).map((chip) => ({
    value: chip.value,
    day: byDate.get(chip.value)?.day ?? Number(chip.day),
    month: chip.label,
    weekday: chip.value === today ? todayWord : (chip.weekday ?? ""),
  }));
}

/** Showtimes arrive already grouped by cinema — reshape them for the step's cards. */
export function toCinemas(groups: ShowtimesResponse["cinemas"]): Cinema[] {
  return groups.map((group) => ({
    id: group.id,
    name: group.name,
    address: group.address,
    badge: group.badge,
    badgeColor: "",
    showtimes: group.showtimes.map((slot) => ({
      id: slot.id,
      time: slot.startTime,
      room: slot.roomName,
      available: slot.isAvailable,
    })),
  }));
}
