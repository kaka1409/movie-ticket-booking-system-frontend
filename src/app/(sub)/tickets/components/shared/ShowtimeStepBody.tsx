"use client";

import type { ReactNode } from "react";
import { CalendarX2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { Skeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";

/**
 * Render gate for the modify showtime step: skeletons while the adopter fetches,
 * the "no eligible showtimes"/failure lines with a retry, otherwise the caller's
 * pickers. Both device skins wrap it with their own spacing.
 */
export default function ShowtimeStepBody({ children }: { children: ReactNode }) {
  const { translate } = useLocale();
  const { showtimesStatus, retryShowtimes } = useModification();

  if (showtimesStatus === "loading") {
    return (
      <div className="py-8 text-center text-(--color-text-muted)">
        <Skeleton className="mx-auto mb-3 h-4 w-48" />
        <Skeleton className="mb-3 h-12 w-full" />
        <Skeleton className="mb-2 h-20 w-full" />
        <Skeleton className="mb-2 h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (showtimesStatus === "error") {
    return (
      <div className="py-8 text-center text-(--color-text-muted)">
        <p className="mb-3 text-sm text-red-400">{translate("error.title")}</p>
        <Button variant="outline" onClick={retryShowtimes}>
          {translate("error.try_again")}
        </Button>
      </div>
    );
  }

  if (showtimesStatus === "empty") {
    return (
      <div className="py-10 text-center text-(--color-text-muted)">
        <CalendarX2 className="mx-auto mb-3 h-8 w-8" aria-hidden="true" />
        <p className="mb-3 text-sm">{translate("tickets.modify.showtime.no_showtimes")}</p>
        <Button variant="outline" onClick={retryShowtimes}>
          {translate("error.try_again")}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
