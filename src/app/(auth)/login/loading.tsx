import { Skeleton } from "@/components/ui/Skeleton";

export default function LoginLoading() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
          <div className="w-full max-w-md space-y-6">
            <Skeleton className="mx-auto h-8 w-40 rounded" />
            <Skeleton className="mx-auto h-4 w-56 rounded-full" />
            <div className="space-y-4 pt-2">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-6 py-16 lg:px-8">
          <div className="grid w-full max-w-5xl grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <Skeleton className="hidden h-[620px] lg:block" />
            <div className="space-y-6 p-8">
              <Skeleton className="h-8 w-40 rounded" />
              <Skeleton className="h-4 w-56 rounded-full" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
