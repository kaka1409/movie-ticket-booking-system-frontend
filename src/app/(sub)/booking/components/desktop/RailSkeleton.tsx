import { SkeletonBar } from "@/components/ui/Skeleton";

/**
 * Step-specific blocks drawn under the movie identity in the desktop rail
 * (`BookingRail`). Each mirrors the component the step really renders, so the
 * rail keeps its height while the step's own data is still missing.
 */

/** `CountdownRow`: the session clock, label left and mono figure right. */
function CountdownRailSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <SkeletonBar className="h-2.5 w-24 rounded-full" />
      <SkeletonBar className="h-4 w-14 rounded-md" />
    </div>
  );
}

/** `RailTheater`: label, cinema + room, then the day and the time. */
function TheaterRailSkeleton() {
  return (
    <div className="space-y-1">
      <SkeletonBar className="h-2.5 w-20 rounded-full" />
      <SkeletonBar className="h-3.5 w-40 rounded-full" />
      <SkeletonBar className="h-3 w-28 rounded-full" />
    </div>
  );
}

/** `RailSeats`: the seat count in the label, the picked labels under it. */
function SeatsRailSkeleton() {
  return (
    <div>
      <SkeletonBar className="h-2.5 w-20 rounded-full" />
      <SkeletonBar className="mt-1.5 h-3.5 w-32 rounded-full" />
    </div>
  );
}

/** `PriceBreakdown`: seat rows, snack rows, then the right-aligned total. */
function PriceRailSkeleton() {
  return (
    <>
      <div className="space-y-3">
        <SkeletonBar className="h-2.5 w-24 rounded-full" />
        <SkeletonBar className="h-3.5 w-2/3 rounded-full" />
        <SkeletonBar className="h-3 w-1/2 rounded-full" />
      </div>
      <div className="flex justify-end">
        <div className="space-y-1.5 text-right">
          <SkeletonBar className="ml-auto h-2.5 w-20 rounded-full" />
          <SkeletonBar className="ml-auto h-4 w-24 rounded-md" />
        </div>
      </div>
    </>
  );
}

/** Cinema step rail: the chosen theater, or the "pick one" prompt. */
export function CinemaRailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <SkeletonBar className="h-2.5 w-20 rounded-full" />
        <SkeletonBar className="h-3.5 w-36 rounded-full" />
        <SkeletonBar className="h-3 w-24 rounded-full" />
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <SkeletonBar className="h-2.5 w-16 rounded-full" />
          <SkeletonBar className="h-4 w-12 rounded-md" />
        </div>
        <SkeletonBar className="h-3 w-16 rounded-full" />
      </div>
    </div>
  );
}

/** Seats and snack steps: clock, theater and the picked seats. */
export function SelectionRailSkeleton() {
  return (
    <>
      <CountdownRailSkeleton />
      <TheaterRailSkeleton />
      <SeatsRailSkeleton />
    </>
  );
}

/** Credentials and payment steps: clock, theater and the price breakdown. */
export function SummaryRailSkeleton() {
  return (
    <>
      <CountdownRailSkeleton />
      <TheaterRailSkeleton />
      <PriceRailSkeleton />
    </>
  );
}
