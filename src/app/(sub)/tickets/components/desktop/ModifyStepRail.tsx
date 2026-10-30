"use client";

import { useParams } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import type { ModificationType } from "@/features/tickets/types/index";
import StepRail from "@/components/shared/StepRail";

/** The four screens the modify wizard can show; the terminal success page is not a step. */
export type ModifyStepKey = "type" | "showtime" | "seats" | "review";

const STEP_LABELS: Record<ModifyStepKey, string> = {
  type: "tickets.modify.select_type",
  showtime: "tickets.modify.showtime.title",
  seats: "tickets.modify.seats.title",
  review: "tickets.modify.review.title",
};

const STEP_PATHS: Record<ModifyStepKey, string> = {
  type: "",
  showtime: "/showtime",
  seats: "/seats",
  review: "/review",
};

/**
 * Step order for the wizard. A seats-only change never visits the showtime step
 * and a showtime-only change never visits seats, so the ladder is derived from the
 * draft — one fixed list would mark the skipped step as "done" and put the numbers
 * somewhere the visitor never went.
 */
function stepsFor(modificationType: ModificationType | null): ModifyStepKey[] {
  if (modificationType === "seats") return ["type", "seats", "review"];
  if (modificationType === "showtime") return ["type", "showtime", "review"];
  return ["type", "showtime", "seats", "review"];
}

/**
 * The modify wizard's step list for the shared stepper. The draft survives step
 * navigation, so every earlier step is still safe to re-enter; forward movement
 * belongs to the current step's own CTA.
 */
export default function ModifyStepRail({ current }: { current: ModifyStepKey }) {
  const params = useParams();
  const id = params.id as string;
  const { modificationType } = useModification();
  const { translate } = useLocale();

  const keys = stepsFor(modificationType);
  const currentIndex = Math.max(1, keys.indexOf(current) + 1);

  const steps = keys.map((key, index) => ({
    key,
    label: translate(STEP_LABELS[key]),
    href: index + 1 < currentIndex ? `/tickets/${id}/modify${STEP_PATHS[key]}` : null,
  }));

  return <StepRail steps={steps} current={currentIndex} />;
}
