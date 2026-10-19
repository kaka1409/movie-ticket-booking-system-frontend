"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import { BOOKING_STEP_KEYS } from "@/features/booking/types";
import { buildSeatsHref } from "@/features/booking/utils/cinema";

/**
 * Desktop booking stepper. Only the steps already behind the user are links —
 * the draft is still intact there, so re-entering an earlier step is safe.
 * The current and future steps are inert: forward movement goes through the
 * rail CTA, which is the only place that knows whether a step is complete.
 *
 * Tablet (740–1023) shows numbers + connectors only; `lg:` reveals the labels.
 */
export default function StepRail({ current }: { current: number }) {
  const params = useParams();
  const slug = params.slug as string;
  const { showtimeId, cinemaId, time, date } = useBooking();
  const { translate } = useLocale();

  /** Backward-only href for a step — `null` for the current/upcoming ones. */
  const hrefFor = (step: number): string | null => {
    if (step >= current) return null;
    if (step === 1) return `/booking/${slug}/cinema`;
    if (step === 2) return buildSeatsHref(slug, { showtimeId, cinemaId, time, date });
    if (step === 3) return `/booking/${slug}/snack`;
    if (step === 4) return `/booking/${slug}/credentials`;
    return null;
  };

  return (
    <nav>
      <ol className="flex w-full items-center">
        {BOOKING_STEP_KEYS.map((key, index) => {
          const step = index + 1;
          const isDone = step < current;
          const isCurrent = step === current;
          const href = hrefFor(step);

          const badgeClass = isDone
            ? "border-(--color-gold) bg-(--color-gold) text-(--color-bg)"
            : isCurrent
              ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
              : "border-(--color-border) text-(--color-text-muted)";

          const body = (
            <>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold transition-colors duration-200 ${badgeClass}`}
              >
                {isDone ? <Check size={14} /> : step}
              </span>
              <span
                className={`hidden text-[10px] font-bold tracking-widest uppercase lg:inline ${
                  isDone || isCurrent ? "text-(--color-gold)" : "text-(--color-text-muted)"
                }`}
              >
                {translate(key)}
              </span>
            </>
          );

          return (
            <li
              key={key}
              aria-current={isCurrent ? "step" : undefined}
              className="flex flex-1 items-center gap-3 last:flex-none"
            >
              {href ? (
                <Link
                  href={href}
                  className="flex items-center gap-3 rounded-lg transition-opacity duration-150 hover:opacity-80"
                >
                  {body}
                </Link>
              ) : (
                <div className="flex items-center gap-3">{body}</div>
              )}

              {index < BOOKING_STEP_KEYS.length - 1 && (
                <span
                  className={`h-px flex-1 ${isDone ? "bg-(--color-gold)/50" : "bg-(--color-border)"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
