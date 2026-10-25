"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "../contexts/ModificationContext";

/** CTA contract every modify step exposes, so both device skins drive one rule. */
export interface ModifyStepCta {
  canContinue: boolean;
  /** The route change is being held, so the CTA's spinner has something to show. */
  isNavigating: boolean;
  goToNextStep: () => void;
}

/**
 * The push is same-tick, so without a short hold the CTA's own spinner would never
 * render; the delay makes the transition legible instead of a silent repaint.
 */
const NAVIGATION_HOLD_MS = 300;

function useDelayedPush(): { isNavigating: boolean; pushTo: (href: string) => void } {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const pushTo = (href: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    window.setTimeout(() => router.push(href), NAVIGATION_HOLD_MS);
  };

  return { isNavigating, pushTo };
}

/** Type step: the picked type decides which step comes first. */
export function useModifyTypeStep(): ModifyStepCta {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { modificationType } = useModification();

  const goToNextStep = () => {
    if (!modificationType) return;
    // A seats-only change has no showtime to pick, so it opens the seat map.
    router.push(
      modificationType === "seats"
        ? `/tickets/${id}/modify/seats`
        : `/tickets/${id}/modify/showtime`,
    );
  };

  return { canContinue: modificationType !== null, isNavigating: false, goToNextStep };
}

/**
 * Showtime step: a different room means the current seats do not exist on that
 * map, so the server requires a fresh pick before the change can be submitted.
 */
export function useShowtimeStep(): ModifyStepCta {
  const params = useParams();
  const id = params.id as string;
  const { modificationType, selectedShowtime } = useModification();
  const { isNavigating, pushTo } = useDelayedPush();

  const needsSeatSelection =
    modificationType === "both" || Boolean(selectedShowtime?.requiresSeatSelection);

  return {
    canContinue: selectedShowtime !== null,
    isNavigating,
    goToNextStep: () => {
      if (!selectedShowtime) return;
      pushTo(needsSeatSelection ? `/tickets/${id}/modify/seats` : `/tickets/${id}/modify/review`);
    },
  };
}

/**
 * Seats step: the server rejects a swap that does not cover the same number of
 * seats as the booking, so the CTA stays shut until the pick matches exactly (a
 * SweetBox cell carries two seat ids and therefore counts as two). `hintText`
 * spells out which of the three states the pick is in.
 */
export function useSeatsStep(): ModifyStepCta & { hintText: string } {
  const params = useParams();
  const id = params.id as string;
  const { translate } = useLocale();
  const { selectedSeats, originalSeatCount } = useModification();
  const { isNavigating, pushTo } = useDelayedPush();

  const requiredSeatCount = originalSeatCount ?? 0;
  const selectedSeatCount = selectedSeats.reduce((total, seat) => total + seat.seatIds.length, 0);
  const hasExactCount = requiredSeatCount > 0 && selectedSeatCount === requiredSeatCount;

  const hintText =
    selectedSeatCount === 0
      ? translate("tickets.modify.seats.select_prompt")
      : hasExactCount
        ? translate("tickets.modify.seats.selected").replace("{count}", String(selectedSeatCount))
        : translate("tickets.modify.seats.exact_count").replace(
            "{count}",
            String(requiredSeatCount),
          );

  return {
    canContinue: hasExactCount,
    isNavigating,
    hintText,
    goToNextStep: () => {
      if (!hasExactCount) return;
      pushTo(`/tickets/${id}/modify/review`);
    },
  };
}
