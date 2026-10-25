import { Skeleton } from "@/components/ui/Skeleton";
import DesktopReviewSkeleton from "./components/desktop/ReviewSkeleton";

export default function ReviewLoading() {
  return (
    <>
      <div className="block md:hidden">
        <div className="px-4 py-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>

      <div className="hidden md:block">
        <DesktopReviewSkeleton />
      </div>
    </>
  );
}
