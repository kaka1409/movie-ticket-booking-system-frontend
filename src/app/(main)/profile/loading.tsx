import { Skeleton, SkeletonCard } from "@/components/common/Skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-dvh bg-(--color-bg) block md:hidden">
      <main className="flex flex-col items-center px-(--space-md) pt-4 pb-10">
        {/* Avatar */}
        <Skeleton className="w-28 h-28 rounded-full" />

        {/* Name + badge */}
        <Skeleton className="mt-4 h-5 w-36 rounded-full" />
        <Skeleton className="mt-2 h-6 w-28 rounded-full" />

        {/* Menu sections */}
        <div className="mt-8 w-full space-y-6">
          <SkeletonCard>
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-20 rounded-full" />
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 py-3">
                  <Skeleton className="w-5 h-5 rounded-md" />
                  <Skeleton className="h-3 w-32 rounded-full" />
                </div>
              ))}
            </div>
          </SkeletonCard>
          <SkeletonCard>
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-20 rounded-full" />
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 py-3">
                  <Skeleton className="w-5 h-5 rounded-md" />
                  <Skeleton className="h-3 w-32 rounded-full" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Logout button */}
        <Skeleton className="mt-8 h-12 w-full rounded-2xl" />
      </main>
    </div>
  );
}
