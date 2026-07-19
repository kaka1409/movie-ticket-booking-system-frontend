import { Skeleton, SkeletonCard } from "@/components/common/Skeleton";

function NotificationCardSkeleton() {
  return (
    <SkeletonCard>
      <div className="flex gap-3 h-25">
        <Skeleton className="w-10 h-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4 rounded-full" />
          <Skeleton className="h-3.5 w-full rounded-full" />
          <Skeleton className="h-4 w-1/2 rounded-full" />
          <Skeleton className="h-5 w--full rounded-full" />
          <Skeleton className="h-4 w-4/5 rounded-full" />
        </div>
      </div>
    </SkeletonCard>
  );
}

export default function NotificationLoading() {
  return (
    <div className="min-h-dvh max-w-md mx-auto bg-(--color-bg) block md:hidden">
      <main className="px-(--space-md) pb-10 pt-2 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <NotificationCardSkeleton key={index} />
        ))}
      </main>
    </div>
  );
}
