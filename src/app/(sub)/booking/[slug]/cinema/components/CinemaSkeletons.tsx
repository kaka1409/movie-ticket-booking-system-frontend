import { Skeleton, SkeletonBar, SkeletonCard, SurfaceSkeleton } from "@/components/ui/Skeleton";
import BookingSkeleton from "@/app/(sub)/booking/components/mobile/BookingSkeleton";
import BookingPanelSkeleton from "@/app/(sub)/booking/components/desktop/BookingPanelSkeleton";

/**
 * Fallbacks for the cinema step. Each mirrors the box its section paints (day
 * chips, search field, cards), so the step body never jumps when the schedule
 * lands.
 */

function DateChipsSkeleton({ raised }: { raised: boolean }) {
  return (
    <div className="flex gap-2 overflow-hidden">
      {Array.from({ length: 5 }).map((_, index) => (
        <SurfaceSkeleton
          key={index}
          raised={raised}
          className="h-[60px] w-17 shrink-0 rounded-xl"
        />
      ))}
    </div>
  );
}

function CinemaCardsSkeleton({ raised, count }: { raised: boolean; count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} className="p-0">
          <div className="space-y-2 p-4">
            <SurfaceSkeleton raised={raised} className="h-3.5 w-2/3 rounded-full" />
            <SurfaceSkeleton raised={raised} className="h-2.5 w-1/2 rounded-full" />
            <div className="flex flex-wrap gap-2 pt-2">
              {Array.from({ length: 4 }).map((_, chipIndex) => (
                <SurfaceSkeleton key={chipIndex} raised={raised} className="h-8 w-16 rounded-xl" />
              ))}
            </div>
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

/** Mobile boundary fallback (the page supplies the surrounding rhythm). */
export function MobileCinemaScheduleSkeleton() {
  return (
    <div className="space-y-4">
      <DateChipsSkeleton raised={false} />
      <Skeleton className="mx-4 h-[46px] rounded-2xl" />
      <CinemaCardsSkeleton raised={false} count={3} />
    </div>
  );
}

/** Desktop boundary fallback: the same blocks inside the step panel. */
export function DesktopCinemaSlotsSkeleton() {
  return (
    <div className="space-y-6">
      <DateChipsSkeleton raised />
      <SkeletonBar className="h-[46px] rounded-2xl" />
      <CinemaCardsSkeleton raised count={3} />
    </div>
  );
}

/** Route fallback: the mobile step skeleton, and the desktop panel it streams into. */
export default function CinemaPageSkeleton() {
  return (
    <>
      <div className="block md:hidden">
        <BookingSkeleton step={1} />
      </div>

      <div className="hidden md:block">
        <BookingPanelSkeleton>
          <SkeletonBar className="h-5 w-40 rounded-md" />
          <DesktopCinemaSlotsSkeleton />
        </BookingPanelSkeleton>
      </div>
    </>
  );
}
