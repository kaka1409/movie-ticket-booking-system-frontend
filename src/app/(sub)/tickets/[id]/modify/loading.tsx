import { Skeleton } from "@/components/ui/Skeleton";
import DesktopModifySkeleton from "./components/desktop/ModifySkeleton";

export default function ModifyLoading() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="px-4 py-6 space-y-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopModifySkeleton />
      </div>
    </>
  );
}
