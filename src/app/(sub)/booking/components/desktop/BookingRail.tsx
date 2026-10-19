"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import type { ReactNode } from "react";
import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import MicroLabel from "@/components/ui/MicroLabel";

/**
 * The desktop booking summary rail — the single summary surface on every
 * booking step. The movie identity lives here (desktop has no separate poster
 * card), followed by the step's own selection block and its CTA.
 *
 * Purely presentational: it reads the adopted movie snapshot from the draft and
 * renders whatever the step hands it, so both the summary and the CTA stay
 * with the step that knows the rules.
 */
export default function BookingRail({
  summary,
  action,
  errorText,
}: {
  /** Step-specific selection block rendered under the movie identity. */
  summary?: ReactNode;
  /** The step's CTA — a link or a handler-derived button. */
  action: ReactNode;
  /** Inline failure line under the CTA. */
  errorText?: string | null;
}) {
  const { movie } = useBooking();
  const { translate } = useLocale();

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-2) p-5">
        <MicroLabel className="text-(--color-gold)">
          {translate("booking.common.ticket_details")}
        </MicroLabel>

        {movie && (
          <div className="mt-4 flex gap-4">
            <div
              className="relative w-20 shrink-0 overflow-hidden rounded-md bg-(--color-surface-2)"
              style={{ aspectRatio: "2/3" }}
            >
              {movie.src ? (
                <Image
                  src={movie.src}
                  alt={movie.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center px-1.5 text-[9px] leading-tight font-black tracking-tight uppercase text-(--color-text-muted)">
                  {movie.title}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-base leading-snug font-bold text-(--color-text-primary)">
                {movie.title}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-(--color-text-muted)">
                <Clock size={11} />
                {movie.duration} {translate("booking.min")}
                {movie.genre && (
                  <>
                    <span>•</span>
                    {movie.genre}
                  </>
                )}
              </p>
              {movie.ageRating && (
                <span className="mt-2 inline-block rounded-md border border-(--color-border) bg-(--color-surface-2) px-2.5 py-0.5 text-[10px] font-bold text-(--color-text-secondary)">
                  {movie.ageRating}
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
