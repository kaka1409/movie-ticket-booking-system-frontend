import { Skeleton, SkeletonBar } from "@/components/ui/Skeleton";

export default function RegisterLoading() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
          <div className="w-full max-w-md space-y-6">
            <Skeleton className="mx-auto h-8 w-44 rounded" />
            <Skeleton className="mx-auto h-4 w-60 rounded-full" />
            <div className="space-y-4 pt-2">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-5 w-48 rounded-full" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/*
        Desktop: the auth layout owns the card, so this mirrors the register body
        — five fields, the always-visible password checklist, the terms row and
        the submit. `SkeletonBar` because the form column is `.surface-raised`.
      */}
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <SkeletonBar className="h-8 w-44 rounded-sm" />
          <SkeletonBar className="mt-1.5 h-5 w-60 rounded-full" />

          <div className="mt-6 flex border-b border-(--color-border)">
            <div className="flex flex-1 justify-center pb-3">
              <SkeletonBar className="h-4 w-16 rounded-full" />
            </div>
            <div className="flex flex-1 justify-center pb-3">
              <SkeletonBar className="h-4 w-20 rounded-full" />
            </div>
          </div>

          <div className="mt-5 space-y-3.5">
            <SkeletonBar className="h-[54px] rounded-xl" />
            <SkeletonBar className="h-[54px] rounded-xl" />
            <SkeletonBar className="h-[54px] rounded-xl" />
            <SkeletonBar className="h-[54px] rounded-xl" />
            <SkeletonBar className="h-[54px] rounded-xl" />

            <div className="space-y-1.5 px-1">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <SkeletonBar className="h-4 w-4 shrink-0 rounded-full" />
                  <SkeletonBar className="h-3 w-32 rounded-full" />
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3">
              <SkeletonBar className="h-5 w-5 shrink-0 rounded-md" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <SkeletonBar className="h-3.5 w-full rounded-full" />
                <SkeletonBar className="h-3.5 w-2/3 rounded-full" />
              </div>
            </div>

            <SkeletonBar className="h-[52px] rounded-2xl" />
          </div>

          <SkeletonBar className="mx-auto mt-5 h-3 w-52 rounded-full" />
        </div>
      </div>
    </>
  );
}
