import { apiFetch, withLang, type ApiResponse } from "@/libs/api";
import type { ShowtimesResponse, ShowtimeDateOption, ShowtimeDetail } from "./types";

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
