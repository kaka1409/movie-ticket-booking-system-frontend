"use client";

import AdminFormModal from "@/app/(admin)/admin/components/shared/AdminFormModal";
import type {
  AdminCatalogEntry,
  AdminCinema,
  AdminShowtimeSlot,
} from "@/features/admin/types";
import ShowtimeFormFields from "./ShowtimeFormFields";
import { useShowtimeForm, type ShowtimeFormState } from "./useShowtimeForm";

/**
 * Create/edit dialog shared by the schedule board's "New slot" button and the
 * detail drawer's Edit action. `slot === null` creates; otherwise it reslots
 * the given showtime (the form's own defaults carry movie + wall-clock date).
 */
export default function ShowtimeFormDialog({
  isOpen,
  onClose,
  slot,
  defaults,
  movies,
  cinemas,
  formats,
  sampleForm,
}: {
  isOpen: boolean;
  onClose: () => void;
  slot: AdminShowtimeSlot | null;
  defaults: { movieSlug: string; date: string };
  movies: { id: string; title: string; slug: string }[];
  cinemas: AdminCinema[];
  formats: AdminCatalogEntry[];
  sampleForm?: () => ShowtimeFormState;
}) {
  const { values, fieldErrors, submitError, isPending, updateField, fillSample, submit } =
    useShowtimeForm({
      slot,
      defaults,
      formats,
      resetKey: `${isOpen}-${slot?.id ?? "new"}`,
      onSaved: onClose,
    });

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submit}
      titleKey={slot ? "admin.showtimes.edit_title" : "admin.showtimes.create_title"}
      submitLabelKey={slot ? "admin.common.save" : "admin.common.create"}
      error={submitError}
      isPending={isPending}
      size="lg"
      onFillSample={slot ? undefined : sampleForm ? () => fillSample(sampleForm()) : undefined}
    >
      <ShowtimeFormFields
        values={values}
        fieldErrors={fieldErrors}
        movies={movies}
        cinemas={cinemas}
        formats={formats}
        updateField={updateField}
      />
    </AdminFormModal>
  );
}
