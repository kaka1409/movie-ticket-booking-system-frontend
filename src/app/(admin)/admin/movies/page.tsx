import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminTableSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import type { AdminMovieStatus } from "@/features/admin/types";
import { MoviesManagerSection } from "./sections";

export const metadata: Metadata = { title: "Movies" };

const STATUSES: AdminMovieStatus[] = ["now_showing", "coming_soon", "ended"];

/**
 * Awaits `searchParams` only (the query IS the page's identity), so the header
 * and the filter row paint before the movie list streams in.
 */
export default async function AdminMoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const status = STATUSES.find((candidate) => candidate === params.status) ?? "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.cinema"
        titleKey="admin.movies.title"
        descriptionKey="admin.movies.description"
      />
      <Suspense fallback={<AdminTableSkeleton />}>
        <MoviesManagerSection search={search} status={status} page={page} />
      </Suspense>
    </>
  );
}
