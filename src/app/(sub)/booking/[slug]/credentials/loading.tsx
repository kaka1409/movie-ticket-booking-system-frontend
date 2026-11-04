import BookingSkeleton from "@/app/(sub)/booking/components/mobile/BookingSkeleton";
import BookingPanelSkeleton from "@/app/(sub)/booking/components/desktop/BookingPanelSkeleton";
import { SummaryRailSkeleton } from "@/app/(sub)/booking/components/desktop/RailSkeleton";
import { SkeletonBar } from "@/components/ui/Skeleton";

/**
 * Route fallback during navigation. The desktop body mirrors `ContactForm`: a
 * `text-xl` heading, then one labelled field per row (label above a 42px
 * control) and the email notice under them.
 */
export default function CredentialsLoading() {
  return (
    <>
      <div className="block md:hidden">
        <BookingSkeleton step={4} />
      </div>

      <div className="hidden md:block">
        <BookingPanelSkeleton summary={<SummaryRailSkeleton />}>
          <div className="space-y-4">
            <SkeletonBar className="h-7 w-40 rounded-md" />

            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <SkeletonBar className="mb-1.5 h-[11px] w-24 rounded-full" />
                <SkeletonBar className="h-[42px] w-full rounded-xl" />
              </div>
            ))}

            <SkeletonBar className="h-3 w-4/5 rounded-full" />
          </div>
        </BookingPanelSkeleton>
      </div>
    </>
  );
}
