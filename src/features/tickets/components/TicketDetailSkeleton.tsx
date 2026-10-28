import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import TearLine from "@/components/ui/TearLine";
import DesktopTicketDetailSkeleton from "./desktop/TicketDetailSkeleton";

/**
 * Route fallback for the ticket cluster (`/tickets/[id]*`). Both device trees
 * share it; the mobile body is the only one with a card mock, the desktop one
 * is the moved rail skeleton.
 */
export default function TicketDetailSkeleton() {
  return (
    <>
      <div className="min-h-dvh max-w-md mx-auto bg-(--color-bg) block md:hidden">
        <main className="pb-10">
          <SkeletonCard className="mx-4 mt-4 overflow-hidden p-0">
            <Skeleton className="h-80 w-full" />

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

              <div className="space-y-1">
                <Skeleton className="h-2.5 w-12 rounded-full" />
                <Skeleton className="h-3 w-full rounded-full" />
              </div>

              <div className="space-y-1">
                <Skeleton className="h-2.5 w-24 rounded-full" />
                <Skeleton className="h-3 w-2/3 rounded-full" />
              </div>
            </div>

            <TearLine className="px-4" />

            <div className="flex justify-center py-6">
              <Skeleton className="w-40 h-40 rounded-xl" />
            </div>

            <div className="px-4 pb-4 space-y-1">
              <Skeleton className="h-2.5 w-20 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-full" />
            </div>

            <TearLine className="px-4" />

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

          <div className="px-4 space-y-3 mt-4">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </main>
      </div>

      <div className="hidden md:block">
        <DesktopTicketDetailSkeleton />
      </div>
    </>
  );
}