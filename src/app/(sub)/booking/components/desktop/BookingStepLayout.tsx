import type { ReactNode } from "react";
import BookingRail from "./BookingRail";
import BookingStepRail from "./StepRail";
import SplitStepLayout from "@/components/shared/SplitStepLayout";
import type { Movie } from "@/features/movies/types";

/**
 * Desktop shell for the five booking steps: the booking stepper on top, the step
 * body beside `BookingRail`. The panel/rail geometry lives in
 * `shared/SplitStepLayout`; this only binds the booking flow's own pieces.
 */
export default function BookingStepLayout({
  current,
  summary,
  action,
  errorText,
  movie,
  children,
}: {
  /** 1-based index of the step being rendered. */
  current: number;
  summary?: ReactNode;
  action: ReactNode;
  errorText?: string | null;
  /** Movie the step itself holds (see `BookingRail`); omit when it only lives in the draft. */
  movie?: Movie;
  children: ReactNode;
}) {
  return (
    <SplitStepLayout
      stepper={<BookingStepRail current={current} />}
      rail={<BookingRail summary={summary} action={action} errorText={errorText} movie={movie} />}
    >
      {children}
    </SplitStepLayout>
  );
}
