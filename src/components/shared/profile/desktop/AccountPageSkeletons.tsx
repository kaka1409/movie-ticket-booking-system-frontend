import { Skeleton } from "@/components/ui/Skeleton";

/** Desktop edit form layout beneath the shared account chrome. */
export function EditProfileDesktopSkeleton() {
  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 lg:p-8">
      <Skeleton className="mb-2 h-6 w-52 rounded-md" />
      <Skeleton className="mb-6 h-4 w-72 max-w-full rounded-full" />
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="h-12 w-full rounded-xl" />
            {index === 1 && <Skeleton className="h-3 w-48 rounded-full" />}
          </div>
        ))}
      </div>
      <Skeleton className="mt-6 h-12 w-full rounded-xl" />
      <div className="mt-8 flex justify-end gap-3 border-t border-(--color-border) pt-6">
        <Skeleton className="h-11 w-28 rounded-xl" />
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
    </section>
  );
}

/** Desktop password form and guidance column beneath the shared account chrome. */
export function PasswordDesktopSkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 lg:p-8">
          <Skeleton className="mb-2 h-6 w-48 rounded-md" />
          <Skeleton className="mb-6 h-4 w-72 max-w-full rounded-full" />
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-32 rounded-full" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end gap-3 border-t border-(--color-border) pt-6">
            <Skeleton className="h-11 w-28 rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-xl" />
          </div>
        </section>
        <aside className="space-y-5">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </aside>
      </div>
    </div>
  );
}

/** Desktop wishlist metrics, filters, and movie rows beneath the shared chrome. */
export function WishlistDesktopSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 rounded-2xl" />
        ))}
      </div>
      <div className="flex flex-col gap-4 border-b border-(--color-border)/50 pb-5 lg:flex-row lg:justify-between">
        <Skeleton className="h-10 w-72 max-w-full rounded-xl" />
        <Skeleton className="h-10 w-80 max-w-full rounded-xl" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-44 rounded-2xl" />
      ))}
    </div>
  );
}
