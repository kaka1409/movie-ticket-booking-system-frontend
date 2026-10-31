"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { todayInCinemaZone } from "@/libs/date";
import type { Movie } from "@/features/movies/types";
import { getShowtimeDates, getShowtimes } from "../api";
import { pickDefaultCinemaId, toShowtimeDateChips, type ShowtimeDateChip } from "../utils";
import type { QuickBookingSeed } from "../api";
import type { GroupedShowtimeCinema, ShowtimeDateOption, ShowtimeSlot } from "../types";

export interface QuickBookingController {
  today: string;
  effectiveMovieSlug: string;
  selectMovie: (slug: string) => void;
  shownDates: ShowtimeDateOption[] | null;
  dateChips: ShowtimeDateChip[];
  activeDate: string;
  selectDate: (date: string) => void;
  datesFailed: boolean;
  shownCinemas: GroupedShowtimeCinema[] | null;
  selectedCinemaId: string;
  selectCinema: (cinemaId: string) => void;
  slots: ShowtimeSlot[];
  selectedSlotId: string;
  selectSlot: (slotId: string) => void;
  slotsFailed: boolean;
  retry: () => void;
  canBook: boolean;
}

/**
 * Dates → cinemas → slots for the home quick-booking widgets. Everything is
 * live: dates come from `GET /showtimes/dates` for the picked movie, slots from
 * `GET /showtimes?movieSlug&date`.
 *
 * Each fetched list is stored with the request key it answers (movie+locale /
 * movie+date), so a slow response can never overwrite a newer one and there is
 * no need for a reset effect. Mount this ONCE per page — both device trees
 * render, so a per-skin instance doubles every request.
 */
export function useQuickBooking({
  movies,
  seed,
}: {
  movies: Movie[];
  seed?: QuickBookingSeed | null;
}): QuickBookingController {
  const { locale } = useLocale();
  // Chips carry the cinema's calendar day, not the viewer's device day.
  const today = useMemo(() => todayInCinemaZone(), []);

  // Prefetch is locale-bound: ignore a seed that answers a different locale.
  const effectiveSeed = seed?.locale === locale ? seed : null;

  const [selectedMovieSlug, setSelectedMovieSlug] = useState("");
  const [datesFailedKey, setDatesFailedKey] = useState<string | null>(null);
  const [slotsFailedKey, setSlotsFailedKey] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);

  // A previously picked slug that left the list falls back to the first movie.
  const effectiveMovieSlug =
    selectedMovieSlug && movies.some((movie) => movie.slug === selectedMovieSlug)
      ? selectedMovieSlug
      : (movies[0]?.slug ?? "");

  const initialDatesKey = `${effectiveMovieSlug}|${locale}|0`;
  const initialSlotsKey = `${effectiveMovieSlug}|${effectiveSeed?.activeDate ?? ""}|0`;

  const [datesState, setDatesState] = useState<{ key: string; data: ShowtimeDateOption[] } | null>(
    effectiveSeed?.dates ? { key: initialDatesKey, data: effectiveSeed.dates } : null,
  );
  const [dateSelection, setDateSelection] = useState<{ key: string; value: string } | null>(
    effectiveSeed?.dates ? { key: initialDatesKey, value: effectiveSeed.activeDate } : null,
  );
  const [slotsState, setSlotsState] = useState<{
    key: string;
    data: GroupedShowtimeCinema[];
  } | null>(effectiveSeed?.cinemas ? { key: initialSlotsKey, data: effectiveSeed.cinemas } : null);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>(
    effectiveSeed?.selectedCinemaId ?? "",
  );

  const datesKey = `${effectiveMovieSlug}|${locale}|${retryNonce}`;
  const shownDates = datesState && datesState.key === datesKey ? datesState.data : null;
  const datesFailed = datesFailedKey === datesKey;
  const activeDate = dateSelection && dateSelection.key === datesKey ? dateSelection.value : "";

  const slotsKey = `${effectiveMovieSlug}|${activeDate}|${retryNonce}`;
  const shownCinemas = slotsState && slotsState.key === slotsKey ? slotsState.data : null;
  const slotsFailed = slotsFailedKey === slotsKey;

  // Dates follow the movie (and the UI language for weekday labels).
  useEffect(() => {
    if (!effectiveMovieSlug) return;
    if (shownDates || datesFailed) return;
    let cancelled = false;

    void (async () => {
      const result = await getShowtimeDates(effectiveMovieSlug, locale);
      if (cancelled) return;
      if ("error" in result) {
        setDatesFailedKey(datesKey);
        return;
      }
      setDatesState({ key: datesKey, data: result.data });
      // Functional update (no dateSelection dep → no refetch loop): keep the
      // picked day when it still shows, otherwise fall back to the first one.
      setDateSelection((previous) => {
        const first = result.data.find((option) => option.hasShowtimes) ?? result.data[0];
        const nextValue =
          previous &&
          result.data.some((option) => option.date === previous.value && option.hasShowtimes)
            ? previous.value
            : (first?.date ?? "");
        if (!nextValue || (previous && previous.key === datesKey && previous.value === nextValue))
          return previous;
        return { key: datesKey, value: nextValue };
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [datesKey, effectiveMovieSlug, locale, shownDates, datesFailed]);

  // Cinemas follow the date; the list is whatever plays that day.
  useEffect(() => {
    if (!effectiveMovieSlug || !activeDate) return;
    if (shownCinemas || slotsFailed) return;
    let cancelled = false;

    void (async () => {
      const result = await getShowtimes(effectiveMovieSlug, activeDate);
      if (cancelled) return;
      if ("error" in result) {
        setSlotsFailedKey(slotsKey);
        return;
      }
      const list = result.data.cinemas;
      setSlotsState({ key: slotsKey, data: list });
      setSelectedCinemaId((previous) => {
        if (previous && list.some((cinema) => cinema.id === previous)) return previous;
        return pickDefaultCinemaId(list);
      });
      setSelectedSlotId((previous) =>
        previous &&
        list.some((cinema) =>
          cinema.showtimes.some((slot) => slot.id === previous && slot.isAvailable),
        )
          ? previous
          : "",
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [slotsKey, effectiveMovieSlug, activeDate, shownCinemas, slotsFailed]);

  const dateChips = useMemo(
    () => (shownDates ? toShowtimeDateChips(shownDates, locale) : []),
    [shownDates, locale],
  );
  const selectedCinema = useMemo(
    () => shownCinemas?.find((cinema) => cinema.id === selectedCinemaId),
    [shownCinemas, selectedCinemaId],
  );
  const slots = selectedCinema?.showtimes ?? [];
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);
  const canBook = !!effectiveMovieSlug && !!selectedSlot && selectedSlot.isAvailable;

  const selectMovie = useCallback((slug: string) => {
    setSelectedMovieSlug(slug);
    // The old cinema/slot belong to the previous movie's showtime list.
    setSelectedCinemaId("");
    setSelectedSlotId("");
  }, []);

  const selectCinema = useCallback((cinemaId: string) => {
    setSelectedCinemaId(cinemaId);
    setSelectedSlotId("");
  }, []);

  const selectSlot = useCallback((slotId: string) => {
    setSelectedSlotId(slotId);
  }, []);

  const retry = useCallback(() => setRetryNonce((nonce) => nonce + 1), []);

  return {
    today,
    effectiveMovieSlug,
    selectMovie,
    shownDates,
    dateChips,
    activeDate,
    selectDate: (date) => {
      setDateSelection({ key: datesKey, value: date });
      setSelectedSlotId("");
    },
    datesFailed,
    shownCinemas,
    selectedCinemaId,
    selectCinema,
    slots,
    selectedSlotId,
    selectSlot,
    slotsFailed,
    retry,
    canBook,
  };
}
