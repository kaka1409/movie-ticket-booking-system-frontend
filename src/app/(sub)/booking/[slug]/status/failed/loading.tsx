import { Skeleton, SkeletonCard } from "@/components/common/Skeleton";

export default function FailedLoading() {
  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg) block md:hidden">
      <main className="flex-1 overflow-y-auto pb-8 pt-10 space-y-6">
        {/* Failed icon */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <Skeleton className="w-20 h-20 rounded-full" />
          <Skeleton className="h-5 w-44 rounded-full" />
          <Skeleton className="h-3 w-56 rounded-full" />
        </div>

        {/* Failed order card */}
        <SkeletonCard className="mx-4 overflow-hidden p-0">
          <div className="p-4 space-y-3">
            <Skeleton className="h-3 w-32 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Skeleton className="h-2.5 w-24 rounded-full" />
                  <Skeleton className="h-2.5 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </SkeletonCard>

        {/* Action buttons */}
        <div className="px-4 space-y-3">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
