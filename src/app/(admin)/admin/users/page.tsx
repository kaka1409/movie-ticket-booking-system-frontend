import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminListSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import { UsersManagerSection } from "./sections";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const role = params.role?.trim() ?? "";
  const status = params.status?.trim() ?? "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.users"
        titleKey="admin.users.title"
        descriptionKey="admin.users.description"
      />
      <Suspense fallback={<AdminListSkeleton search select apply total action columns={5} />}>
        <UsersManagerSection search={search} role={role} status={status} page={page} />
      </Suspense>
    </>
  );
}
