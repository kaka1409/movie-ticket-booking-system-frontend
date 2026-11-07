"use client";

import AdminFormModal from "@/app/(admin)/admin/components/shared/AdminFormModal";
import type { AdminCatalogEntry, AdminMovie } from "@/features/admin/types";
import MovieFormFields from "./MovieFormFields";
import { useMovieForm } from "./useMovieForm";

/**
 * Create/edit dialog for a movie. Cast has its own dialog: the backend manages it
 * through separate `/movies/:slug/cast` routes, and the list endpoint does not
 * carry it. Row-level editing lives in `MovieInlineEdit`; this dialog remains
 * for the create flow (and any caller that still passes a movie).
 */
export default function MovieFormDialog({
  isOpen,
  movie,
  genres,
  ageRatings,
  onClose,
}: {
  isOpen: boolean;
  movie: AdminMovie | null;
  genres: AdminCatalogEntry[];
  ageRatings: AdminCatalogEntry[];
  onClose: () => void;
}) {
  const {
    values,
    fieldErrors,
    submitError,
    isPending,
    updateField,
    toggleGenre,
    fillSample,
    submit,
  } = useMovieForm({
    movie,
    resetKey: `${isOpen}-${movie?.id ?? "new"}`,
    onSaved: onClose,
  });

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submit}
      titleKey={movie ? "admin.movies.edit_title" : "admin.movies.create_title"}
      submitLabelKey={movie ? "admin.common.save" : "admin.common.create"}
      error={submitError}
      isPending={isPending}
      size="xl"
      onFillSample={movie === null ? fillSample : undefined}
    >
      <MovieFormFields
        values={values}
        fieldErrors={fieldErrors}
        genres={genres}
        ageRatings={ageRatings}
        isEditing={movie !== null}
        updateField={updateField}
        toggleGenre={toggleGenre}
      />
    </AdminFormModal>
  );
}
