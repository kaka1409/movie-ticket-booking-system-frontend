export default function MovieResearchSkeleton() {
  return (
    <div className="space-y-5" aria-hidden>
      <section className="animate-pulse rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-(--color-surface-2)" />
            <div className="h-3 w-56 rounded bg-(--color-surface-2)" />
          </div>
          <div className="h-9 w-28 rounded-xl border border-(--color-border) bg-(--color-surface-2)" />
        </div>
        <div className="mt-4 h-3 w-64 rounded bg-(--color-surface-2)" />
      </section>

      <div className="flex items-center gap-2">
        <div className="h-3 w-12 rounded bg-(--color-surface-2)" />
        <div className="h-9 w-32 rounded-xl border border-(--color-border) bg-(--color-surface-2)" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <article
            key={index}
            className="animate-pulse overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)"
          >
            <div className="flex gap-4 p-4">
              <div className="h-36 w-24 shrink-0 rounded-lg bg-(--color-surface-2)" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-(--color-surface-2)" />
                <div className="h-3 w-1/2 rounded bg-(--color-surface-2)" />
                <div className="h-3 w-full rounded bg-(--color-surface-2)" />
                <div className="h-3 w-2/3 rounded bg-(--color-surface-2)" />
              </div>
            </div>
            <div className="border-t border-(--color-border) p-3">
              <div className="h-3 w-20 rounded bg-(--color-surface-2)" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
