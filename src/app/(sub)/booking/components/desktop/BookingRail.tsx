"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import type { ReactNode } from "react";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import MicroLabel from "@/components/ui/MicroLabel";
import type { Movie } from "@/features/movies/types";

/**
 * The desktop booking summary rail — the single summary surface on every
 * booking step. The movie identity lives here (desktop has no separate poster
 * card), followed by the step's own selection block and its CTA.
 *
 * Purely presentational: it reads the adopted movie snapshot from the draft and
 * renders whatever the step hands it, so both the summary and the CTA stay
 * with the step that knows the rules. A step that already fetched the movie
 * passes it in — the identity then paints before the adoption effect runs.
 */
export default function BookingRail({
  summary,
  action,
  errorText,
  movie,
}: {
  /** Step-specific selection block rendered under the movie identity. */
  summary?: ReactNode;
  /** The step's CTA — a link or a handler-derived button. */
  action: ReactNode;
  /** Inline failure line under the CTA. */
  errorText?: string | null;
  /** Movie the step itself holds; falls back to the draft snapshot. */
  movie?: Movie;
}) {
  const { movie: draftMovie } = useBooking();
  const { translate } = useLocale();
  const movieSnapshot = movie ?? draftMovie;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-2) p-5">
        <MicroLabel className="text-(--color-gold)">
          {translate("booking.common.ticket_details")}
        </MicroLabel>

        {movieSnapshot && (
          <div className="mt-4 flex gap-4">
            <div
              className="relative w-20 shrink-0 overflow-hidden rounded-md bg-(--color-surface-2)"
              style={{ aspectRatio: "2/3" }}
            >
              {movieSnapshot.src ? (
                <Image
                  src={movieSnapshot.src}
                  alt={movieSnapshot.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center px-1.5 text-3xs leading-tight font-black tracking-tight uppercase text-(--color-text-muted)">
                  {movieSnapshot.title}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-base leading-snug font-bold text-(--color-text-primary)">
                {movieSnapshot.title}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-(--color-text-muted)">
                <Clock size={11} />
                {movieSnapshot.duration} {translate("booking.min")}
                {movieSnapshot.genre && (
                  <>
                    <span>•</span>
                    {movieSnapshot.genre}
                  </>
                )}
              </p>
              {movieSnapshot.ageRating && (
                <span className="mt-2 inline-block rounded-md border border-(--color-border) bg-(--color-surface-2) px-2.5 py-0.5 text-2xs font-bold text-(--color-text-secondary)">
                  {movieSnapshot.ageRating}
                </span>
              )}
            </div>
          </div>
        )}

        {summary && (
          <div className="mt-5 space-y-4 border-t border-(--color-border) pt-5">{summary}</div>
        )}

        <div className="mt-5">{action}</div>

        {errorText && (
          <p className="mt-3 text-xs leading-relaxed font-medium text-red-400">{errorText}</p>
        )}
      </div>
    </aside>
  );
}
