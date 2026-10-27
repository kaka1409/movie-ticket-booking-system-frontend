import type { Metadata } from "next";
import LoginPrompt from "@/components/shared/LoginPrompt";
import AdminDataError from "@/features/admin/components/AdminDataError";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import { getAdminCatalog } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import type { AdminCatalogEntry, AdminCatalogKind } from "@/features/admin/types";
import CatalogsManager from "./components/CatalogsManager";

export const metadata: Metadata = { title: "Catalogs" };

export default async function AdminCatalogsPage() {
  const [genres, formats, ageRatings] = await Promise.all([
    getAdminCatalog("genres"),
    getAdminCatalog("formats"),
    getAdminCatalog("age-ratings"),
  ]);

  const results = [genres, formats, ageRatings];

  if (results.some((result) => isUnauthorizedResult(result))) return <LoginPrompt />;

  const failed = results.find((result) => "error" in result);
  if (failed && "error" in failed) {
    return (
      <>
        <AdminPageHeader
          eyebrowKey="admin.nav.cinema"
          titleKey="admin.catalogs.title"
          descriptionKey="admin.catalogs.description"
        />
        <AdminDataError message={failed.error.message} />
      </>
    );
  }

  const pickEntries = (result: typeof genres): AdminCatalogEntry[] =>
    "data" in result ? result.data : [];

  const entriesByKind: Record<AdminCatalogKind, AdminCatalogEntry[]> = {
    genres: pickEntries(genres),
    formats: pickEntries(formats),
    "age-ratings": pickEntries(ageRatings),
  };

  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.cinema"
        titleKey="admin.catalogs.title"
        descriptionKey="admin.catalogs.description"
      />
      <CatalogsManager entriesByKind={entriesByKind} />
    </>
  );
}
