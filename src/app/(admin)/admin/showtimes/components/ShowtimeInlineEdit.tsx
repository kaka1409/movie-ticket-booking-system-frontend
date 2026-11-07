"use client";

import { useEffect, useState } from "react";
import ErrorAlert from "@/components/ui/ErrorAlert";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import { useLocale } from "@/contexts/LocaleContext";
import type { AdminCatalogEntry, AdminCinema, AdminShowtimeSlot } from "@/features/admin/types";
import ShowtimeFormFields from "./ShowtimeFormFields";
import { useShowtimeForm } from "./useShowtimeForm";

/**
 * The expanded slot editor: the same fields and submit pipeline as the create
 * dialog, rendered under the slot row. Mounts fresh per expand — closing is
 * the discard gesture. The form mounts one frame after the expand commit.
 */
export default function ShowtimeInlineEdit(props: {
  slot: AdminShowtimeSlot;
  defaults: { movieSlug: string; date: string };
  movies: { id: string; title: string; slug: string }[];
  cinemas: AdminCinema[];
  formats: AdminCatalogEntry[];
  onClose: () => void;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  if (!isReady) {
    return <div className="min-h-40" aria-hidden />;
  }

  return <ShowtimeInlineEditForm {...props} />;
}

function ShowtimeInlineEditForm({
  slot,
  defaults,
  movies,
  cinemas,
  formats,
  onClose,
}: {
  slot: AdminShowtimeSlot;
  defaults: { movieSlug: string; date: string };
  movies: { id: string; title: string; slug: string }[];
  cinemas: AdminCinema[];
  formats: AdminCatalogEntry[];
  onClose: () => void;
}) {
  const { translate } = useLocale();
  const { values, fieldErrors, submitError, isPending, updateField, submit } = useShowtimeForm({
    slot,
    defaults,
    formats,
    resetKey: slot.id,
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

      <ShowtimeFormFields
        values={values}
        fieldErrors={fieldErrors}
        movies={movies}
        cinemas={cinemas}
        formats={formats}
        updateField={updateField}
      />

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
