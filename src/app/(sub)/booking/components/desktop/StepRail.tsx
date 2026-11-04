"use client";

import { useParams } from "next/navigation";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import { BOOKING_STEP_KEYS } from "@/features/booking/types";
import { buildCinemaHref, buildSeatsHref } from "@/features/booking/utils/cinema";
import StepRail from "@/components/shared/StepRail";

/**
 * The booking flow's step list (labels + backward-only hrefs) for the shared
 * stepper. Only the steps already behind the user are links — the draft is still
 * intact there, so re-entering an earlier step is safe.
 */
export default function BookingStepRail({ current }: { current: number }) {
  const params = useParams();
  const slug = params.slug as string;
  const { showtimeId, cinemaId, time, date } = useBooking();
  const { translate } = useLocale();

  /** Backward-only href for a step — `null` for the current/upcoming ones. */
  const hrefFor = (step: number): string | null => {
    if (step >= current) return null;
    if (step === 1) return buildCinemaHref(slug, { showtimeId, cinemaId, time, date });
    if (step === 2) return buildSeatsHref(slug, { showtimeId, cinemaId, time, date });
    if (step === 3) return `/booking/${slug}/snack`;
    if (step === 4) return `/booking/${slug}/credentials`;
    return null;
  };

  const steps = BOOKING_STEP_KEYS.map((key, index) => ({
    key,
    label: translate(key),
    href: hrefFor(index + 1),
  }));

  return <StepRail steps={steps} current={current} />;
}
