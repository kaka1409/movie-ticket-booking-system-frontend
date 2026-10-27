/** Console loading state — header band + table shell, so the first paint of a
 * route already has the page's shape instead of a centred spinner. */
export default function AdminLoading() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className="mb-6 space-y-2">
        <div className="h-2.5 w-24 rounded-full bg-(--color-surface-2)" />
        <div className="h-6 w-48 rounded-lg bg-(--color-surface-2)" />
        <div className="h-3 w-full max-w-md rounded-lg bg-(--color-surface-2)" />
      </div>

      <div className="space-y-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-3">
        {Array.from({ length: 8 }, (_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-(--color-surface-2)" />
            <div className="h-3 flex-1 rounded-full bg-(--color-surface-2)" />
            <div className="hidden h-3 w-24 rounded-full bg-(--color-surface-2) sm:block" />
            <div className="hidden h-3 w-16 rounded-full bg-(--color-surface-2) md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
