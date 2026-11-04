import { SkeletonBar, SkeletonCard, SurfaceSkeleton } from "@/components/ui/Skeleton";
import BookingSkeleton from "@/app/(sub)/booking/components/mobile/BookingSkeleton";
import BookingPanelSkeleton from "@/app/(sub)/booking/components/desktop/BookingPanelSkeleton";
import { SummaryRailSkeleton } from "@/app/(sub)/booking/components/desktop/RailSkeleton";

/**
 * Fallbacks for the payment step: one gateway row (radio, brand tile, name +
 * description) mirroring `PaymentMethodCard`, so the picker does not shift when
 * the catalog lands.
 */
function PaymentOptionSkeleton({ raised }: { raised: boolean }) {
  return (
    <SkeletonCard className="flex items-center gap-4 px-4 py-4">
      <SurfaceSkeleton raised={raised} className="h-5 w-5 shrink-0 rounded-full" />
      <SurfaceSkeleton raised={raised} className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <SurfaceSkeleton raised={raised} className="h-3.5 w-24 rounded-full" />
        <SurfaceSkeleton raised={raised} className="h-2.5 w-2/3 rounded-full" />
      </div>
    </SkeletonCard>
  );
}

function PaymentOptionsSkeleton({ raised, count }: { raised: boolean; count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <PaymentOptionSkeleton key={index} raised={raised} />
      ))}
    </>
  );
}

/** Mobile boundary fallback: the rows the page's `space-y-2.5` column holds. */
export function MobilePaymentOptionsSkeleton() {
  return <PaymentOptionsSkeleton raised={false} count={3} />;
}

/** Desktop boundary fallback: the same rows in the two-up grid. */
export function DesktopPaymentOptionsSkeleton() {
  return <PaymentOptionsSkeleton raised count={4} />;
}

/** Route fallback: the mobile step skeleton plus the desktop panel. */
export default function PaymentPageSkeleton() {
  return (
    <>
      <div className="block md:hidden">
        <BookingSkeleton step={5} />
      </div>

      <div className="hidden md:block">
        <BookingPanelSkeleton summary={<SummaryRailSkeleton />}>
          <div className="space-y-6">
            <SkeletonBar className="h-5 w-56 rounded-md" />
            <div className="grid gap-3 xl:grid-cols-2">
              <DesktopPaymentOptionsSkeleton />
            </div>
            <SkeletonBar className="h-3 w-48 rounded-full" />
          </div>
        </BookingPanelSkeleton>
      </div>
    </>
  );
}
