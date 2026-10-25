import { Skeleton } from "@/components/ui/Skeleton";
import DesktopTransferSkeleton from "./components/desktop/TransferSkeleton";

export default function TransferLoading() {
  return (
    <>
      <div className="min-h-dvh max-w-md mx-auto bg-(--color-bg) block md:hidden">
        <main className="flex-1 pb-5 pt-4 space-y-6 px-4">
          <Skeleton className="h-6 w-48 rounded-full" />
          <div className="grid grid-cols-2 gap-2.5">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-6 w-36 rounded-full" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </main>
      </div>

      <div className="hidden md:block">
        <DesktopTransferSkeleton />
      </div>
    </>
  );
}
