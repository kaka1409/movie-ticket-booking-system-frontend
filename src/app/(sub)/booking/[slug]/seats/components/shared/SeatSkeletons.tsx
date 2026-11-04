import { SkeletonBar, SurfaceSkeleton } from "@/components/ui/Skeleton";
import BookingSkeleton from "@/app/(sub)/booking/components/mobile/BookingSkeleton";
import BookingPanelSkeleton from "@/app/(sub)/booking/components/desktop/BookingPanelSkeleton";
import { SelectionRailSkeleton } from "@/app/(sub)/booking/components/desktop/RailSkeleton";

/**
 * Fallbacks for the seats step: the screen, eight half-row pairs of 26px cells
 * and the legend — the box `SeatGrid` paints, so the map never jumps when the
 * rows land. `raised` picks the muted bar tone a `.surface-raised` subtree needs.
 */
export function SeatMapSkeleton({ raised = false }: { raised?: boolean }) {
  return (
    <div>
      <div className="mb-4 flex flex-col items-center gap-1">
        <SurfaceSkeleton raised={raised} className="h-2.5 w-16 rounded-full" />
        <SurfaceSkeleton raised={raised} className="h-6 w-[260px] rounded-full" />
      </div>

      <div className="space-y-2 px-2">
        {Array.from({ length: 8 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center justify-between gap-1">
            <SurfaceSkeleton raised={raised} className="h-2.5 w-2.5 shrink-0 rounded-sm" />
            <div className="flex gap-1.5">
              {Array.from({ length: 5 }).map((_, seatIndex) => (
                <SurfaceSkeleton
                  key={seatIndex}
                  raised={raised}
                  className="h-6.5 w-6.5 shrink-0 rounded-sm"
                />
              ))}
            </div>
            <span className="w-3 shrink-0" />
            <div className="flex gap-1.5">
              {Array.from({ length: 5 }).map((_, seatIndex) => (
                <SurfaceSkeleton
                  key={seatIndex}
                  raised={raised}
                  className="h-6.5 w-6.5 shrink-0 rounded-sm"
                />
              ))}
            </div>
            <SurfaceSkeleton raised={raised} className="h-2.5 w-2.5 shrink-0 rounded-sm" />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <SurfaceSkeleton key={index} raised={raised} className="h-3 w-16 rounded-full" />
        ))}
      </div>
    </div>
  );
}

/** Route fallback: the mobile step skeleton plus the desktop panel and map card. */
export default function SeatsPageSkeleton() {
  return (
    <>
      <div className="block md:hidden">
        <BookingSkeleton step={2} />
      </div>

      <div className="hidden md:block">
        <BookingPanelSkeleton summary={<SelectionRailSkeleton />}>
          <div className="space-y-6">
            <SkeletonBar className="h-5 w-40 rounded-md" />
            <div className="mx-auto w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
              <SeatMapSkeleton raised />
            </div>
          </div>
        </BookingPanelSkeleton>
      </div>
    </>
  );
}
