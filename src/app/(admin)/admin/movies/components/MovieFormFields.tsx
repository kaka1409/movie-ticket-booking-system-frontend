"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Chip from "@/components/ui/Chip";
import AdminFormField, {
  AdminCheckbox,
} from "@/app/(admin)/admin/components/shared/AdminFormField";
import { ADMIN_INPUT_CLASS, ADMIN_LABEL_CLASS } from "@/features/admin/constants";
import type {
  AdminCatalogEntry,
  AdminMovieStatus,
} from "@/features/admin/types";
import type { MovieFormState } from "./useMovieForm";

const STATUS_OPTIONS: Array<{ value: AdminMovieStatus; labelKey: string }> = [
  { value: "now_showing", labelKey: "admin.movies.status_now_showing" },
  { value: "coming_soon", labelKey: "admin.movies.status_coming_soon" },
  { value: "ended", labelKey: "admin.movies.status_ended" },
];

/**
 * Presentational half of the movie form — every input section, shared by the
 * create dialog and the expandable-row editor so the two surfaces render the
 * same fields. State and submit live in `useMovieForm`.
 */
export default function MovieFormFields({
  values,
  fieldErrors,
  genres,
  ageRatings,
  isEditing,
  updateField,
  toggleGenre,
}: {
  values: MovieFormState;
  fieldErrors: Record<string, string>;
  genres: AdminCatalogEntry[];
  ageRatings: AdminCatalogEntry[];
  isEditing: boolean;
  updateField: <TField extends keyof MovieFormState>(
    field: TField,
    value: MovieFormState[TField],
  ) => void;
  toggleGenre: (genreId: string) => void;
}) {
  const { translate } = useLocale();

  return (
    <>
      <FormSection titleKey="admin.movies.section_basics">
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminFormField labelKey="admin.movies.field_title" error={fieldErrors.title} required>
            <input
              type="text"
              value={values.title}
              onChange={(event) => updateField("title", event.target.value)}
              className={ADMIN_INPUT_CLASS}
              autoFocus={!isEditing}
            />
          </AdminFormField>

          <AdminFormField
            labelKey="admin.movies.slug"
            hintKey={isEditing ? undefined : "admin.movies.slug_hint"}
            error={fieldErrors.slug}
            required={!isEditing}
          >
            <input
              type="text"
              value={values.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              className={ADMIN_INPUT_CLASS}
              disabled={isEditing}
            />
          </AdminFormField>

          <div>
            <span className={ADMIN_LABEL_CLASS}>
              {translate("admin.movies.status")}
              <span className="ml-0.5 text-red-500">*</span>
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  label={translate(option.labelKey)}
                  active={values.status === option.value}
                  onClick={() => updateField("status", option.value)}
                  variant="selectable"
                />
              ))}
            </div>
            {fieldErrors.status && (
              <span role="alert" className="mt-1.5 text-[11px] font-semibold text-red-500">
                {fieldErrors.status}
              </span>
            )}
          </div>

          <div>
            <span className={ADMIN_LABEL_CLASS}>
              {translate("admin.movies.age_rating")}
              <span className="ml-1.5 text-[11px] font-normal text-(--color-text-muted)">
                ({translate("admin.common.optional")})
              </span>
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Chip
                label={translate("admin.movies.age_rating_none")}
                active={values.ageRatingId === ""}
                onClick={() => updateField("ageRatingId", "")}
                variant="selectable"
              />
              {ageRatings.map((rating) => (
                <Chip
                  key={rating.id}
                  label={rating.name}
                  active={values.ageRatingId === rating.id}
                  onClick={() => updateField("ageRatingId", rating.id)}
                  variant="selectable"
                />
              ))}
            </div>
            {fieldErrors.ageRatingId && (
              <span role="alert" className="mt-1.5 text-[11px] font-semibold text-red-500">
                {fieldErrors.ageRatingId}
              </span>
            )}
          </div>

          <AdminFormField labelKey="admin.movies.director" error={fieldErrors.director}>
            <input
              type="text"
              value={values.director}
              onChange={(event) => updateField("director", event.target.value)}
              className={ADMIN_INPUT_CLASS}
            />
          </AdminFormField>

          <AdminFormField labelKey="admin.movies.language" error={fieldErrors.language}>
            <input
              type="text"
              value={values.language}
              onChange={(event) => updateField("language", event.target.value)}
              className={ADMIN_INPUT_CLASS}
            />
          </AdminFormField>

          <AdminFormField labelKey="admin.movies.runtime" error={fieldErrors.duration}>
            <input
              type="number"
              min={1}
              max={600}
              value={values.duration}
              onChange={(event) => updateField("duration", event.target.value)}
              className={ADMIN_INPUT_CLASS}
            />
          </AdminFormField>

          <AdminFormField labelKey="admin.movies.release_date" error={fieldErrors.releaseDate}>
            <input
              type="date"
              value={values.releaseDate}
              onChange={(event) => updateField("releaseDate", event.target.value)}
              className={ADMIN_INPUT_CLASS}
            />
          </AdminFormField>
        </div>
      </FormSection>

      <FormSection titleKey="admin.movies.section_story">
        <AdminFormField labelKey="admin.movies.synopsis_en" error={fieldErrors.synopsis}>
          <textarea
            rows={3}
            value={values.synopsis}
            onChange={(event) => updateField("synopsis", event.target.value)}
            className={`${ADMIN_INPUT_CLASS} resize-y`}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.movies.synopsis_vi" error={fieldErrors.synopsisVi}>
          <textarea
            rows={3}
            value={values.synopsisVi}
            onChange={(event) => updateField("synopsisVi", event.target.value)}
            className={`${ADMIN_INPUT_CLASS} resize-y`}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.movies.poster_url" error={fieldErrors.posterUrl}>
          <input
            type="url"
            value={values.posterUrl}
            onChange={(event) => updateField("posterUrl", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>
        <AdminFormField labelKey="admin.movies.trailer_url" error={fieldErrors.trailerUrl}>
          <input
            type="url"
            value={values.trailerUrl}
            onChange={(event) => updateField("trailerUrl", event.target.value)}
            className={ADMIN_INPUT_CLASS}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </AdminFormField>
      </FormSection>

      <FormSection titleKey="admin.movies.section_listing">
        <div>
          <p className={ADMIN_LABEL_CLASS}>{translate("admin.movies.genres")}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {genres.map((genre) => {
              const isSelected = values.genreIds.includes(genre.id);
              return (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  active={isSelected}
                  onClick={() => toggleGenre(genre.id)}
                  variant="selectable"
                  icon={isSelected ? <X size={12} aria-hidden /> : undefined}
                />
              );
            })}
          </div>
        </div>

        {isEditing && (
          <AdminCheckbox
            labelKey="admin.movies.featured"
            hintKey="admin.movies.featured_hint"
            checked={values.isFeatured}
            onChange={(checked) => updateField("isFeatured", checked)}
          />
        )}
      </FormSection>

      {isEditing && (
        <FormSection titleKey="admin.movies.section_featured">
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminFormField labelKey="admin.movies.featured_label" error={fieldErrors.featuredLabel}>
              <input
                type="text"
                value={values.featuredLabel}
                onChange={(event) => updateField("featuredLabel", event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </AdminFormField>

            <AdminFormField
              labelKey="admin.movies.featured_label_vi"
              error={fieldErrors.featuredLabelVi}
            >
              <input
                type="text"
                value={values.featuredLabelVi}
                onChange={(event) => updateField("featuredLabelVi", event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </AdminFormField>

            <AdminFormField
              labelKey="admin.movies.featured_description"
              error={fieldErrors.featuredDescription}
            >
              <input
                type="text"
                value={values.featuredDescription}
                onChange={(event) => updateField("featuredDescription", event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </AdminFormField>

            <AdminFormField
              labelKey="admin.movies.featured_description_vi"
              error={fieldErrors.featuredDescriptionVi}
            >
              <input
                type="text"
                value={values.featuredDescriptionVi}
                onChange={(event) => updateField("featuredDescriptionVi", event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </AdminFormField>

            <AdminFormField labelKey="admin.movies.featured_from" error={fieldErrors.featuredFrom}>
              <input
                type="date"
                value={values.featuredFrom}
                onChange={(event) => updateField("featuredFrom", event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </AdminFormField>

            <AdminFormField labelKey="admin.movies.featured_to" error={fieldErrors.featuredTo}>
              <input
                type="date"
                value={values.featuredTo}
                onChange={(event) => updateField("featuredTo", event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </AdminFormField>

            <AdminFormField labelKey="admin.movies.featured_order" error={fieldErrors.featuredOrder}>
              <input
                type="number"
                min={0}
                value={values.featuredOrder}
                onChange={(event) => updateField("featuredOrder", event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </AdminFormField>
          </div>
        </FormSection>
      )}
    </>
  );
}

function FormSection({ titleKey, children }: { titleKey: string; children: ReactNode }) {
  const { translate } = useLocale();

  return (
    <fieldset className="space-y-3 border-t border-(--color-border) pt-3 first:border-t-0 first:pt-0">
      <legend className={ADMIN_LABEL_CLASS}>{translate(titleKey)}</legend>
      {children}
    </fieldset>
  );
}
