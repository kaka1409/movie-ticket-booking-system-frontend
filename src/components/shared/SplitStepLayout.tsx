import type { ReactNode } from "react";

/**
 * Desktop shell shared by every multi-step flow (booking steps, ticket modify):
 * one `--color-surface` panel holding the stepper on top and a two-column body —
 * content + summary rail — from `lg:` up.
 *
 * Between 740px and 1023px the rail drops below the content at full width: the
 * step bodies are input-heavy (seat grids, contact fields) and a side rail would
 * squeeze them past the point where they still fit.
 *
 * The panel `.surface-raised` wrapper lifts every nested card to
 * `--color-surface-2` so the shared mobile components keep a readable lift.
 * Stepper and rail are passed in, so a flow can own its own step list and its
 * own summary card without forking this shell.
 */
export default function SplitStepLayout({
  stepper,
  rail,
  children,
}: {
  /** The flow's own stepper node (see `shared/StepRail`). */
  stepper: ReactNode;
  /** The flow's own `<aside>` summary rail, CTA and error line included. */
  rail: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
        {stepper}

        <div className="surface-raised mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">
          <div className="min-w-0">{children}</div>
          {rail}
        </div>
      </div>
    </div>
  );
}
