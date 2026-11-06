export default function SettingsSkeleton() {
  return (
    <div
      className="animate-pulse rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 space-y-6"
      aria-hidden
    >
      <section>
        <div className="mb-2 h-3.5 w-24 rounded bg-(--color-surface-2)" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-24 rounded-xl border border-(--color-border) bg-(--color-surface-2)"
            />
          ))}
        </div>
      </section>
      <section>
        <div className="mb-2 h-3.5 w-24 rounded bg-(--color-surface-2)" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-28 rounded-xl border border-(--color-border) bg-(--color-surface-2)"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
