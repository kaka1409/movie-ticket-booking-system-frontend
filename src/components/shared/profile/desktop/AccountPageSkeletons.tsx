import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Desktop account page bodies. Field geometry follows `FormField` at its `md`
 * size: an 11px label over a 42px control (`py-2.5` ×2 + a 20px line + border).
 */

/** Desktop edit form layout beneath the shared account chrome. */
export function EditProfileDesktopSkeleton() {
  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card) lg:p-8">
      <div className="mb-6 border-b border-(--color-border)/50 pb-4">
        <Skeleton className="h-7 w-52 rounded-md" />
        <Skeleton className="mt-2 h-3.5 w-72 max-w-full rounded-full" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="mb-1.5 h-[11px] w-24 rounded-full" />
            <Skeleton className="h-[42px] w-full rounded-xl" />
            {(index === 1 || index === 3) && (
              <Skeleton className="mt-1.5 h-[10px] w-48 max-w-full rounded-full" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-(--color-border)/60 bg-(--color-surface-2)/60 px-4 py-3">
        <Skeleton className="h-3.5 w-3.5 shrink-0 rounded-sm" />
        <Skeleton className="h-3 w-64 max-w-full rounded-full" />
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-(--color-border) pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-3 w-28 rounded-full" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </section>
  );
}

/** Desktop password form and guidance column beneath the shared account chrome. */
export function PasswordDesktopSkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card) lg:p-8">
          <div className="mb-6 border-b border-(--color-border)/50 pb-4">
            <Skeleton className="h-7 w-48 rounded-md" />
            <Skeleton className="mt-2 h-3.5 w-72 max-w-full rounded-full" />
          </div>

          <div className="flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="mb-1.5 h-[11px] w-28 rounded-full" />
                <Skeleton className="h-[42px] w-full rounded-xl" />
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-(--color-border) pt-6 sm:flex-row sm:justify-end">
            <Skeleton className="h-10 w-24 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
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
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-52 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
