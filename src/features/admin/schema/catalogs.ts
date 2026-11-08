import { z } from "zod";
import type { Translate } from "./shared";

/** Genres, formats and age ratings share one payload. */
export function createCatalogSchema(translate: Translate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, translate("admin.catalogs.name_required"))
      .max(60, translate("admin.catalogs.name_too_long")),
    nameVi: z.string().trim().max(60, translate("admin.catalogs.name_too_long")),
    sortOrder: z.coerce
      .number({ error: translate("admin.common.number_required") })
      .int(translate("admin.common.number_required"))
      .min(0)
      .max(999),
    isActive: z.boolean(),
  });
}

export type AdminCatalogFormValues = z.infer<ReturnType<typeof createCatalogSchema>>;
