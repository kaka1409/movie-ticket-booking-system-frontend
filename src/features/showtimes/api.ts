import { apiFetch, type ApiResponse } from "@/libs/api";
import type { ShowtimesResponse, ShowtimeDateOption, ShowtimeDetail } from "./types";

/**
 * Slot lists stay uncached on purpose: `isAvailable` is live booking
 * availability. The movie detail page caches its rendered HTML at the page
 * level (ISR) instead — see `app/(blank)/movies/[slug]/page.tsx`.
 */
export function getShowtimes(
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

  return apiFetch<ShowtimesResponse>(`/showtimes?${query.toString()}`);
}

/** Date options come from the published schedule — safe to serve for 60s. */
export function getShowtimeDates(movieSlug: string): Promise<ApiResponse<ShowtimeDateOption[]>> {
  return apiFetch<ShowtimeDateOption[]>(
    `/showtimes/dates?movieSlug=${encodeURIComponent(movieSlug)}`,
    { next: { revalidate: 60 } },
  );
}

export function getShowtimeById(id: string): Promise<ApiResponse<ShowtimeDetail>> {
  return apiFetch<ShowtimeDetail>(`/showtimes/${encodeURIComponent(id)}`);
}
