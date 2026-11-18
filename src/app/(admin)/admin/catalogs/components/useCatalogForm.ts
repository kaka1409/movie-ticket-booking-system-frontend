"use client";

import { createCatalogSchema } from "@/features/admin/schema";
import {
  createCatalogEntryAction,
  updateCatalogEntryAction,
} from "@/features/admin/actions/catalogs.action";
import { useAdminForm } from "@/features/admin/hooks/useAdminForm";
import { catalogSample } from "@/features/admin/samples";
import type { AdminCatalogEntry, AdminCatalogKind } from "@/features/admin/types";

export interface CatalogFormState {
  name: string;
  nameVi: string;
  sortOrder: string;
  isActive: boolean;
}

function toFormState(entry: AdminCatalogEntry | null): CatalogFormState {
  return entry
    ? {
        name: entry.name,
        nameVi: entry.nameVi ?? "",
        sortOrder: String(entry.sortOrder),
        isActive: entry.isActive,
      }
    : { name: "", nameVi: "", sortOrder: "0", isActive: true };
}

/**
 * Catalog form state + wire payload — one shape serves all three kinds
 * (genres/formats/age-ratings) and both surfaces (create dialog,
 * expandable-row editor), like `useMovieForm`.
 */
export function useCatalogForm({
  kind,
  entry,
  resetKey,
  onSaved,
}: {
  kind: AdminCatalogKind;
  entry: AdminCatalogEntry | null;
  resetKey: string;
  onSaved: () => void;
}) {
  return useAdminForm({
    entity: entry,
    resetKey,
    onSaved,
    toFormState,
    schema: createCatalogSchema,
    sample: () => {
      const sample = catalogSample(kind);
      return {
        name: String(sample.name ?? ""),
        nameVi: String(sample.nameVi ?? ""),
        sortOrder: String(sample.sortOrder ?? "0"),
        isActive: sample.isActive === true,
      };
    },
    persist: ({ token, entity, data }) => {
      const payload = {
        name: data.name,
        nameVi: data.nameVi === "" ? null : data.nameVi,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      };

      return entity
        ? updateCatalogEntryAction(token, kind, entity.id, payload)
        : createCatalogEntryAction(token, kind, payload);
    },
  });
}
