/**
 * Skeleton placeholder for the entire admin dashboard while metrics stream in.
 */
export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Overview card: header + filter, 8 metric tiles, dual charts */}
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 rounded bg-(--color-surface-2)" />
          <div className="h-7 w-36 rounded-lg bg-(--color-surface-2)" />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-2xl border border-(--color-border)/70 bg-(--color-surface-2)/30 p-4"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-(--color-surface-2)" />
                <div className="h-3 w-20 rounded bg-(--color-surface-2)" />
              </div>
              <div className="flex items-end justify-between gap-2">
                <div className="h-6 w-24 rounded bg-(--color-surface-2)" />
                <div className="h-5 w-14 rounded-full bg-(--color-surface-2)" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="h-[380px] rounded-2xl border border-(--color-border)/70 bg-(--color-surface-2)/30 p-5">
            <div className="h-4 w-32 rounded bg-(--color-surface-2)" />
            <div className="mt-4 h-64 rounded-xl bg-(--color-surface-2)/50" />
          </div>
          <div className="h-[380px] rounded-2xl border border-(--color-border)/70 bg-(--color-surface-2)/30 p-5">
            <div className="h-4 w-40 rounded bg-(--color-surface-2)" />
            <div className="mt-4 h-64 rounded-xl bg-(--color-surface-2)/50" />
          </div>
        </div>
      </div>

      {/* Top Movies ranking — full width */}
      <div className="h-[400px] rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
        <div className="h-4 w-48 rounded bg-(--color-surface-2)" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-12 rounded-xl bg-(--color-surface-2)/50" />
          ))}
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

    </div>
  );
}
