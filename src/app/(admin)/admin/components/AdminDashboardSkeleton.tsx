/**
 * Skeleton placeholder for the entire admin dashboard while metrics stream in.
 */
export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4"
          >
            <div className="h-3 w-24 rounded bg-(--color-surface-2)" />
            <div className="mt-3 h-6 w-36 rounded bg-(--color-surface-2)" />
            <div className="mt-4 flex items-center justify-between">
              <div className="h-3 w-16 rounded bg-(--color-surface-2)" />
              <div className="h-8 w-24 rounded bg-(--color-surface-2)" />
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Analytics Chart & Top Movies */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="h-[400px] rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:col-span-7 xl:col-span-8">
          <div className="h-4 w-48 rounded bg-(--color-surface-2)" />
          <div className="mt-6 h-[300px] rounded-xl bg-(--color-surface-2)/50" />
        </div>
        <div className="h-[400px] rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:col-span-5 xl:col-span-4">
          <div className="h-4 w-36 rounded bg-(--color-surface-2)" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-12 rounded-xl bg-(--color-surface-2)/50" />
            ))}
          </div>
        </div>
      </div>

      {/* Operations Row: Showtimes & Bookings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="h-[360px] rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:col-span-7">
          <div className="h-4 w-40 rounded bg-(--color-surface-2)" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-14 rounded-xl bg-(--color-surface-2)/50" />
            ))}
          </div>
        </div>
        <div className="h-[360px] rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:col-span-5">
          <div className="h-4 w-36 rounded bg-(--color-surface-2)" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-16 rounded-xl bg-(--color-surface-2)/50" />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="h-32 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
        <div className="h-4 w-32 rounded bg-(--color-surface-2)" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-16 rounded-xl bg-(--color-surface-2)/50" />
          ))}
        </div>
      </div>
    </div>
  );
}
