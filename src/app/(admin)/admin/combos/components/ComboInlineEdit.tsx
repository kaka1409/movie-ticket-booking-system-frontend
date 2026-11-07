"use client";

import { useEffect, useState } from "react";
import ErrorAlert from "@/components/ui/ErrorAlert";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import { useLocale } from "@/contexts/LocaleContext";
import type { AdminCombo } from "@/features/admin/types";
import ComboFormFields from "./ComboFormFields";
import { useComboForm } from "./useComboForm";

/**
 * The expanded-row editor: the same fields and submit pipeline as the create
 * dialog, rendered inside the table row instead of a modal. Mounts fresh per
 * expand — closing is the discard gesture. The form mounts one frame after the
 * expand commit (same INP guard as `MovieInlineEdit`).
 */
export default function ComboInlineEdit(props: { combo: AdminCombo; onClose: () => void }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  if (!isReady) {
    return <div className="min-h-56" aria-hidden />;
  }

  return <ComboInlineEditForm {...props} />;
}

function ComboInlineEditForm({ combo, onClose }: { combo: AdminCombo; onClose: () => void }) {
  const { translate } = useLocale();
  const { values, fieldErrors, submitError, isPending, updateField, submit } = useComboForm({
    combo,
    resetKey: combo.id,
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

      <ComboFormFields values={values} fieldErrors={fieldErrors} updateField={updateField} />

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
