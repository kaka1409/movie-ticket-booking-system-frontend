"use client";

import { useEffect, useState } from "react";
import ErrorAlert from "@/components/ui/ErrorAlert";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import { useLocale } from "@/contexts/LocaleContext";
import type { AdminCatalogEntry, AdminCatalogKind } from "@/features/admin/types";
import CatalogFormFields from "./CatalogFormFields";
import { useCatalogForm } from "./useCatalogForm";

/**
 * The expanded-row editor: the same fields and submit pipeline as
 * `CatalogFormDialog`, rendered inside the table row instead of a modal.
 * Mounts fresh per expand — closing is the discard gesture.
 *
 * The form mounts one frame AFTER the expand commit (same INP guard as
 * `MovieInlineEdit`).
 */
export default function CatalogInlineEdit(props: {
  kind: AdminCatalogKind;
  entry: AdminCatalogEntry;
  onClose: () => void;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  if (!isReady) {
    return <div className="min-h-32" aria-hidden />;
  }

  return <CatalogInlineEditForm {...props} />;
}

function CatalogInlineEditForm({
  kind,
  entry,
  onClose,
}: {
  kind: AdminCatalogKind;
  entry: AdminCatalogEntry;
  onClose: () => void;
}) {
  const { translate } = useLocale();
  const { values, fieldErrors, submitError, isPending, updateField, submit } = useCatalogForm({
    kind,
    entry,
    resetKey: entry.id,
    onSaved: onClose,
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="space-y-3"
    >
      {submitError && <ErrorAlert message={submitError} />}

      <CatalogFormFields values={values} fieldErrors={fieldErrors} updateField={updateField} />

      <div className="flex items-center justify-end gap-2 border-t border-(--color-border) pt-3">
        <AdminButton size="md" variant="ghost" onClick={onClose} disabled={isPending}>
          {translate("admin.common.cancel")}
        </AdminButton>
        <AdminButton size="md" type="submit" variant="primary" isLoading={isPending}>
          {translate("admin.common.save")}
        </AdminButton>
      </div>
    </form>
  );
}
