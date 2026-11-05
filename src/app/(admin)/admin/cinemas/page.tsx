import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { CinemasManagerSection } from "./sections";

export const metadata: Metadata = { title: "Cinemas" };

/** Mirrors the map + table + floor-plan composition `CinemasManager` paints. */
function CinemasSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="h-[420px] animate-pulse rounded-2xl border border-(--color-border) bg-(--color-surface) lg:col-span-3" />
        <div className="animate-pulse space-y-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-3 lg:col-span-2">
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-(--color-surface-2)" />
              <div className="h-3 flex-1 rounded-full bg-(--color-surface-2)" />
              <div className="hidden h-3 w-16 rounded-full bg-(--color-surface-2) sm:block" />
            </div>
          ))}
        </div>
      </div>
      <div className="animate-pulse rounded-2xl border border-(--color-border) bg-(--color-surface)">
        <div className="h-14 border-b border-(--color-border) bg-(--color-surface-2)/50" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))] gap-2 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-20 rounded-xl border border-(--color-border) bg-(--color-surface-2)"
            />
          ))}
        </div>
        <div className="space-y-2 border-t border-(--color-border) p-4">
          <div className="mx-auto h-3.5 w-full max-w-2xl rounded-full bg-(--color-surface-2)" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-14 rounded-sm bg-(--color-surface-2)" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminCinemasPage() {
  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.cinema"
        titleKey="admin.cinemas.title"
        descriptionKey="admin.cinemas.description"
      />
      <Suspense fallback={<CinemasSkeleton />}>
        <CinemasManagerSection />
      </Suspense>
    </>
  );
}
