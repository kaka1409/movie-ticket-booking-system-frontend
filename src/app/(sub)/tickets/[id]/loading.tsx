import { Skeleton, SkeletonCard } from "@/components/common/Skeleton";

export default function TicketDetailLoading() {
  return (
    <div className="min-h-dvh max-w-md mx-auto bg-(--color-bg) block md:hidden">
      <main className="pb-10">
        <SkeletonCard className="mx-4 mt-4 overflow-hidden p-0">
          {/* Poster hero */}
          <Skeleton className="h-80 w-full" />

          {/* Detail rows */}
          <div className="p-4 space-y-4">
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

            {/* Seat section */}
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-12 rounded-full" />
              <Skeleton className="h-3 w-full rounded-full" />
            </div>

            {/* Food section */}
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-24 rounded-full" />
              <Skeleton className="h-3 w-2/3 rounded-full" />
            </div>
          </div>

          {/* Tear line 1 */}
          <div className="relative flex items-center px-4">
            <div className="absolute -left-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
            <div className="flex-1 border-t-2 border-dashed border-(--color-border)" />
            <div className="absolute -right-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
          </div>

          {/* QR Code */}
          <div className="flex justify-center py-6">
            <Skeleton className="w-40 h-40 rounded-xl" />
          </div>

          {/* Booking ID */}
          <div className="px-4 pb-4 space-y-1">
            <Skeleton className="h-2.5 w-20 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-full" />
          </div>

          {/* Tear line 2 */}
          <div className="relative flex items-center px-4">
            <div className="absolute -left-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
            <div className="flex-1 border-t-2 border-dashed border-(--color-border)" />
            <div className="absolute -right-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
          </div>

          {/* Payment summary */}
          <div className="p-4 space-y-3">
            <Skeleton className="h-2.5 w-28 rounded-full" />
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Skeleton className="h-2.5 w-24 rounded-full" />
                <Skeleton className="h-2.5 w-20 rounded-full" />
              </div>
            ))}
            <div className="border-t border-(--color-border) pt-3 flex items-center justify-between">
              <Skeleton className="h-3.5 w-20 rounded-full" />
              <Skeleton className="h-3.5 w-24 rounded-full" />
            </div>
          </div>
        </SkeletonCard>

        {/* Action buttons */}
        <div className="px-4 space-y-3 mt-4">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
