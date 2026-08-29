"use client";

import { useEffect } from "react";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { getEligibleShowtimes } from "@/features/tickets/api";
import { getDates } from "@/features/booking/api";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ShowtimeDataLoader({
  ticketId,
  children,
}: {
  ticketId: string;
  children: React.ReactNode;
}) {
  const { showtimes, setShowtimes, dates, setDates, setSelectedDate } =
    useModification();

  useEffect(() => {
    if (showtimes.length > 0 && dates.length > 0) return;

    Promise.all([
      showtimes.length > 0 ? showtimes : getEligibleShowtimes(ticketId),
      dates.length > 0 ? dates : getDates(),
    ]).then(([showtimesData, datesData]) => {
      if (showtimes.length === 0) setShowtimes(showtimesData);
      if (dates.length === 0) {
        setDates(datesData);
        setSelectedDate(datesData[0]?.value ?? "");
      }
    });
  }, [
    ticketId,
    showtimes.length,
    dates.length,
    setShowtimes,
    setDates,
    setSelectedDate,
    showtimes,
    dates,
  ]);

  if (showtimes.length === 0 || dates.length === 0) {
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
