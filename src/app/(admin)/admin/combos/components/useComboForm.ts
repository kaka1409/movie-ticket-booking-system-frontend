"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import { createComboSchema, toAdminFieldErrors } from "@/features/admin/schema";
import { createComboAction, updateComboAction } from "@/features/admin/actions/food.action";
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
 * Shared state + submit pipeline for the combo form, used by BOTH the create
 * dialog and the expandable-row editor so validation and the wire payload
 * cannot drift between the two surfaces.
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
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<ComboFormState>(() => toFormState(combo));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [syncedResetKey, setSyncedResetKey] = useState(resetKey);
  if (resetKey !== syncedResetKey) {
    setSyncedResetKey(resetKey);
    setValues(toFormState(combo));
    setFieldErrors({});
    setSubmitError(null);
  }

  const updateField = <TField extends keyof ComboFormState>(
    field: TField,
    value: ComboFormState[TField],
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
    const sample = ADMIN_FORM_SAMPLES.combo;
    setValues({
      name: sample.name,
      nameVi: sample.nameVi,
      description: sample.description,
      descriptionVi: sample.descriptionVi,
      price: sample.price,
      image: sample.image,
      tag: sample.tag,
      isActive: sample.isActive,
    });
    setFieldErrors({});
    setSubmitError(null);
  };

  const submit = () => {
    const parsed = createComboSchema(translate).safeParse(values);
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
      price: Number(form.price),
      isActive: form.isActive,
      ...(form.nameVi === "" ? {} : { nameVi: form.nameVi }),
      ...(form.description === "" ? {} : { description: form.description }),
      ...(form.descriptionVi === "" ? {} : { descriptionVi: form.descriptionVi }),
      ...(form.image === "" ? {} : { image: form.image }),
      ...(form.tag === "" ? {} : { tag: form.tag }),
    };

    startTransition(async () => {
      const result = combo
        ? await updateComboAction(token, combo.id, {
            ...base,
            // Every optional column here is nullable: `null` clears it.
            nameVi: form.nameVi === "" ? null : form.nameVi,
            description: form.description === "" ? null : form.description,
            descriptionVi: form.descriptionVi === "" ? null : form.descriptionVi,
            image: form.image === "" ? null : form.image,
            tag: form.tag === "" ? null : form.tag,
          })
        : await createComboAction(token, base);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate(combo ? "admin.common.saved" : "admin.common.created"), {
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
