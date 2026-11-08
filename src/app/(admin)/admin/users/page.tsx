import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminListSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import { UsersManagerSection } from "./sections";

export const metadata: Metadata = { title: "Users" };

/** Mirrors the BE `ADMIN_USER_SORT_FIELDS` whitelist. */
const USER_SORT_FIELDS = ["fullname", "email", "role", "status", "createdAt"];

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    role?: string;
    status?: string;
    sort?: string;
    dir?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const role = params.role?.trim() ?? "";
  const status = params.status?.trim() ?? "";
  const sort = USER_SORT_FIELDS.find((candidate) => candidate === params.sort) ?? "";
  const dir = params.dir === "asc" || params.dir === "desc" ? params.dir : "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.users"
        titleKey="admin.users.title"
        descriptionKey="admin.users.description"
      />
      <Suspense fallback={<AdminListSkeleton filtersCard filterCardStyle="chips" columns={5} />}>
        <UsersManagerSection
          search={search}
          role={role}
          status={status}
          sort={sort}
          dir={dir}
          page={page}
        />
      </Suspense>
    </>
  );
}
