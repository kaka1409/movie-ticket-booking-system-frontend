import BookingSkeleton from "@/app/(sub)/booking/components/mobile/BookingSkeleton";
import BookingPanelSkeleton from "@/app/(sub)/booking/components/desktop/BookingPanelSkeleton";
import { SkeletonBar } from "@/components/ui/Skeleton";

export default function CredentialsLoading() {
  return (
    <>
      <div className="block md:hidden">
        <BookingSkeleton step={4} />
      </div>
      <div className="hidden md:block">
        <BookingPanelSkeleton>
          <div className="space-y-4">
            <SkeletonBar className="h-4 w-32 rounded-full" />
            <SkeletonBar className="h-10 w-full rounded-xl" />
            <SkeletonBar className="h-10 w-full rounded-xl" />
            <SkeletonBar className="h-10 w-full rounded-xl" />
          </div>
        </BookingPanelSkeleton>
      </div>
    </>
  );
}