import AccountSkeleton from "@/features/profile/components/desktop/AccountSkeleton";
import { MobileReviewListSkeleton, DesktopReviewsSkeleton } from "./components/ReviewsSkeletons";

export default function ReviewsLoading() {
  return (
    <>
      <div className="min-h-dvh max-w-md mx-auto bg-(--color-bg) block md:hidden">
        <MobileReviewListSkeleton />
      </div>
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <AccountSkeleton>
            <DesktopReviewsSkeleton />
          </AccountSkeleton>
        </div>
      </div>
    </>
  );
}