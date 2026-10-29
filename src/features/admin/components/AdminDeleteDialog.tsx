"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { resolveAdminError } from "../errorMessages";
import type { AdminActionResult } from "../types";

/**
 * Delete flow shared by every console list. The backend refuses to delete a row
 * that something still references (`409 IN_USE`) instead of orphaning it, so a
 * rejected delete flips this dialog into the "deactivate instead" offer rather
 * than closing and forcing the operator to start over.
 *
 * The callers pass their own mutations (already bound to the row and the RAM
 * bearer token); this component owns only the two-step state machine.
 */
export default function AdminDeleteDialog({
  isOpen,
  onClose,
  entityName,
  onDelete,
  onDeactivate,
  onDeleted,
}: {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  onDelete: () => Promise<AdminActionResult<unknown>>;
  /** Absent for rows that have no deactivate path (movies, showtimes, rooms). */
  onDeactivate?: () => Promise<AdminActionResult<unknown>>;
  onDeleted: (message: string) => void;
}) {
  const { translate } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [phase, setPhase] = useState<"delete" | "deactivate">("delete");
  const [error, setError] = useState<string | null>(null);

  // Every open starts from the delete step, even if the previous run stopped at
  // the in-use offer.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setPhase("delete");
      setError(null);
    }
  }

  const isDeactivatePhase = phase === "deactivate";

  const run = (mutation: () => Promise<AdminActionResult<unknown>>) => {
    startTransition(async () => {
      const result = await mutation();

      if (result.success) {
        onDeleted(
          translate(isDeactivatePhase ? "admin.common.deactivated" : "admin.common.deleted"),
        );
        return;
      }

      if (result.status === 409 && onDeactivate && !isDeactivatePhase) {
        setPhase("deactivate");
        setError(null);
        return;
      }

      setError(resolveAdminError(result, translate));
    });
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => run(isDeactivatePhase && onDeactivate ? onDeactivate : onDelete)}
      title={translate(
        isDeactivatePhase ? "admin.common.deactivate_title" : "admin.common.delete_title",
      )}
      description={`${entityName} — ${translate(
        isDeactivatePhase ? "admin.common.in_use_body" : "admin.common.delete_body",
      )}`}
      confirmLabel={translate(
        isDeactivatePhase ? "admin.common.deactivate" : "admin.common.delete",
      )}
      cancelLabel={translate("admin.common.cancel")}
      isPending={isPending}
      danger={!isDeactivatePhase}
    >
      {error && <ErrorAlert message={error} />}
    </ConfirmDialog>
  );
}
