function CardShell({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 ${className}`}
      aria-hidden
    >
      {children}
    </div>
  );
}

function CardHeader({ width = "w-40" }: { width?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-8 w-8 rounded-lg bg-(--color-surface-2)" />
      <div className={`h-4 ${width} rounded bg-(--color-surface-2)`} />
    </div>
  );
}

/** Action queue card: header + 5 count tiles. */
export function ActionQueueSkeleton() {
  return (
    <CardShell>
      <CardHeader width="w-44" />
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-[52px] rounded-xl border border-(--color-border)/60 bg-(--color-surface-2)/30"
          />
        ))}
      </div>
    </CardShell>
  );
}

/** KPI card: header + filter, 8 metric tiles, dual charts. */
export function KpiSectionSkeleton() {
  return (
    <CardShell>
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
    </CardShell>
  );
}

/** Top box office table: header + 5 ranking rows. */
export function TopMoviesSkeleton() {
  return (
    <CardShell className="h-[400px]">
      <CardHeader width="w-48" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-12 rounded-xl bg-(--color-surface-2)/50" />
        ))}
      </div>
    </CardShell>
  );
}

/** Live showtimes monitor rows. */
export function LiveShowtimesSkeleton() {
  return (
    <CardShell className="h-[360px]">
      <CardHeader width="w-40" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-14 rounded-xl bg-(--color-surface-2)/50" />
        ))}
      </div>
    </CardShell>
  );
}

/** Recent bookings feed rows. */
export function LiveBookingsSkeleton() {
  return (
    <CardShell className="h-[360px]">
      <CardHeader width="w-36" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-16 rounded-xl bg-(--color-surface-2)/50" />
        ))}
      </div>
    </CardShell>
  );
}

/** Payment health: header + method rows. */
export function PaymentHealthSkeleton() {
  return (
    <CardShell>
      <CardHeader width="w-44" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-14 rounded-xl bg-(--color-surface-2)/50" />
        ))}
      </div>
    </CardShell>
  );
}

/**
 * Whole-page fallback for the `(admin)` segment `loading.tsx`: the same
 * composition the dashboard streams in, one skeleton per widget.
 */
export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <ActionQueueSkeleton />
      <KpiSectionSkeleton />
      <TopMoviesSkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <LiveShowtimesSkeleton />
        </div>
        <div className="lg:col-span-5">
          <LiveBookingsSkeleton />
        </div>
      </div>
      <PaymentHealthSkeleton />
    </div>
  );
}
