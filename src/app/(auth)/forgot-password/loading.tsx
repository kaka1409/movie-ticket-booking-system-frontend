import { Skeleton, SkeletonBar } from "@/components/ui/Skeleton";

export default function ForgotPasswordLoading() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
          <div className="w-full max-w-md space-y-6">
            <Skeleton className="mx-auto h-8 w-48 rounded" />
            <Skeleton className="mx-auto h-4 w-64 rounded-full" />
            <div className="space-y-4 pt-2">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/*
        Desktop: body only — the auth layout paints the card. No tabs here; the
        disabled submit and the "still being built" note keep their boxes.
        `SkeletonBar` because the form column is `.surface-raised`.
      */}
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <SkeletonBar className="h-8 w-48 rounded-sm" />
          <SkeletonBar className="mt-1.5 h-5 w-64 rounded-full" />

          <div className="mt-6 space-y-4">
            <SkeletonBar className="h-[54px] rounded-xl" />
            <SkeletonBar className="h-[52px] rounded-2xl" />

            <div className="flex items-start gap-2.5 rounded-xl border border-(--color-border) px-4 py-3">
              <SkeletonBar className="mt-0.5 h-4 w-4 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <SkeletonBar className="h-3 w-full rounded-full" />
                <SkeletonBar className="h-3 w-1/2 rounded-full" />
              </div>
            </div>
          </div>

          <SkeletonBar className="mx-auto mt-5 h-3 w-40 rounded-full" />
        </div>
      </div>
    </>
  );
}
