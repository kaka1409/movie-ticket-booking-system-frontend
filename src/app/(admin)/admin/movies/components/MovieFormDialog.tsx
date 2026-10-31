"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import AdminFormField, {
  AdminCheckbox,
} from "@/app/(admin)/admin/components/shared/AdminFormField";
import AdminFormModal from "@/app/(admin)/admin/components/shared/AdminFormModal";
import { ADMIN_INPUT_CLASS, ADMIN_LABEL_CLASS } from "@/features/admin/constants";
import { createMovieSchema, toAdminFieldErrors } from "@/features/admin/schema";
import { createMovieAction, updateMovieAction } from "@/features/admin/actions/movies.action";
import type {
  AdminCatalogEntry,
  AdminMovie,
  AdminMovieInput,
  AdminMovieStatus,
} from "@/features/admin/types";

const STATUS_OPTIONS: Array<{ value: AdminMovieStatus; labelKey: string }> = [
  { value: "now_showing", labelKey: "admin.movies.status_now_showing" },
  { value: "coming_soon", labelKey: "admin.movies.status_coming_soon" },
  { value: "ended", labelKey: "admin.movies.status_ended" },
];

interface MovieFormState {
  title: string;
  slug: string;
  status: AdminMovieStatus;
  director: string;
  language: string;
  duration: string;
  releaseDate: string;
  ageRatingId: string;
  posterUrl: string;
  synopsis: string;
  synopsisVi: string;
  featuredLabel: string;
  featuredLabelVi: string;
  featuredDescription: string;
  featuredDescriptionVi: string;
  featuredFrom: string;
  featuredTo: string;
  featuredOrder: string;
  genreIds: string[];
  isFeatured: boolean;
}

const EMPTY_FORM: MovieFormState = {
  title: "",
  slug: "",
  status: "coming_soon",
  director: "",
  language: "",
  duration: "",
  releaseDate: "",
  ageRatingId: "",
  posterUrl: "",
  synopsis: "",
  synopsisVi: "",
  featuredLabel: "",
  featuredLabelVi: "",
  featuredDescription: "",
  featuredDescriptionVi: "",
  featuredFrom: "",
  featuredTo: "",
  featuredOrder: "",
  genreIds: [],
  isFeatured: false,
};

function toFormState(movie: AdminMovie | null): MovieFormState {
  if (!movie) return EMPTY_FORM;

  return {
    title: movie.title,
    slug: movie.slug,
    status: movie.status,
    director: movie.director ?? "",
    language: movie.language ?? "",
    duration: movie.duration === undefined ? "" : String(movie.duration),
    releaseDate: movie.releaseDate ?? "",
    ageRatingId: movie.ageRatingId ?? "",
    posterUrl: movie.posterUrl ?? "",
    synopsis: movie.synopsis ?? "",
    synopsisVi: movie.synopsisVi ?? "",
    featuredLabel: movie.featuredLabel ?? "",
    featuredLabelVi: movie.featuredLabelVi ?? "",
    featuredDescription: movie.featuredDescription ?? "",
    featuredDescriptionVi: movie.featuredDescriptionVi ?? "",
    featuredFrom: movie.featuredFrom ?? "",
    featuredTo: movie.featuredTo ?? "",
    featuredOrder: movie.featuredOrder === undefined ? "" : String(movie.featuredOrder),
    genreIds: movie.genres.map((genre) => genre.id),
    isFeatured: movie.isFeatured,
  };
}

/**
 * Create/edit dialog for a movie. Cast has its own dialog: the backend manages it
 * through separate `/movies/:slug/cast` routes, and the list endpoint does not
 * carry it.
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
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<MovieFormState>(() => toFormState(movie));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formSignature = `${isOpen}-${movie?.id ?? "new"}`;
  const [syncedFormSignature, setSyncedFormSignature] = useState(formSignature);
  if (formSignature !== syncedFormSignature) {
    setSyncedFormSignature(formSignature);
    setValues(toFormState(movie));
    setFieldErrors({});
    setSubmitError(null);
  }

  const updateField = <TField extends keyof MovieFormState>(
    field: TField,
    value: MovieFormState[TField],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const toggleGenre = (genreId: string) => {
    setValues((current) => ({
      ...current,
      genreIds: current.genreIds.includes(genreId)
        ? current.genreIds.filter((id) => id !== genreId)
        : [...current.genreIds, genreId],
    }));
  };

  const handleSubmit = () => {
    const isEditing = movie !== null;
    const parsed = createMovieSchema(translate, isEditing).safeParse(values);

    if (!parsed.success) {
      setFieldErrors(toAdminFieldErrors(parsed.error));
      return;
    }
    if (!token) {
      setSubmitError(translate("admin.common.session_expired"));
      return;
    }

    const form = parsed.data;
    // Empty string means "not set": the update DTO takes `null` to clear a
    // nullable column and rejects `""`, while a required column is omitted.
    const payload: AdminMovieInput = {
      title: form.title,
      status: form.status,
      genreIds: form.genreIds,
      isFeatured: form.isFeatured,
    };

    if (!isEditing && form.slug !== "") payload.slug = form.slug;
    if (form.director !== "") payload.director = form.director;
    if (form.language !== "") payload.language = form.language;
    if (form.duration !== "") payload.duration = Number(form.duration);
    if (form.releaseDate !== "") payload.releaseDate = form.releaseDate;
    if (form.synopsis !== "") payload.synopsis = form.synopsis;
    if (form.synopsisVi !== "") payload.synopsisVi = form.synopsisVi;
    if (form.featuredOrder !== "") payload.featuredOrder = Number(form.featuredOrder);

    if (isEditing) {
      payload.ageRatingId = form.ageRatingId || null;
      payload.posterUrl = form.posterUrl || null;
      payload.featuredLabel = form.featuredLabel || null;
      payload.featuredLabelVi = form.featuredLabelVi || null;
      payload.featuredDescription = form.featuredDescription || null;
      payload.featuredDescriptionVi = form.featuredDescriptionVi || null;
      payload.featuredFrom = form.featuredFrom || null;
      payload.featuredTo = form.featuredTo || null;
    } else {
      if (form.ageRatingId !== "") payload.ageRatingId = form.ageRatingId;
      if (form.posterUrl !== "") payload.posterUrl = form.posterUrl;
      if (form.featuredLabel !== "") payload.featuredLabel = form.featuredLabel;
      if (form.featuredLabelVi !== "") payload.featuredLabelVi = form.featuredLabelVi;
      if (form.featuredDescription !== "") payload.featuredDescription = form.featuredDescription;
      if (form.featuredDescriptionVi !== "") {
        payload.featuredDescriptionVi = form.featuredDescriptionVi;
      }
      if (form.featuredFrom !== "") payload.featuredFrom = form.featuredFrom;
      if (form.featuredTo !== "") payload.featuredTo = form.featuredTo;
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateMovieAction(token, movie.slug, payload)
        : await createMovieAction(token, { ...payload, title: form.title });

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate(isEditing ? "admin.common.saved" : "admin.common.created"), {
        variant: "success",
      });
      onClose();
      router.refresh();
    });
  };

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      titleKey={movie ? "admin.movies.edit_title" : "admin.movies.create_title"}
      submitLabelKey={movie ? "admin.common.save" : "admin.common.create"}
      error={submitError}
      isPending={isPending}
      size="xl"
    >
      <FormSection titleKey="admin.movies.section_basics">
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminFormField labelKey="admin.movies.field_title" error={fieldErrors.title}>
            <input
              type="text"
              value={values.title}
              onChange={(event) => updateField("title", event.target.value)}
              className={ADMIN_INPUT_CLASS}
              autoFocus
            />
          </AdminFormField>

          <AdminFormField
            labelKey="admin.movies.slug"
            hintKey={movie ? undefined : "admin.movies.slug_hint"}
            error={fieldErrors.slug}
          >
            <input
              type="text"
              value={values.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              className={ADMIN_INPUT_CLASS}
              disabled={movie !== null}
            />
          </AdminFormField>

          <AdminFormField labelKey="admin.movies.status" error={fieldErrors.status}>
            <select
              value={values.status}
              onChange={(event) => updateField("status", event.target.value as AdminMovieStatus)}
              className={ADMIN_INPUT_CLASS}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {translate(option.labelKey)}
                </option>
              ))}
            </select>
          </AdminFormField>

          <AdminFormField labelKey="admin.movies.age_rating" error={fieldErrors.ageRatingId}>
            <select
              value={values.ageRatingId}
              onChange={(event) => updateField("ageRatingId", event.target.value)}
              className={ADMIN_INPUT_CLASS}
            >
              <option value="">{translate("admin.movies.age_rating_none")}</option>
              {ageRatings.map((rating) => (
                <option key={rating.id} value={rating.id}>
                  {rating.name}
                </option>
              ))}
            </select>
          </AdminFormField>

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
      </FormSection>

      <FormSection titleKey="admin.movies.section_listing">
        <div>
          <p className={ADMIN_LABEL_CLASS}>{translate("admin.movies.genres")}</p>
          <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
            {genres.map((genre) => (
              <label
                key={genre.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-2)"
              >
                <input
                  type="checkbox"
                  checked={values.genreIds.includes(genre.id)}
                  onChange={() => toggleGenre(genre.id)}
                  className="h-4 w-4 cursor-pointer accent-(--color-gold)"
                />
                <span className="truncate">{genre.name}</span>
              </label>
            ))}
          </div>
        </div>

        <AdminCheckbox
          labelKey="admin.movies.featured"
          hintKey="admin.movies.featured_hint"
          checked={values.isFeatured}
          onChange={(checked) => updateField("isFeatured", checked)}
        />
      </FormSection>

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
    </AdminFormModal>
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
