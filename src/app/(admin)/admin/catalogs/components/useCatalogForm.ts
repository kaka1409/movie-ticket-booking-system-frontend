"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import { createCatalogSchema, toAdminFieldErrors } from "@/features/admin/schema";
import {
  createCatalogEntryAction,
  updateCatalogEntryAction,
} from "@/features/admin/actions/catalogs.action";
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
 * Shared state + submit pipeline for the catalog form — one shape serves all
 * three kinds (genres/formats/age-ratings) and both surfaces (create dialog,
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
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<CatalogFormState>(() => toFormState(entry));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [syncedResetKey, setSyncedResetKey] = useState(resetKey);
  if (resetKey !== syncedResetKey) {
    setSyncedResetKey(resetKey);
    setValues(toFormState(entry));
    setFieldErrors({});
    setSubmitError(null);
  }

  const updateField = <TField extends keyof CatalogFormState>(
    field: TField,
    value: CatalogFormState[TField],
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
    const sample = catalogSample(kind);
    setValues({
      name: String(sample.name ?? ""),
      nameVi: String(sample.nameVi ?? ""),
      sortOrder: String(sample.sortOrder ?? "0"),
      isActive: sample.isActive === true,
    });
    setFieldErrors({});
    setSubmitError(null);
  };

  const submit = () => {
    const parsed = createCatalogSchema(translate).safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toAdminFieldErrors(parsed.error));
      return;
    }
    if (!token) {
      setSubmitError(translate("admin.common.session_expired"));
      return;
    }

    const payload = {
      name: parsed.data.name,
      nameVi: parsed.data.nameVi === "" ? null : parsed.data.nameVi,
      sortOrder: parsed.data.sortOrder,
      isActive: parsed.data.isActive,
    };

    startTransition(async () => {
      const result = entry
        ? await updateCatalogEntryAction(token, kind, entry.id, payload)
        : await createCatalogEntryAction(token, kind, payload);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate(entry ? "admin.common.saved" : "admin.common.created"), {
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
