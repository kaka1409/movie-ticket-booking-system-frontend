import { Skeleton, SkeletonBar } from "@/components/ui/Skeleton";

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

      {/*
        Desktop: `loading.tsx` renders inside the auth layout's form column, so
        this is the form body only — the layout already paints the card, artwork
        and padding. Bars are `SkeletonBar` because that column is
        `.surface-raised`, where a plain `Skeleton` would be the panel's colour.
      */}
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <SkeletonBar className="h-8 w-40 rounded-sm" />
          <SkeletonBar className="mt-1.5 h-5 w-56 rounded-full" />

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

            <div>
              <SkeletonBar className="h-[54px] rounded-xl" />
              <SkeletonBar className="mt-1.5 ml-auto h-3 w-24 rounded-full" />
            </div>

            <SkeletonBar className="h-[52px] rounded-2xl" />
          </div>

          <SkeletonBar className="mx-auto mt-5 h-3 w-48 rounded-full" />
        </div>
      </div>
    </>
  );
}
