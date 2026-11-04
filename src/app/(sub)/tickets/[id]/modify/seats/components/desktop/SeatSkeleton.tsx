import ModifyPanelSkeleton from "@/app/(sub)/tickets/components/desktop/ModifyPanelSkeleton";
import { SkeletonBar } from "@/components/ui/Skeleton";

/**
 * Shape of the modify seats step: the ticket context card over the target map,
 * with the picked seats and their total in the rail. The map is capped at
 * `max-w-md` because `SeatGrid` cells are a fixed size.
 */
export default function SeatSkeleton() {
  return (
    <ModifyPanelSkeleton
      summary={
        <>
          <div>
            <SkeletonBar className="h-2.5 w-20 rounded-full" />
            <SkeletonBar className="mt-1.5 h-3.5 w-32 rounded-full" />
          </div>
          <div className="flex items-end justify-between">
            <SkeletonBar className="h-2.5 w-16 rounded-full" />
            <SkeletonBar className="h-4 w-20 rounded-md" />
          </div>
          <SkeletonBar className="h-3 w-full rounded-full" />
        </>
      }
    >
      <div className="space-y-5">
        <SkeletonBar className="h-7 w-48 rounded-md" />

        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1.5">
              <SkeletonBar className="h-3.5 w-40 rounded-full" />
              <SkeletonBar className="h-3 w-32 rounded-full" />
            </div>
            <SkeletonBar className="h-6 w-14 shrink-0 rounded-lg" />
          </div>
          <div className="mt-3 border-t border-(--color-border) pt-3">
            <SkeletonBar className="h-3 w-3/5 rounded-full" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
          <div className="mb-4 flex flex-col items-center gap-1">
            <SkeletonBar className="h-2.5 w-16 rounded-full" />
            <SkeletonBar className="h-6 w-[260px] rounded-full" />
          </div>

          <div className="space-y-2 px-2">
            {Array.from({ length: 8 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex items-center justify-center gap-1.5">
                {Array.from({ length: 10 }).map((_, seatIndex) => (
                  <SkeletonBar key={seatIndex} className="h-6.5 w-6.5 shrink-0 rounded-sm" />
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBar key={index} className="h-3 w-16 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </ModifyPanelSkeleton>
  );
}
