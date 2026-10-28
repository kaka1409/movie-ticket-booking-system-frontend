import { cache } from "react";
import { settleApiResponse } from "@/libs/api";
import { getShowtimeDates, getShowtimes } from "./api";
import type { GroupedShowtimeCinema, ShowtimeDateOption } from "./types";

/** Everything a showtime block needs, for one resolved day. */
export interface MovieSchedule {
  dates: ShowtimeDateOption[];
  /** True when the dates API answered (even with zero days). */
  datesAvailable: boolean;
  date: string;
  cinemas: GroupedShowtimeCinema[];
  error: string | null;
}

/* Backend only returns the upcoming dates that actually have showtimes. */
function toAvailableDates(records: ShowtimeDateOption[]): string[] {
  return records.filter((record) => record.hasShowtimes).map((record) => record.date);
}

/**
 * Prefer the current day when it really has showtimes (from the API), otherwise
 * jump to the first available one.
 */
function resolveDate(availableDates: string[], today: string): string {
  if (availableDates.length === 0) return today;
  return availableDates.includes(today) ? today : availableDates[0];
}

/**
 * Dates + the slots of one day behind a single read.
 *
 * Every shopper of this data streams in its own boundary (movie detail: mobile
 * + desktop; booking cinema step: adoption, mobile list, desktop list), so the
 * memoized read is what keeps the page at one backend round trip. The date strip
 * and the opening day's slots are independent, so they go out together; a second
 * slot fetch runs only when the resolved day is neither `today` nor the deep
 * link's `requestedDate`.
 */
export const getMovieSchedule = cache(
  async (
    movieSlug: string,
    locale: "en" | "vn",
    today: string,
    requestedDate = "",
  ): Promise<MovieSchedule> => {
    const primaryDate = requestedDate || today;

    const [datesResult, primaryResult] = await Promise.all([
      settleApiResponse(getShowtimeDates(movieSlug, locale)),
      settleApiResponse(getShowtimes(movieSlug, primaryDate)),
    ]);

    const dates = "error" in datesResult ? [] : datesResult.data;
    const date = requestedDate || resolveDate(toAvailableDates(dates), today);

    const slotsResult =
      date === primaryDate ? primaryResult : await settleApiResponse(getShowtimes(movieSlug, date));

    return {
      dates,
      datesAvailable: !("error" in datesResult),
      date,
      cinemas: "error" in slotsResult ? [] : slotsResult.data.cinemas,
      error: "error" in slotsResult ? slotsResult.error.message : null,
    };
  },
);
