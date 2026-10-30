"use client";

import { useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { getEligibleShowtimes } from "@/features/tickets/api";
import { toEligibleDateOptions } from "@/features/tickets/adapters/index";

/**
 * Effect-only mount helper for the modify showtime step (renders nothing): the
 * eligible slots and the date strip derived from them are adopted into the draft
 * once. Mounted at PAGE level — both device trees render, so a per-branch mount
 * would run the request twice.
 *
 * The draft survives step navigation, so only a first visit (or a retry) fetches.
 * An empty list is recorded as `empty`, never as a pending load.
 */
export default function EligibleShowtimesAdopter({ ticketId }: { ticketId: string }) {
  const {
    showtimes,
    setShowtimes,
    setDates,
    setSelectedDate,
    setShowtimesStatus,
    showtimesRetryToken,
  } = useModification();
  const { locale } = useLocale();

  useEffect(() => {
    if (showtimes.length > 0) return;

    let cancelled = false;
    setShowtimesStatus("loading");

    getEligibleShowtimes(ticketId, locale)
      .then((result) => {
        if (cancelled) return;
        if ("error" in result) {
          setShowtimesStatus("error");
          return;
        }
        setShowtimes(result.data);
        // The date strip is derived from the eligible list — one fetch, no second API.
        const dateOptions = toEligibleDateOptions(result.data, locale);
        setDates(dateOptions);
        setSelectedDate(dateOptions[0]?.value ?? "");
        setShowtimesStatus(result.data.length > 0 ? "ready" : "empty");
      })
      .catch((error: unknown) => {
        // Without this, a rejected promise leaves the skeleton up forever.
        console.warn("Loading eligible showtimes failed:", error);
        if (!cancelled) setShowtimesStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [
    ticketId,
    showtimes.length,
    setShowtimes,
    setDates,
    setSelectedDate,
    setShowtimesStatus,
    locale,
    showtimesRetryToken,
  ]);

  return null;
}
