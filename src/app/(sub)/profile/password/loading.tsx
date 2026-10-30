import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import AccountSkeleton from "@/components/shared/profile/desktop/AccountSkeleton";

export default function ChangePasswordLoading() {
  return (
    <>
      <div className="min-h-dvh max-w-md mx-auto bg-(--color-bg) block md:hidden">
        <main className="px-(--space-md) pb-10 pt-6 space-y-6">
          <SkeletonCard>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-1.5">
                  <Skeleton className="h-2.5 w-32 rounded-full" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        </main>
      </div>
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <AccountSkeleton />
        </div>
      </div>
    </>
  );
}
