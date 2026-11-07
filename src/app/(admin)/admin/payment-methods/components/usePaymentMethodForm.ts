"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import { createPaymentMethodSchema, toAdminFieldErrors } from "@/features/admin/schema";
import { updatePaymentMethodAction } from "@/features/admin/actions/payments.action";
import type { AdminPaymentMethod } from "@/features/admin/types";

export interface PaymentMethodFormState {
  nameEn: string;
  nameVi: string;
  descriptionEn: string;
  descriptionVi: string;
  sortOrder: string;
  isActive: boolean;
}

function toFormState(method: AdminPaymentMethod): PaymentMethodFormState {
  return {
    nameEn: method.nameEn,
    nameVi: method.nameVi ?? "",
    descriptionEn: method.descriptionEn ?? "",
    descriptionVi: method.descriptionVi ?? "",
    sortOrder: String(method.sortOrder),
    isActive: method.isActive,
  };
}

/**
 * Shared state + submit pipeline for the payment-method form. The catalog rows
 * are seeded by migrations — the console only ever PATCHes, so the hook has no
 * create branch. Used by both the dialog and the expandable-row editor.
 */
export function usePaymentMethodForm({
  method,
  resetKey,
  onSaved,
}: {
  method: AdminPaymentMethod;
  resetKey: string;
  onSaved: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<PaymentMethodFormState>(() => toFormState(method));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [syncedResetKey, setSyncedResetKey] = useState(resetKey);
  if (resetKey !== syncedResetKey) {
    setSyncedResetKey(resetKey);
    setValues(toFormState(method));
    setFieldErrors({});
    setSubmitError(null);
  }

  const updateField = <TField extends keyof PaymentMethodFormState>(
    field: TField,
    value: PaymentMethodFormState[TField],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const submit = () => {
    const parsed = createPaymentMethodSchema(translate).safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toAdminFieldErrors(parsed.error));
      return;
    }
    if (!token) {
      setSubmitError(translate("admin.common.session_expired"));
      return;
    }

    const form = parsed.data;

    startTransition(async () => {
      const result = await updatePaymentMethodAction(token, method.id, {
        nameEn: form.nameEn,
        ...(form.nameVi === "" ? {} : { nameVi: form.nameVi }),
        ...(form.descriptionEn === "" ? {} : { descriptionEn: form.descriptionEn }),
        ...(form.descriptionVi === "" ? {} : { descriptionVi: form.descriptionVi }),
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      });

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate("admin.common.saved"), { variant: "success" });
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
    submit,
  };
}
