import { z } from "zod";
import { CATEGORY_TOKEN_PATTERN, requiredAmount, type Translate } from "./shared";

/** Snack row. `category` is an open lowercase token, not an enum. */
export function createFoodItemSchema(translate: Translate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, translate("admin.food.name_required"))
      .max(255, translate("admin.common.too_long")),
    nameVi: z.string().trim().max(255, translate("admin.common.too_long")),
    category: z
      .string()
      .trim()
      .min(1, translate("admin.food.category_required"))
      .max(60, translate("admin.common.too_long"))
      .refine(
        (value) => CATEGORY_TOKEN_PATTERN.test(value),
        translate("admin.food.category_invalid"),
      ),
    price: requiredAmount(translate("admin.food.price_required")),
    image: z.string().trim().max(1024, translate("admin.common.too_long")),
    isActive: z.boolean(),
  });
}

export type AdminFoodItemFormValues = z.infer<ReturnType<typeof createFoodItemSchema>>;

/** Combos are standalone catalog rows — they never reference a snack. */
export function createComboSchema(translate: Translate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, translate("admin.combos.name_required"))
      .max(255, translate("admin.common.too_long")),
    nameVi: z.string().trim().max(255, translate("admin.common.too_long")),
    description: z.string().trim().max(2048, translate("admin.common.too_long")),
    descriptionVi: z.string().trim().max(2048, translate("admin.common.too_long")),
    price: requiredAmount(translate("admin.combos.price_required")),
    image: z.string().trim().max(1024, translate("admin.common.too_long")),
    tag: z.string().trim().max(60, translate("admin.common.too_long")),
    isActive: z.boolean(),
  });
}

export type AdminComboFormValues = z.infer<ReturnType<typeof createComboSchema>>;
