"use server";

import { mutateAdmin } from "../mutation";
import type {
  AdminActionResult,
  AdminCatalogEntry,
  AdminCatalogInput,
  AdminCatalogKind,
} from "../types";

/**
 * Genres, formats and age ratings share one CRUD contract on the backend, so
 * they share one action set here — `kind` is the URL segment, never a table
 * name, which keeps the route the only source of truth.
 */
export async function createCatalogEntryAction(
  token: string,
  kind: AdminCatalogKind,
  input: AdminCatalogInput,
): Promise<AdminActionResult<AdminCatalogEntry>> {
  return mutateAdmin<AdminCatalogEntry>("POST", `/admin/${kind}`, token, input);
}

export async function updateCatalogEntryAction(
  token: string,
  kind: AdminCatalogKind,
  id: string,
  input: AdminCatalogInput,
): Promise<AdminActionResult<AdminCatalogEntry>> {
  return mutateAdmin<AdminCatalogEntry>("PATCH", `/admin/${kind}/${id}`, token, input);
}

export async function deleteCatalogEntryAction(
  token: string,
  kind: AdminCatalogKind,
  id: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/admin/${kind}/${id}`, token);
}
