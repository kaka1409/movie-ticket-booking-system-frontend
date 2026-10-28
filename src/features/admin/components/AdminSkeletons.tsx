/**
 * Console fallbacks. The header band and the table shell are the two shapes
 * every console route starts with, so both the route `loading.tsx` and the
 * in-page boundary that streams a manager compose these instead of forking the
 * markup.
 */
export function AdminHeaderSkeleton() {
  return (
    <div className="mb-6 space-y-2" aria-hidden>
      <div className="h-2.5 w-24 animate-pulse rounded-full bg-(--color-surface-2)" />
      <div className="h-6 w-48 animate-pulse rounded-lg bg-(--color-surface-2)" />
      <div className="h-3 w-full max-w-md animate-pulse rounded-lg bg-(--color-surface-2)" />
    </div>
  );
}

/** Table/manager shell: `rows` skeleton lines inside the console card. */
export function AdminTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div
      className="animate-pulse space-y-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-3"
      aria-hidden
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 rounded-lg bg-(--color-surface-2)" />
          <div className="h-3 flex-1 rounded-full bg-(--color-surface-2)" />
          <div className="hidden h-3 w-24 rounded-full bg-(--color-surface-2) sm:block" />
          <div className="hidden h-3 w-16 rounded-full bg-(--color-surface-2) md:block" />
        </div>
      ))}
    </div>
  );
}
