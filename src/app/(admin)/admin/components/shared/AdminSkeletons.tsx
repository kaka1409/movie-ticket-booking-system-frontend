const ADMIN_PAGE_SIZE = 10;

/** Header band matching `AdminPageHeader` (eyebrow + gold bar + title + desc). */
export function AdminHeaderSkeleton() {
  return (
    <div className="mb-6 space-y-2" aria-hidden>
      <div className="h-2.5 w-24 animate-pulse rounded-full bg-(--color-surface-2)" />
      <div className="flex items-center gap-2.5">
        <div className="h-5 w-1 shrink-0 rounded-full bg-(--color-gold)" />
        <div className="h-6 w-48 animate-pulse rounded-lg bg-(--color-surface-2)" />
      </div>
      <div className="h-3 w-full max-w-md animate-pulse rounded-lg bg-(--color-surface-2)" />
    </div>
  );
}

/** Real `<table>` skeleton: a card with `rows` rows, `columns` cells each. */
export function AdminTableSkeleton({
  columns = 5,
  rows = ADMIN_PAGE_SIZE,
}: {
  columns?: number;
  rows?: number;
}) {
  return (
    <div
      className="animate-pulse overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)"
      aria-hidden
    >
      <table className="admin-table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index}>
                <div className="h-3 w-16 rounded bg-(--color-surface-2)" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((__, cellIndex) => (
                <td key={cellIndex} data-label=" ">
                  <div className="h-3 rounded-full bg-(--color-surface-2)" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminSkeletonSearch({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-9 animate-pulse rounded-xl border border-(--color-border) bg-(--color-surface-2) ${className}`}
      aria-hidden
    />
  );
}

export function AdminSkeletonSelect({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-9 w-32 animate-pulse rounded-xl border border-(--color-border) bg-(--color-surface-2) ${className}`}
      aria-hidden
    />
  );
}

export function AdminSkeletonButton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-9 w-24 animate-pulse rounded-xl border border-(--color-border) bg-(--color-surface-2) ${className}`}
      aria-hidden
    />
  );
}

export function AdminSkeletonTabs({ count = 3 }: { count?: number }) {
  return (
    <div className="mb-3 flex gap-1" aria-hidden>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-8 w-24 animate-pulse rounded-xl bg-(--color-surface-2)"
        />
      ))}
    </div>
  );
}

export function AdminPagerSkeleton() {
  return (
    <div
      className="mt-3 flex animate-pulse items-center justify-between gap-3"
      aria-hidden
    >
      <div className="h-3 w-20 rounded bg-(--color-surface-2)" />
      <div className="flex gap-1.5">
        <div className="h-8 w-20 rounded-xl border border-(--color-border) bg-(--color-surface-2)" />
        <div className="h-8 w-20 rounded-xl border border-(--color-border) bg-(--color-surface-2)" />
      </div>
    </div>
  );
}

/** Filter card matching `MovieFiltersCard` (search+New row + 5-column field grid + footer). */
export function AdminFilterCardSkeleton() {
  return (
    <div
      className="mb-3 animate-pulse rounded-2xl border border-(--color-border) bg-(--color-surface) p-3"
      aria-hidden
    >
      <div className="flex items-center gap-2">
        <div className="h-9 flex-1 rounded-xl border border-(--color-border) bg-(--color-surface-2)" />
        <div className="h-9 w-24 rounded-xl border border-(--color-border) bg-(--color-surface-2)" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-(--color-border) pt-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-1.5">
            <div className="h-2.5 w-16 rounded bg-(--color-surface-2)" />
            <div className="h-9 rounded-xl border border-(--color-border) bg-(--color-surface-2)" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2 border-t border-(--color-border) pt-3">
        <div className="h-9 w-20 rounded-xl border border-(--color-border) bg-(--color-surface-2)" />
        <div className="h-9 w-24 rounded-xl border border-(--color-border) bg-(--color-surface-2)" />
      </div>
    </div>
  );
}

/**
 * Parameterised list-page skeleton: toolbar shape + optional tabs/filter card +
 * table + optional pager. Used by catalogs/food/combos/users/reviews/movies.
 */
export function AdminListSkeleton({
  tabs = false,
  search = true,
  total = true,
  select = false,
  apply = false,
  action = true,
  filtersCard = false,
  columns = 5,
  rows = ADMIN_PAGE_SIZE,
  pager = true,
}: {
  tabs?: number | false;
  search?: boolean;
  total?: boolean;
  select?: boolean;
  apply?: boolean;
  action?: boolean;
  filtersCard?: boolean;
  columns?: number;
  rows?: number;
  pager?: boolean;
}) {
  return (
    <div className="space-y-0" aria-hidden>
      {tabs ? <AdminSkeletonTabs count={tabs} /> : null}

      {filtersCard ? (
        <AdminFilterCardSkeleton />
      ) : (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {search ? <AdminSkeletonSearch className="w-full sm:max-w-xs" /> : null}
          {select ? <AdminSkeletonSelect /> : null}
          {apply ? <AdminSkeletonButton /> : null}
          {total ? (
            <div className="h-3 w-24 animate-pulse rounded bg-(--color-surface-2)" />
          ) : null}
          {action ? <AdminSkeletonButton className="ml-auto" /> : null}
        </div>
      )}

      <AdminTableSkeleton columns={columns} rows={rows} />

      {pager ? <AdminPagerSkeleton /> : null}
    </div>
  );
}
