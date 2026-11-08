import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Desktop account page bodies. Field geometry follows `FormField` at its `md`
 * size: an 11px label over a 42px control (`py-2.5` ×2 + a 20px line + border).
 */

/** Desktop edit form layout beneath the shared account chrome. */
export function EditProfileDesktopSkeleton() {
  return (
    <div>
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
    </div>
  );
}

/** Desktop password form and guidance column beneath the shared account chrome. */
export function PasswordDesktopSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
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
      </div>

      <aside className="space-y-5">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </aside>
    </div>
  );
}

/** Desktop wishlist metrics, filters, and movie rows beneath the shared chrome. */
export function WishlistDesktopSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 divide-x divide-(--color-border)/50">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 px-3 py-1 sm:gap-4 sm:px-5">
            <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-6 w-12 rounded-md" />
              <Skeleton className="h-2.5 w-16 rounded-full" />
            </div>
          </div>
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
