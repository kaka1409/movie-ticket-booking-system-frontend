import { Skeleton } from "@/components/ui/Skeleton";
import { DesktopFailSkeleton } from "../components/StatusSkeletons";

export default function FailedLoading() {
  return (
    <>
      <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg) block md:hidden">
        <main className="flex-1 overflow-y-auto pb-8 pt-10 space-y-6">
          <Skeleton className="w-20 h-20 rounded-full mx-auto" />
          <Skeleton className="h-5 w-48 rounded-full mx-auto" />
          <Skeleton className="h-3 w-64 rounded-full mx-auto" />
          <Skeleton className="h-40 w-full rounded-2xl mx-4" />
          <Skeleton className="h-12 w-full rounded-2xl mx-4" />
        </main>
      </div>

      <div className="hidden md:block">
        <DesktopFailSkeleton />
      </div>
    </>
  );
}