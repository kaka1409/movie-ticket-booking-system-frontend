import { Skeleton } from "@/components/ui/Skeleton";
import DesktopShowtimeSkeleton from "./components/desktop/ShowtimeSkeleton";

export default function ShowtimeLoading() {
  return (
    <>
      <div className="block md:hidden">
        <div className="px-4 py-6 space-y-4">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>

      <div className="hidden md:block">
        <DesktopShowtimeSkeleton />
      </div>
    </>
  );
}
