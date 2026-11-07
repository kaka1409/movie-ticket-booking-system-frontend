"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import { createFoodItemSchema, toAdminFieldErrors } from "@/features/admin/schema";
import { createFoodItemAction, updateFoodItemAction } from "@/features/admin/actions/food.action";
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
 * Shared state + submit pipeline for the snack form, used by BOTH the create
 * dialog and the expandable-row editor so validation and the wire payload
 * cannot drift between the two surfaces.
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
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<FoodFormState>(() => toFormState(item));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [syncedResetKey, setSyncedResetKey] = useState(resetKey);
  if (resetKey !== syncedResetKey) {
    setSyncedResetKey(resetKey);
    setValues(toFormState(item));
    setFieldErrors({});
    setSubmitError(null);
  }

  const updateField = <TField extends keyof FoodFormState>(
    field: TField,
    value: FoodFormState[TField],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const fillSample = () => {
    const sample = ADMIN_FORM_SAMPLES.food;
    setValues({
      name: sample.name,
      nameVi: sample.nameVi,
      category: sample.category,
      price: sample.price,
      image: sample.image,
      isActive: sample.isActive,
    });
    setFieldErrors({});
    setSubmitError(null);
  };

  const submit = () => {
    const parsed = createFoodItemSchema(translate).safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toAdminFieldErrors(parsed.error));
      return;
    }
    if (!token) {
      setSubmitError(translate("admin.common.session_expired"));
      return;
    }

    const form = parsed.data;
    const base = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      isActive: form.isActive,
      ...(form.nameVi === "" ? {} : { nameVi: form.nameVi }),
      ...(form.image === "" ? {} : { image: form.image }),
    };

    startTransition(async () => {
      const result = item
        ? await updateFoodItemAction(token, item.id, {
            ...base,
            // `image` is the only nullable column here; "" would be rejected.
            ...(form.image === "" ? { image: null } : {}),
          })
        : await createFoodItemAction(token, base);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate(item ? "admin.common.saved" : "admin.common.created"), {
        variant: "success",
      });
      onSaved();
      router.refresh();
    });
  };

  return {
    values,
    fieldErrors,
    submitError,
    isPending,
    updateField,
    fillSample,
    submit,
  };
}
