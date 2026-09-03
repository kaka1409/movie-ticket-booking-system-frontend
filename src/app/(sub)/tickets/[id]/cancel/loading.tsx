import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function CancelLoading() {
  return (
    <div className="min-h-dvh max-w-md mx-auto bg-(--color-bg) block md:hidden">
      <main className="pb-8 pt-4 px-4 space-y-4">
        <SkeletonCard className="p-4 space-y-4">
          <div className="flex gap-3">
            <Skeleton className="w-16 h-20 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-3/4 rounded-full" />
              <Skeleton className="h-2.5 w-1/2 rounded-full" />
              <Skeleton className="h-2.5 w-2/3 rounded-full" />
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          <div className="space-y-2">
            <Skeleton className="h-2.5 w-16 rounded-full" />
            <Skeleton className="h-3 w-full rounded-full" />
          </div>

          <Skeleton className="h-px w-full" />

          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-2.5 w-24 rounded-full" />
              <Skeleton className="h-2.5 w-20 rounded-full" />
            </div>
          ))}

          <div className="flex justify-between">
            <Skeleton className="h-2.5 w-20 rounded-full" />
            <Skeleton className="h-2.5 w-16 rounded-full" />
          </div>

          <Skeleton className="h-px w-full" />

          <div className="space-y-1">
            <Skeleton className="h-2.5 w-20 rounded-full" />
            <Skeleton className="h-3 w-1/2 rounded-full" />
          </div>
        </SkeletonCard>

        <Skeleton className="h-2.5 w-32 mx-auto rounded-full" />

        <Skeleton className="h-14 w-full rounded-2xl" />
      </main>
    </div>
  );
}
