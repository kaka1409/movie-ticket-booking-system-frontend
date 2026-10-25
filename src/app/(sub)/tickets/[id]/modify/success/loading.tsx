import { Skeleton } from "@/components/ui/Skeleton";
import SuccessIcon from "@/components/shared/SuccessIcon";

export default function ModifySuccessLoading() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
          <Skeleton className="mb-6 h-20 w-20 rounded-full" />
          <Skeleton className="h-7 w-56 rounded" />
          <Skeleton className="mt-2 h-4 w-64 rounded-full" />
          <Skeleton className="mt-8 h-12 w-full max-w-sm rounded-2xl" />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center px-6 py-20 lg:px-8">
          <Skeleton className="mb-6 h-20 w-20 rounded-full" />
          <Skeleton className="h-8 w-64 rounded" />
          <Skeleton className="mt-2 h-4 w-72 rounded-full" />
          <Skeleton className="mt-10 h-12 w-full max-w-sm rounded-2xl" />
        </div>
      </div>
    </>
  );
}
