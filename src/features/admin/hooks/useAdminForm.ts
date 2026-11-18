"use client";

import { useState, useTransition } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import type { AdminActionResult } from "../types";
import { toAdminFieldErrors, type Translate } from "../schema";

export interface AdminFormPersistContext<TEntity, TParsed> {
  token: string;
  /** The row being edited; `null` means the create path. */
  entity: TEntity | null;
  /** Zod-parsed form values — payload mapping stays in the caller. */
  data: TParsed;
}

interface UseAdminFormOptions<TEntity, TValues, TParsed> {
  entity: TEntity | null;
  resetKey: string;
  onSaved: () => void;
  toFormState: (entity: TEntity | null) => TValues;
  schema: (translate: Translate, isEditing: boolean) => z.ZodType<TParsed>;
  persist: (
    context: AdminFormPersistContext<TEntity, TParsed>,
  ) => Promise<AdminActionResult<unknown>>;
  /** Prefill values for the dev "fill sample" button; never submits. */
  sample: () => TValues;
}

/**
 * Shared state + submit pipeline for admin entity forms, used by BOTH the
 * create dialog and the expandable-row editor so validation and the wire
 * payload cannot drift between the two surfaces. Domain forms keep their own
 * `toFormState`, zod schema and `persist` mapping.
 */
export function useAdminForm<TEntity, TValues, TParsed>({
  entity,
  resetKey,
  onSaved,
  toFormState,
  schema,
  persist,
  sample,
}: UseAdminFormOptions<TEntity, TValues, TParsed>) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<TValues>(() => toFormState(entity));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [syncedResetKey, setSyncedResetKey] = useState(resetKey);
  if (resetKey !== syncedResetKey) {
    setSyncedResetKey(resetKey);
    setValues(toFormState(entity));
    setFieldErrors({});
    setSubmitError(null);
  }

  const updateField = <TField extends keyof TValues>(field: TField, value: TValues[TField]) => {
    setValues((current) => ({ ...current, [field]: value }) as TValues);
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field as string];
      return next;
    });
  };

  const fillSample = () => {
    setValues(sample());
    setFieldErrors({});
    setSubmitError(null);
  };

  const submit = () => {
    const isEditing = entity !== null;
    const parsed = schema(translate, isEditing).safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toAdminFieldErrors(parsed.error));
      return;
    }
    if (!token) {
      setSubmitError(translate("admin.common.session_expired"));
      return;
    }

    const data = parsed.data;
    const target = entity;
    startTransition(async () => {
      const result = await persist({ token, entity: target, data });
      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate(isEditing ? "admin.common.saved" : "admin.common.created"), {
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
    setValues: setValues as Dispatch<SetStateAction<TValues>>,
    updateField,
    fillSample,
    submit,
  };
}
