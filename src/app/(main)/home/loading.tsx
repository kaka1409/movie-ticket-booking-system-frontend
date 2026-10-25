import { Skeleton } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="space-y-6 px-4 py-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-4 w-32 rounded-full" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-32 shrink-0 space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                <Skeleton className="h-3 w-3/4 rounded-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-4 w-32 rounded-full" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-32 shrink-0 space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                <Skeleton className="h-3 w-3/4 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-7xl space-y-8 px-6 py-8 lg:px-8">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full max-w-2xl rounded-xl" />
          <Skeleton className="h-4 w-40 rounded-full" />
          <div className="grid grid-cols-4 gap-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                <Skeleton className="h-3 w-3/4 rounded-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-4 w-40 rounded-full" />
          <div className="grid grid-cols-4 gap-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                <Skeleton className="h-3 w-3/4 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
