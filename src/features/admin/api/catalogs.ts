import { apiFetch, type ApiResponse } from "@/libs/api";
import type { AdminCatalogEntry, AdminCatalogKind } from "../types";
import { ADMIN_NO_STORE, adminCookie } from "./shared";

/** Usage counts differ per catalog; the screens only ever need "is it used". */
export async function getAdminCatalog(
  kind: AdminCatalogKind,
): Promise<ApiResponse<AdminCatalogEntry[]>> {
  const result = await apiFetch<
    (AdminCatalogEntry & { movieCount?: number; showtimeCount?: number })[]
  >(`/admin/${kind}`, ADMIN_NO_STORE, undefined, await adminCookie());

  if ("error" in result) return result;

  return {
    data: result.data.map((row) => ({
      id: row.id,
      name: row.name,
      nameVi: row.nameVi ?? null,
      sortOrder: row.sortOrder,
      isActive: row.isActive,
      usageCount: row.movieCount ?? row.showtimeCount ?? 0,
    })),
  };
}
