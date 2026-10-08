import type { Cinema, CinemaDraft, DateOption } from "../types";

/** Locate a showtime (and its cinema) coming from a movie-detail deep link. */
export function findShowtime(cinemas: Cinema[], showtimeId?: string | null) {
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
