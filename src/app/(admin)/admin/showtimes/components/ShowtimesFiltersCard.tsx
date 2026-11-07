"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFilterChipGroup from "@/app/(admin)/admin/components/shared/AdminFilterChips";
import { ADMIN_CARD_CLASS, ADMIN_INPUT_CLASS, ADMIN_LABEL_CLASS } from "@/features/admin/constants";

/** Draft the card hands to `onApply` — movie/date are URL params, the rest client-side. */
export interface ShowtimeFilterDraft {
  movie: string;
  date: string;
  format: string;
  cinema: string;
}

/**
 * Compact filter card above the schedule board, same shape as
 * `MovieFiltersCard`: selects/dates + chip groups, Apply/Clear footer. Edits
 * stay local until Apply — one commit per apply.
 */
export default function ShowtimesFiltersCard({
  movies,
  formats,
  cinemas,
  movie,
  date,
  format,
  cinema,
  isFiltered,
  onApply,
  onClear,
  onCreate,
}: {
  movies: { id: string; title: string; slug: string }[];
  formats: { id: string; name: string }[];
  /** Distinct cinema names present on the board. */
  cinemas: string[];
  movie: string;
  date: string;
  format: string;
  cinema: string;
  isFiltered: boolean;
  onApply: (draft: ShowtimeFilterDraft) => void;
  onClear: () => void;
  onCreate: () => void;
}) {
  const { translate } = useLocale();

  const [movieValue, setMovieValue] = useState(movie);
  const [dateValue, setDateValue] = useState(date);
  const [formatValue, setFormatValue] = useState(format);
  const [cinemaValue, setCinemaValue] = useState(cinema);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply({
      movie: movieValue,
      date: dateValue,
      format: formatValue,
      cinema: cinemaValue,
    });
  };

  const handleClear = () => {
    setMovieValue("");
    setDateValue("");
    setFormatValue("");
    setCinemaValue("");
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className={`${ADMIN_CARD_CLASS} mb-3 p-3`}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="block">
          <span className={ADMIN_LABEL_CLASS}>{translate("admin.showtimes.movie")}</span>
          <select
            value={movieValue}
            onChange={(event) => setMovieValue(event.target.value)}
            className={`${ADMIN_INPUT_CLASS} mt-1.5`}
          >
            {movies.map((entry) => (
              <option key={entry.id} value={entry.slug}>
                {entry.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={ADMIN_LABEL_CLASS}>{translate("admin.showtimes.date")}</span>
          <input
            type="date"
            value={dateValue}
            onChange={(event) => setDateValue(event.target.value)}
            className={`${ADMIN_INPUT_CLASS} mt-1.5`}
          />
        </label>

        <div className="col-span-2 flex items-end">
          <AdminButton icon={Plus} variant="primary" size="md" onClick={onCreate}>
            {translate("admin.showtimes.new")}
          </AdminButton>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-(--color-border) pt-3 sm:grid-cols-3">
        <AdminFilterChipGroup
          labelKey="admin.showtimes.column_format"
          options={formats.map((format) => ({ value: format.name, label: format.name }))}
          value={formatValue}
          onChange={setFormatValue}
        />

        {cinemas.length > 0 && (
          <AdminFilterChipGroup
            labelKey="admin.cinemas.title"
            options={cinemas.map((name) => ({ value: name, label: name }))}
            value={cinemaValue}
            onChange={setCinemaValue}
            className="col-span-2 sm:col-span-1"
          />
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-(--color-border) pt-3">
        <AdminButton type="submit" variant="outline" size="md">
          {translate("admin.common.apply")}
        </AdminButton>
        {isFiltered && (
          <AdminButton onClick={handleClear}>{translate("admin.common.clear_filters")}</AdminButton>
        )}
      </div>
    </form>
  );
}
