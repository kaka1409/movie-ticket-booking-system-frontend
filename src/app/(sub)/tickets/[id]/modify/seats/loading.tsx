import { Skeleton } from "@/components/ui/Skeleton";
import DesktopSeatSkeleton from "./components/desktop/SeatSkeleton";

export default function SeatLoading() {
  return (
    <>
      <div className="block md:hidden">
        <div className="px-4 py-6 space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-8 w-full rounded" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>

      <div className="hidden md:block">
        <DesktopSeatSkeleton />
      </div>
    </>
  );
}
