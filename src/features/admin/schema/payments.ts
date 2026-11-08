import { z } from "zod";
import type { Translate } from "./shared";

/** Localised labels for one payment method; the live switch is a separate column. */
export function createPaymentMethodSchema(translate: Translate) {
  return z.object({
    nameEn: z
      .string()
      .trim()
      .min(1, translate("admin.paymentMethods.name_required"))
      .max(60, translate("admin.common.too_long")),
    nameVi: z.string().trim().max(60, translate("admin.common.too_long")),
    descriptionEn: z.string().trim().max(255, translate("admin.common.too_long")),
    descriptionVi: z.string().trim().max(255, translate("admin.common.too_long")),
    sortOrder: z.coerce
      .number({ error: translate("admin.common.number_required") })
      .int(translate("admin.common.number_required"))
      .min(0)
      .max(99),
    isActive: z.boolean(),
  });
}

export type AdminPaymentMethodFormValues = z.infer<ReturnType<typeof createPaymentMethodSchema>>;
