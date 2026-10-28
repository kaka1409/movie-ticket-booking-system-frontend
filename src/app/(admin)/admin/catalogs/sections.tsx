import AdminDataError from "@/features/admin/components/AdminDataError";
import { getAdminCatalog } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import type { AdminCatalogEntry, AdminCatalogKind } from "@/features/admin/types";
import CatalogsManager from "./components/CatalogsManager";

/**
 * The three catalog reads behind one boundary. The page header paints first;
 * this streams the manager in. A revoked session renders nothing — the console
 * layout owns the prompt.
 */
export async function CatalogsManagerSection() {
  const [genres, formats, ageRatings] = await Promise.all([
    getAdminCatalog("genres"),
    getAdminCatalog("formats"),
    getAdminCatalog("age-ratings"),
  ]);

  const results = [genres, formats, ageRatings];

  if (results.some((result) => isUnauthorizedResult(result))) return null;

  const failed = results.find((result) => "error" in result);
  if (failed && "error" in failed) return <AdminDataError message={failed.error.message} />;

  const pickEntries = (result: typeof genres): AdminCatalogEntry[] =>
    "data" in result ? result.data : [];

  const entriesByKind: Record<AdminCatalogKind, AdminCatalogEntry[]> = {
    genres: pickEntries(genres),
    formats: pickEntries(formats),
    "age-ratings": pickEntries(ageRatings),
  };

  return <CatalogsManager entriesByKind={entriesByKind} />;
}
