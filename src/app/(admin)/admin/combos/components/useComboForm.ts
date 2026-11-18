"use client";

import { createComboSchema } from "@/features/admin/schema";
import { createComboAction, updateComboAction } from "@/features/admin/actions/food.action";
import { useAdminForm } from "@/features/admin/hooks/useAdminForm";
import { ADMIN_FORM_SAMPLES } from "@/features/admin/samples";
import type { AdminCombo } from "@/features/admin/types";

export interface ComboFormState {
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  price: string;
  image: string;
  tag: string;
  isActive: boolean;
}

const EMPTY_FORM: ComboFormState = {
  name: "",
  nameVi: "",
  description: "",
  descriptionVi: "",
  price: "",
  image: "",
  tag: "",
  isActive: true,
};

function toFormState(combo: AdminCombo | null): ComboFormState {
  if (!combo) return EMPTY_FORM;

  return {
    name: combo.name,
    nameVi: combo.nameVi ?? "",
    description: combo.description ?? "",
    descriptionVi: combo.descriptionVi ?? "",
    price: String(combo.price),
    image: combo.image ?? "",
    tag: combo.tag ?? "",
    isActive: combo.isActive,
  };
}

/**
 * Combo form state + wire payload, used by BOTH the create dialog and the
 * expandable-row editor so validation and the payload cannot drift.
 */
export function useComboForm({
  combo,
  resetKey,
  onSaved,
}: {
  combo: AdminCombo | null;
  resetKey: string;
  onSaved: () => void;
}) {
  return useAdminForm({
    entity: combo,
    resetKey,
    onSaved,
    toFormState,
    schema: createComboSchema,
    sample: () => {
      const sample = ADMIN_FORM_SAMPLES.combo;
      return {
        name: sample.name,
        nameVi: sample.nameVi,
        description: sample.description,
        descriptionVi: sample.descriptionVi,
        price: sample.price,
        image: sample.image,
        tag: sample.tag,
        isActive: sample.isActive,
      };
    },
    persist: async ({ token, entity, data: form }) => {
      const base = {
        name: form.name,
        price: Number(form.price),
        isActive: form.isActive,
        ...(form.nameVi === "" ? {} : { nameVi: form.nameVi }),
        ...(form.description === "" ? {} : { description: form.description }),
        ...(form.descriptionVi === "" ? {} : { descriptionVi: form.descriptionVi }),
        ...(form.image === "" ? {} : { image: form.image }),
        ...(form.tag === "" ? {} : { tag: form.tag }),
      };

      return entity
        ? updateComboAction(token, entity.id, {
            ...base,
            // Every optional column here is nullable: `null` clears it.
            nameVi: form.nameVi === "" ? null : form.nameVi,
            description: form.description === "" ? null : form.description,
            descriptionVi: form.descriptionVi === "" ? null : form.descriptionVi,
            image: form.image === "" ? null : form.image,
            tag: form.tag === "" ? null : form.tag,
          })
        : createComboAction(token, base);
    },
  });
}
