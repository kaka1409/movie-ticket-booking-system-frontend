"use client";

import { useEffect, useState } from "react";
import ErrorAlert from "@/components/ui/ErrorAlert";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import { useLocale } from "@/contexts/LocaleContext";
import type { AdminCatalogEntry, AdminMovie } from "@/features/admin/types";
import MovieFormFields from "./MovieFormFields";
import { useMovieForm } from "./useMovieForm";

/**
 * The expanded-row editor: the same fields and submit pipeline as
 * `MovieFormDialog`, rendered inside the table row instead of a modal. Mounts
 * fresh per expand, so unsaved input dies with the panel — closing is the
 * discard gesture, saving closes it too.
 *
 * The ~30-field form mounts one frame AFTER the expand commit: building it
 * synchronously inside the click's frame was the page's worst INP.
 */
export default function MovieInlineEdit(props: {
  movie: AdminMovie;
  genres: AdminCatalogEntry[];
  ageRatings: AdminCatalogEntry[];
  onClose: () => void;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  if (!isReady) {
    return <div className="min-h-64" aria-hidden />;
  }

  return <MovieInlineEditForm {...props} />;
}

function MovieInlineEditForm({
  movie,
  genres,
  ageRatings,
  onClose,
}: {
  movie: AdminMovie;
  genres: AdminCatalogEntry[];
  ageRatings: AdminCatalogEntry[];
  onClose: () => void;
}) {
  const { translate } = useLocale();
  const { values, fieldErrors, submitError, isPending, updateField, toggleGenre, submit } =
    useMovieForm({ movie, resetKey: movie.id, onSaved: onClose });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="space-y-3"
    >
      {submitError && <ErrorAlert message={submitError} />}

      <MovieFormFields
        values={values}
        fieldErrors={fieldErrors}
        genres={genres}
        ageRatings={ageRatings}
        isEditing
        updateField={updateField}
        toggleGenre={toggleGenre}
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
