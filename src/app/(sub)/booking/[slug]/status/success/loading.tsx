import { Skeleton, SkeletonCard } from "@/components/common/Skeleton";

export default function SuccessLoading() {
  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg) block md:hidden">
      <div className="flex justify-end px-4 pt-5">
        <Skeleton className="w-9 h-9 rounded-full" />
      </div>
      <main className="flex-1 overflow-y-auto pb-8 pt-4 space-y-6">
        {/* Success icon */}
        <div className="flex flex-col items-center gap-4 pt-8">
          <Skeleton className="w-20 h-20 rounded-full" />
          <Skeleton className="h-5 w-48 rounded-full" />
          <Skeleton className="h-3 w-64 rounded-full" />
        </div>

        {/* Ticket card */}
        <SkeletonCard className="mx-4 overflow-hidden p-0">
          <Skeleton className="h-40 w-full" />
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Skeleton className="h-2.5 w-16 rounded-full" />
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-2.5 w-16 rounded-full" />
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            </div>
            <div className="flex justify-center py-2">
              <Skeleton className="w-28 h-28 rounded-xl" />
            </div>
          </div>
        </SkeletonCard>

        {/* Action buttons */}
        <div className="px-4 flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-2xl" />
          <Skeleton className="h-12 flex-1 rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
