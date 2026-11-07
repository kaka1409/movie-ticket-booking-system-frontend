import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminListSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import { TransactionsManagerSection } from "./sections";

export const metadata: Metadata = { title: "Transactions" };

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
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.transactions"
        titleKey="admin.transactions.title"
        descriptionKey="admin.transactions.description"
      />
      <Suspense fallback={<AdminListSkeleton search select apply total action columns={7} />}>
        <TransactionsManagerSection
          search={search}
          status={status}
          paymentStatus={paymentStatus}
          paymentMethod={paymentMethod}
          dateFrom={dateFrom}
          dateTo={dateTo}
          page={page}
        />
      </Suspense>
    </>
  );
}
