import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminListSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import { TransactionsManagerSection } from "./sections";

export const metadata: Metadata = { title: "Transactions" };

/** Mirrors the BE `ADMIN_TRANSACTION_SORT_FIELDS` whitelist. */
const TRANSACTION_SORT_FIELDS = ["createdAt", "totalPrice", "status", "showtimeDate"];

export default async function AdminTransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
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
  const paymentStatus = params.paymentStatus?.trim() ?? "";
  const paymentMethod = params.paymentMethod?.trim() ?? "";
  const dateFrom = params.dateFrom?.trim() ?? "";
  const dateTo = params.dateTo?.trim() ?? "";
  const sort = TRANSACTION_SORT_FIELDS.find((candidate) => candidate === params.sort) ?? "";
  const dir = params.dir === "asc" || params.dir === "desc" ? params.dir : "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.transactions"
        titleKey="admin.transactions.title"
        descriptionKey="admin.transactions.description"
      />
      <Suspense fallback={<AdminListSkeleton filtersCard filterCardStyle="chips" columns={8} />}>
        <TransactionsManagerSection
          search={search}
          status={status}
          paymentStatus={paymentStatus}
          paymentMethod={paymentMethod}
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
