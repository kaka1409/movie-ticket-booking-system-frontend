"use client";

import AdminFormField from "@/app/(admin)/admin/components/shared/AdminFormField";
import { ADMIN_FIELD_GRID_CLASS, ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import type { AdminCinema, AdminCatalogEntry } from "@/features/admin/types";
import type { ShowtimeFormState } from "./useShowtimeForm";

/**
 * Presentational half of the showtime form — shared by the create dialog and
 * the expandable slot editor so the two surfaces render the same fields.
 */
export default function ShowtimeFormFields({
  values,
  fieldErrors,
  movies,
  cinemas,
  formats,
  updateField,
}: {
  values: ShowtimeFormState;
  fieldErrors: Record<string, string>;
  movies: { id: string; title: string; slug: string }[];
  cinemas: AdminCinema[];
  formats: AdminCatalogEntry[];
  updateField: <TField extends keyof ShowtimeFormState>(
    field: TField,
    value: ShowtimeFormState[TField],
  ) => void;
}) {
  return (
    <div className={ADMIN_FIELD_GRID_CLASS}>
      <AdminFormField labelKey="admin.showtimes.movie" error={fieldErrors.movieSlug} required>
        <select
          value={values.movieSlug}
          onChange={(event) => updateField("movieSlug", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        >
          <option value="">—</option>
          {movies.map((entry) => (
            <option key={entry.id} value={entry.slug}>
              {entry.title}
            </option>
          ))}
        </select>
      </AdminFormField>

      <AdminFormField labelKey="admin.showtimes.date" error={fieldErrors.date} required>
        <input
          type="date"
          value={values.date}
          onChange={(event) => updateField("date", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>

      <AdminFormField labelKey="admin.showtimes.column_room" error={fieldErrors.roomId} required>
        <select
          value={values.roomId}
          onChange={(event) => updateField("roomId", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        >
          <option value="">—</option>
          {cinemas.flatMap((cinema) =>
            cinema.rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {cinema.name} · {room.name}
              </option>
            )),
          )}
        </select>
      </AdminFormField>

      <AdminFormField labelKey="admin.showtimes.column_format" error={fieldErrors.formatId} required>
        <select
          value={values.formatId}
          onChange={(event) => updateField("formatId", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        >
          <option value="">—</option>
          {formats.map((format) => (
            <option key={format.id} value={format.id}>
              {format.name}
            </option>
          ))}
        </select>
      </AdminFormField>

      <AdminFormField labelKey="admin.showtimes.column_time" error={fieldErrors.startTime} required>
        <input
          type="time"
          value={values.startTime}
          onChange={(event) => updateField("startTime", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>
    </div>
  );
}
