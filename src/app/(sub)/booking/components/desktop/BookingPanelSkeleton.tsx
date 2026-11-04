import type { ReactNode } from "react";
import { SkeletonBar } from "@/components/ui/Skeleton";

/**
 * Route-level fallback for the desktop booking steps: the same panel, stepper,
 * two-column grid and rail `SplitStepLayout` paints, so navigation into a step
 * lands on its final shape.
 *
 * The step body and the rail's selection block are the only parts a caller
 * supplies — the identity block above them is the same on every step.
 */
export default function BookingPanelSkeleton({
  children,
  summary,
}: {
  children: ReactNode;
  /** The step's own summary block (see `RailSkeleton`). */
  summary?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-1 items-center gap-3 last:flex-none">
              <SkeletonBar className="h-8 w-8 shrink-0 rounded-full" />
              <SkeletonBar className="hidden h-2.5 w-20 rounded-full lg:block" />
              {index < 4 && <span className="h-px flex-1 bg-(--color-border)" />}
            </div>
          ))}
        </div>

        <div className="surface-raised mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">
          <div className="min-w-0">{children}</div>

          <aside className="rounded-2xl border border-(--color-border) bg-(--color-surface-2) p-5">
            <SkeletonBar className="h-2.5 w-24 rounded-full" />

            <div className="mt-4 flex gap-4">
              <SkeletonBar className="w-20 shrink-0 rounded-md" style={{ aspectRatio: "2/3" }} />
              <div className="min-w-0 flex-1 space-y-2 pt-1">
                <SkeletonBar className="h-4 w-3/4 rounded-md" />
                <SkeletonBar className="h-3 w-1/2 rounded-full" />
                <SkeletonBar className="h-5 w-12 rounded-md" />
              </div>
            </div>

            <div className="mt-5 space-y-4 border-t border-(--color-border) pt-5">
              {summary ?? (
                <>
                  <SkeletonBar className="h-3 w-2/3 rounded-full" />
                  <SkeletonBar className="h-3 w-1/2 rounded-full" />
                </>
              )}
            </div>

            <SkeletonBar className="mt-5 h-12 w-full rounded-(--radius-md)" />
          </aside>
        </div>
      </div>
    </div>
  );
}
