import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminListSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import { TicketsManagerSection } from "./sections";

export const metadata: Metadata = { title: "Tickets" };

/** Mirrors the BE `ADMIN_TICKET_SORT_FIELDS` whitelist. */
const TICKET_SORT_FIELDS = ["issuedAt", "status", "showtimeDate"];

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
    dir?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const status = params.status?.trim() ?? "";
  const dateFrom = params.dateFrom?.trim() ?? "";
  const dateTo = params.dateTo?.trim() ?? "";
  const sort = TICKET_SORT_FIELDS.find((candidate) => candidate === params.sort) ?? "";
  const dir = params.dir === "asc" || params.dir === "desc" ? params.dir : "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.tickets"
        titleKey="admin.tickets.title"
        descriptionKey="admin.tickets.description"
      />
      <Suspense fallback={<AdminListSkeleton filtersCard filterCardStyle="chips" columns={6} />}>
        <TicketsManagerSection
          search={search}
          status={status}
          dateFrom={dateFrom}
          dateTo={dateTo}
          sort={sort}
          dir={dir}
          page={page}
        />
      </Suspense>
    </>
  );
}
