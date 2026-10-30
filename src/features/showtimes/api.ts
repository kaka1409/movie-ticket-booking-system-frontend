import { cache } from "react";
import { apiFetch, settleApiResponse, withLang, type ApiResponse } from "@/libs/api";
import type {
  GroupedShowtimeCinema,
  ShowtimesResponse,
  ShowtimeDateOption,
  ShowtimeDetail,
} from "./types";
import { pickDefaultCinemaId } from "./utils";

/**
 * Slot lists stay uncached on purpose: `isAvailable` is live booking
 * availability.
 *
 * In-flight dedupe only (browser): the movie detail page can mount two
 * `ShowtimesProvider`s — the mobile list and the desktop rail — and both react
 * to the same `?date=` deep link or day switch. Sharing the pending request
 * keeps that at one backend call without ever serving a settled response, so
 * availability is still live.
 */
const inFlightShowtimes = new Map<string, Promise<ApiResponse<ShowtimesResponse>>>();

function fetchShowtimes(
  movieSlug: string,
  date: string,
  cinemaId?: string,
): Promise<ApiResponse<ShowtimesResponse>> {
  const query = new URLSearchParams({
    movieSlug,
    date,
  });
  if (cinemaId) {
    query.set("cinemaId", cinemaId);
  }

  // No `?lang=`: slot lists carry no localizable content (canonical titles,
  // proper nouns, times) — only `/showtimes/dates` localizes `dayOfWeek`.
  return apiFetch<ShowtimesResponse>(`/showtimes?${query.toString()}`);
}

export function getShowtimes(
  movieSlug: string,
  date: string,
  cinemaId?: string,
): Promise<ApiResponse<ShowtimesResponse>> {
  if (typeof window === "undefined") return fetchShowtimes(movieSlug, date, cinemaId);

  const key = `${movieSlug}|${date}|${cinemaId ?? ""}`;
  const pendingRequest = inFlightShowtimes.get(key);
  if (pendingRequest) return pendingRequest;

  const request = fetchShowtimes(movieSlug, date, cinemaId).finally(() =>
    inFlightShowtimes.delete(key),
  );
  inFlightShowtimes.set(key, request);
  return request;
}

/** Date options come from the published schedule — safe to serve for 60s. */
export function getShowtimeDates(
  movieSlug: string,
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<ShowtimeDateOption[]>> {
  return apiFetch<ShowtimeDateOption[]>(
    withLang(`/showtimes/dates?movieSlug=${encodeURIComponent(movieSlug)}`, locale),
    { next: { revalidate: 60 } },
  );
}

export function getShowtimeById(id: string): Promise<ApiResponse<ShowtimeDetail>> {
  return apiFetch<ShowtimeDetail>(`/showtimes/${encodeURIComponent(id)}`);
}

/** Data needed by a movie schedule block for one resolved date. */
export interface MovieSchedule {
  dates: ShowtimeDateOption[];
  /** True when the dates API answered, even with zero days. */
  datesAvailable: boolean;
  date: string;
  cinemas: GroupedShowtimeCinema[];
  error: string | null;
}

function toAvailableDates(records: ShowtimeDateOption[]): string[] {
  return records.filter((record) => record.hasShowtimes).map((record) => record.date);
}

function resolveDate(availableDates: string[], today: string): string {
  if (availableDates.length === 0) return today;
  return availableDates.includes(today) ? today : availableDates[0];
}

/** Cached dates + slots query shared by the booking and movie-detail pages. */
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
      date === primaryDate
        ? primaryResult
        : await settleApiResponse(getShowtimes(movieSlug, date));

    return {
      dates,
      datesAvailable: !("error" in datesResult),
      date,
      cinemas: "error" in slotsResult ? [] : slotsResult.data.cinemas,
      error: "error" in slotsResult ? slotsResult.error.message : null,
    };
  },
);

/** First-render seed for the home quick-booking widgets. */
export interface QuickBookingSeed {
  locale: "en" | "vn";
  movieSlug: string;
  dates: ShowtimeDateOption[] | null;
  activeDate: string;
  cinemas: GroupedShowtimeCinema[] | null;
  selectedCinemaId: string;
}

export const getQuickBookingSeed = cache(
  async (movieSlug: string, locale: "en" | "vn"): Promise<QuickBookingSeed> => {
    const datesResult = await settleApiResponse(getShowtimeDates(movieSlug, locale));
    const dates = "error" in datesResult ? null : datesResult.data;
    const activeDate = dates?.find((option) => option.hasShowtimes)?.date ?? "";

    if (!activeDate) {
      return { locale, movieSlug, dates, activeDate, cinemas: null, selectedCinemaId: "" };
    }

    const slotsResult = await settleApiResponse(getShowtimes(movieSlug, activeDate));
    const cinemas = "error" in slotsResult ? null : slotsResult.data.cinemas;
    return {
      locale,
      movieSlug,
      dates,
      activeDate,
      cinemas,
      selectedCinemaId: cinemas ? pickDefaultCinemaId(cinemas) : "",
    };
  },
);
