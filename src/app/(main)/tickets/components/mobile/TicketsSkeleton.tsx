import { Skeleton } from "@/components/common/Skeleton";
import { SkeletonCard } from "@/components/common/Skeleton";

function UpcomingCardSkeleton() {
  return (
    <SkeletonCard className="overflow-hidden p-0">
      <div className="flex gap-3 p-4">
        <Skeleton className="w-24 shrink-0 rounded-xl" style={{ aspectRatio: "2/3" }} />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-5 w-3/4 rounded-full" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-3 w-32 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-3 w-28 rounded-full" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <div className="border-t-2 border-dashed border-(--color-border) mx-4 my-0" />
      <div className="flex items-center justify-between px-4 py-4">
        <div className="space-y-1">
          <Skeleton className="h-2 w-20 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </SkeletonCard>
  );
}

export default function TicketsSkeleton() {
  return (
    <div className="min-h-dvh bg-(--color-bg) px-(--space-md)">
      <div className="space-y-4 pt-2 pb-10">
        {/* Tabs */}
        <div className="flex gap-3">
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>

        {/* Ticket cards */}
        {Array.from({ length: 3 }).map((_, index) => (
          <UpcomingCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
