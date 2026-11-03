import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import AccountSkeleton from "@/components/shared/profile/desktop/AccountSkeleton";
import { EditProfileDesktopSkeleton } from "@/components/shared/profile/desktop/AccountPageSkeletons";

export default function EditProfileLoading() {
  return (
    <>
      <div className="min-h-dvh max-w-md mx-auto bg-(--color-bg) block md:hidden">
        <main className="px-(--space-md) pb-10 pt-6 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="w-28 h-28 rounded-full" />
            <Skeleton className="h-3 w-24 rounded-full" />
          </div>

          <SkeletonCard>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-1.5">
                  <Skeleton className="h-2.5 w-24 rounded-full" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </SkeletonCard>

          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1 rounded-2xl" />
            <Skeleton className="h-12 flex-1 rounded-2xl" />
          </div>
        </main>
      </div>
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <AccountSkeleton>
            <EditProfileDesktopSkeleton />
          </AccountSkeleton>
        </div>
      </div>
    </>
  );
}
