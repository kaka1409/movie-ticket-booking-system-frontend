"use client";

import { createFoodItemSchema } from "@/features/admin/schema";
import { createFoodItemAction, updateFoodItemAction } from "@/features/admin/actions/food.action";
import { useAdminForm } from "@/features/admin/hooks/useAdminForm";
import { ADMIN_FORM_SAMPLES } from "@/features/admin/samples";
import type { AdminFoodItem } from "@/features/admin/types";

export interface FoodFormState {
  name: string;
  nameVi: string;
  category: string;
  price: string;
  image: string;
  isActive: boolean;
}

const EMPTY_FORM: FoodFormState = {
  name: "",
  nameVi: "",
  category: "",
  price: "",
  image: "",
  isActive: true,
};

function toFormState(item: AdminFoodItem | null): FoodFormState {
  if (!item) return EMPTY_FORM;

  return {
    name: item.name,
    nameVi: item.nameVi ?? "",
    category: item.category,
    price: String(item.price),
    image: item.image ?? "",
    isActive: item.isActive,
  };
}

/**
 * Snack form state + wire payload, used by BOTH the create dialog and the
 * expandable-row editor so validation and the payload cannot drift.
 */
export function useFoodForm({
  item,
  resetKey,
  onSaved,
}: {
  item: AdminFoodItem | null;
  resetKey: string;
  onSaved: () => void;
}) {
  return useAdminForm({
    entity: item,
    resetKey,
    onSaved,
    toFormState,
    schema: createFoodItemSchema,
    sample: () => {
      const sample = ADMIN_FORM_SAMPLES.food;
      return {
        name: sample.name,
        nameVi: sample.nameVi,
        category: sample.category,
        price: sample.price,
        image: sample.image,
        isActive: sample.isActive,
      };
    },
    persist: ({ token, entity, data: form }) => {
      const base = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        isActive: form.isActive,
        ...(form.nameVi === "" ? {} : { nameVi: form.nameVi }),
        ...(form.image === "" ? {} : { image: form.image }),
      };

      return entity
        ? updateFoodItemAction(token, entity.id, {
            ...base,
            // `image` is the only nullable column here; "" would be rejected.
            ...(form.image === "" ? { image: null } : {}),
          })
        : createFoodItemAction(token, base);
    },
  });
}
