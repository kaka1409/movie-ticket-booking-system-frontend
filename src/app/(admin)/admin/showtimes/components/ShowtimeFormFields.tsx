"use client";

import AdminFormField from "@/app/(admin)/admin/components/shared/AdminFormField";
import { useLocale } from "@/contexts/LocaleContext";
import { ADMIN_FIELD_GRID_CLASS, ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import { getRoomDisplayName } from "@/libs/utils";
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
  const { locale } = useLocale();

  return (
    <div className={ADMIN_FIELD_GRID_CLASS}>
      <AdminFormField labelKey="admin.showtimes.movie" error={fieldErrors.movieSlug} required>
        <select
          name="movieSlug"
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
          name="date"
          value={values.date}
          onChange={(event) => updateField("date", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>

      <AdminFormField labelKey="admin.showtimes.column_room" error={fieldErrors.roomId} required>
        <select
          name="roomId"
          value={values.roomId}
          onChange={(event) => updateField("roomId", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        >
          <option value="">—</option>
          {cinemas.flatMap((cinema) =>
            cinema.rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {cinema.name} · {getRoomDisplayName(room, locale)}
              </option>
            )),
          )}
        </select>
      </AdminFormField>

      <AdminFormField labelKey="admin.showtimes.column_format" error={fieldErrors.formatId} required>
        <select
          name="formatId"
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
          name="startTime"
          value={values.startTime}
          onChange={(event) => updateField("startTime", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>
    </div>
  );
}
