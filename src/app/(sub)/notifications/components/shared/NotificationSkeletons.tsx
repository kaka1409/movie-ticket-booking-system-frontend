import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export function MobileNotificationCardSkeleton() {
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

export function DesktopNotificationRowSkeleton() {
  return (
    <div className="flex items-start gap-4 px-5 py-4">
      <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/3 rounded-full" />
        <Skeleton className="h-3 w-3/4 rounded-full" />
        <Skeleton className="h-2.5 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function MobileInboxSkeleton() {
  return (
    <div className="min-h-dvh max-w-md mx-auto bg-(--color-bg) block md:hidden">
      <main className="px-(--space-md) pb-10 pt-2 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <MobileNotificationCardSkeleton key={index} />
        ))}
      </main>
    </div>
  );
}

export function DesktopInboxSkeleton() {
  return (
    <div className="hidden md:block">
      <div className="mx-auto w-full max-w-4xl px-6 py-8 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56 rounded-md" />
            <Skeleton className="h-3.5 w-72 rounded-full" />
          </div>
          <Skeleton className="h-9 w-40 rounded-xl" />
        </div>

        <div className="mt-6 rounded-2xl border border-(--color-border) bg-(--color-surface) px-5 pt-4">
          <div className="flex gap-8 border-b border-(--color-border) pb-3">
            <Skeleton className="h-4 w-14 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <DesktopNotificationRowSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}