import { Skeleton } from "@/components/ui/Skeleton";
import {
  DesktopRailSkeleton,
  DesktopRecommendedSkeleton,
  DesktopReviewsSkeleton,
  MobileRecommendedSkeleton,
  MobileReviewsSkeleton,
  MobileShowtimesSkeleton,
} from "./components/MovieDetailSkeletons";

function CastMemberSkeleton() {
  return (
    <div className="shrink-0 flex flex-col items-center gap-2">
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="h-2.5 w-14 rounded-full" />
    </div>
  );
}

/**
 * Route fallback during navigation. The hero, synopsis and cast are drawn here
 * because they are part of the page shell; the showtimes and reviews blocks reuse
 * the very skeletons the page streams into, so the two can never drift apart.
 */
export default function MovieDetailLoading() {
  return (
    <>
      <MobileLoading />
      <DesktopLoading />
    </>
  );
}

function DesktopLoading() {
  return (
    <div className="hidden min-h-dvh bg-(--color-bg) md:block">
      <div className="mx-auto w-full max-w-screen-xl px-8 pt-6">
        <Skeleton className="h-[480px] w-full rounded-(--radius-lg)" />

        <div className="py-10">
          <div className="flex items-start gap-10">
            <div className="min-w-0 flex-1 space-y-10">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full rounded-full" />
                  <Skeleton className="h-3 w-full rounded-full" />
                  <Skeleton className="h-3 w-2/3 rounded-full" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-28 rounded-full" />
                <div className="flex flex-wrap gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-20 w-20 rounded-(--radius-lg)" />
                  ))}
                </div>
              </div>

              <DesktopReviewsSkeleton />
            </div>

            <div className="w-80 shrink-0">
              <DesktopRailSkeleton />
            </div>
          </div>
        </div>

        <DesktopRecommendedSkeleton />
      </div>
    </div>
  );
}

function MobileLoading() {
  return (
    <div className="min-h-dvh bg-(--color-bg) block md:hidden">
      <main className="pb-10">
        <div className="relative">
          <Skeleton className="h-85 w-full" />
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute top-5 left-4">
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
          <div className="absolute top-5 right-4">
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
          <div className="absolute bottom-6 left-4 right-4 flex gap-4">
            <Skeleton className="w-20 h-28 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4 rounded-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-8 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-10 rounded-md" />
                <Skeleton className="h-5 w-14 rounded-md" />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="w-14 h-14 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col gap-8 py-6 pb-12">
          <div className="space-y-3 px-(--space-md)">
            <Skeleton className="h-4 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="h-2.5 w-3/4 rounded-full" />
            </div>
          </div>

          <div className="space-y-3 px-(--space-md)">
            <Skeleton className="h-4 w-24 rounded-full" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, index) => (
                <CastMemberSkeleton key={index} />
              ))}
            </div>
          </div>

          <MobileShowtimesSkeleton />

          <div className="px-(--space-md)">
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>

          <MobileReviewsSkeleton />

          <MobileRecommendedSkeleton />
        </div>
      </main>
    </div>
  );
}
