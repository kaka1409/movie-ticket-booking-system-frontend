"use client";

import { useEffect, useState } from "react";
import { CalendarX2 } from "lucide-react";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { getEligibleShowtimes } from "@/features/tickets/api";
import { toEligibleDateOptions } from "@/features/tickets/adapters";
import { Skeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { useLocale } from "@/contexts/LocaleContext";

/** An empty result is a real answer, not a pending one — only `loading` shows skeletons. */
type LoadStatus = "loading" | "ready" | "empty" | "error";

export default function ShowtimeDataLoader({
  ticketId,
  children,
}: {
  ticketId: string;
  children: React.ReactNode;
}) {
  const { showtimes, setShowtimes, setDates, setSelectedDate } = useModification();
  const { translate, locale } = useLocale();
  const [status, setStatus] = useState<LoadStatus>(showtimes.length > 0 ? "ready" : "loading");
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    // The draft survives step navigation; only the first visit fetches.
    if (showtimes.length > 0) return;

    let cancelled = false;
    getEligibleShowtimes(ticketId, locale)
      .then((result) => {
        if (cancelled) return;
        if ("error" in result) {
          setStatus("error");
          return;
        }
        setShowtimes(result.data);
        // The date strip is derived from the eligible list — one fetch, no second API.
        const dateOptions = toEligibleDateOptions(result.data, locale);
        setDates(dateOptions);
        setSelectedDate(dateOptions[0]?.value ?? "");
        setStatus(result.data.length > 0 ? "ready" : "empty");
      })
      .catch((error: unknown) => {
        // Without this, a rejected promise leaves the skeleton up forever.
        console.warn("Loading eligible showtimes failed:", error);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [ticketId, showtimes.length, setShowtimes, setDates, setSelectedDate, locale, retryNonce]);

  const handleRetry = () => {
    setStatus("loading");
    setRetryNonce((nonce) => nonce + 1);
  };

  if (status === "error") {
    return (
      <div className="py-8 text-center text-(--color-text-muted)">
        <p className="text-sm text-red-400 mb-3">{translate("error.title")}</p>
        <Button variant="outline" onClick={handleRetry}>
          {translate("error.try_again")}
        </Button>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="py-10 text-center text-(--color-text-muted)">
        <CalendarX2 className="mx-auto mb-3 h-8 w-8" aria-hidden="true" />
        <p className="text-sm mb-3">{translate("tickets.modify.showtime.no_showtimes")}</p>
        <Button variant="outline" onClick={handleRetry}>
          {translate("error.try_again")}
        </Button>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="py-8 text-center text-(--color-text-muted)">
        <Skeleton className="h-4 w-48 mx-auto mb-3" />
        <Skeleton className="h-12 w-full mb-3" />
        <Skeleton className="h-20 w-full mb-2" />
        <Skeleton className="h-20 w-full mb-2" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
