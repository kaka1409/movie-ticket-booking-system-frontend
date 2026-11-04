import ModifyPanelSkeleton from "@/app/(sub)/tickets/components/desktop/ModifyPanelSkeleton";
import { SkeletonBar } from "@/components/ui/Skeleton";

/**
 * Shape of the desktop showtime step: the slot the ticket is on, the cinema
 * search, the day strip and the eligible cards. The rail stays at identity + CTA
 * until a slot is picked.
 */
export default function ShowtimeSkeleton() {
  return (
    <ModifyPanelSkeleton>
      <div className="space-y-5">
        <SkeletonBar className="h-7 w-56 rounded-md" />

        <div>
          <SkeletonBar className="mb-2 h-2.5 w-32 rounded-full" />
          <div className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-surface) p-3">
            <div className="min-w-0 flex-1 space-y-1.5">
              <SkeletonBar className="h-3.5 w-40 rounded-full" />
              <SkeletonBar className="h-3 w-32 rounded-full" />
            </div>
            <SkeletonBar className="h-6 w-14 shrink-0 rounded-lg" />
          </div>
        </div>

        <SkeletonBar className="h-11 w-full rounded-xl" />

        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBar key={index} className="h-13 w-14 shrink-0 rounded-xl" />
          ))}
        </div>

        <div className="space-y-3">
          <SkeletonBar className="h-2.5 w-36 rounded-full" />

          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="space-y-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <SkeletonBar className="h-3.5 w-40 rounded-full" />
                  <SkeletonBar className="h-3 w-3/5 rounded-full" />
                </div>
                <SkeletonBar className="h-5 w-16 shrink-0 rounded-full" />
              </div>
              <div className="flex gap-2 pt-1">
                {Array.from({ length: 3 }).map((_, chipIndex) => (
                  <SkeletonBar key={chipIndex} className="h-8 w-16 rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModifyPanelSkeleton>
  );
}
