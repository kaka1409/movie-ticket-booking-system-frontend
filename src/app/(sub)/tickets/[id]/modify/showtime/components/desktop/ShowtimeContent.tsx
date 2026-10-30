"use client";

import { ArrowRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { useShowtimeStep } from "@/features/tickets/hooks/useModifySteps";
import Button from "@/components/ui/Button";
import MicroLabel from "@/components/ui/MicroLabel";
import ModifyStepLayout from "@/app/(sub)/tickets/components/desktop/ModifyStepLayout";
import ShowtimeStepBody from "@/app/(sub)/tickets/components/shared/ShowtimeStepBody";
import CinemaSearchBar from "../shared/CinemaSearchBar";
import CurrentShowtime from "../shared/CurrentShowtime";
import DatePickerWrapper from "../shared/DatePickerWrapper";
import ShowtimeList from "../shared/ShowtimeList";

/**
 * Desktop showtime step: the current slot, the cinema search and the eligible
 * grid in the content column; the picked slot and the CTA in the rail. The
 * search bar sits outside `ShowtimeStepBody` so it stays usable while the
 * eligible list is still loading or has failed.
 */
export default function ShowtimeContent() {
  const { translate } = useLocale();
  const { selectedShowtime } = useModification();
  const { canContinue, isNavigating, goToNextStep } = useShowtimeStep();

  return (
    <ModifyStepLayout
      current="showtime"
      summary={
        selectedShowtime ? (
          <div className="space-y-1">
            <MicroLabel className="text-(--color-text-muted)">
              {translate("tickets.modify.review.new")}
            </MicroLabel>
            <p className="text-sm font-bold text-(--color-text-primary)">
              {selectedShowtime.cinemaName}
            </p>
            <p className="text-xs text-(--color-text-muted)">
              {selectedShowtime.room} · {selectedShowtime.date} {selectedShowtime.time}
            </p>
          </div>
        ) : null
      }
      action={
        <Button
          icon={ArrowRight}
          disabled={!canContinue}
          loading={isNavigating}
          onClick={goToNextStep}
        >
          {translate("tickets.transfer.continue")}
        </Button>
      }
    >
      <div className="space-y-5">
        <h1 className="text-xl font-extrabold tracking-wide text-(--color-text-primary)">
          {translate("tickets.modify.showtime.title")}
        </h1>

        <CurrentShowtime />

        <CinemaSearchBar />

        <ShowtimeStepBody>
          <DatePickerWrapper />
          <ShowtimeList />
        </ShowtimeStepBody>
      </div>
    </ModifyStepLayout>
  );
}
