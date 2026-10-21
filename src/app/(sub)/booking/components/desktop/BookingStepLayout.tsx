import type { ReactNode } from "react";
import BookingRail from "./BookingRail";
import StepRail from "./StepRail";

/**
 * Desktop shell shared by all five booking steps: a `--color-surface` panel that
 * holds the numbered stepper on top and a two-column body — content + summary
 * rail — from `lg:` up.
 *
 * Between 740px and 1023px the rail drops below the content at full width: the
 * step forms are input-heavy and a side rail would squeeze them past the point
 * where the seat grid and the contact fields still fit.
 *
 * The panel `.surface-raised` wrapper lifts every nested card to
 * `--color-surface-2` so the shared mobile components keep a readable lift.
 */
export default function BookingStepLayout({
  current,
  summary,
  action,
  errorText,
  children,
}: {
  /** 1-based index of the step being rendered. */
  current: number;
  summary?: ReactNode;
  action: ReactNode;
  errorText?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
        <StepRail current={current} />

        {/* `surface-raised` lifts every card in here to `--color-surface-2` so it
            stays readable on the panel (see global.css). */}
        <div className="surface-raised mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">
          <div className="min-w-0">{children}</div>
          <BookingRail summary={summary} action={action} errorText={errorText} />
        </div>
      </div>
    </div>
  );
}
