import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminTableSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import { ShowtimesManagerSection } from "./sections";

export const metadata: Metadata = { title: "Showtimes" };

export default async function AdminShowtimesPage({
  searchParams,
}: {
  searchParams: Promise<{ movie?: string; date?: string }>;
}) {
  const params = await searchParams;
  const movie = params.movie?.trim() ?? "";
  const date = params.date?.trim() ?? "";

  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.cinema"
        titleKey="admin.showtimes.title"
        descriptionKey="admin.showtimes.description"
      />
      <Suspense fallback={<AdminTableSkeleton />}>
        <ShowtimesManagerSection movie={movie} date={date} />
      </Suspense>
    </>
  );
}
