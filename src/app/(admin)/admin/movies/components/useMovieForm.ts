"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import { createMovieSchema, toAdminFieldErrors } from "@/features/admin/schema";
import { createMovieAction, updateMovieAction } from "@/features/admin/actions/movies.action";
import type {
  AdminMovie,
  AdminMovieInput,
  AdminMovieStatus,
} from "@/features/admin/types";

export interface MovieFormState {
  title: string;
  slug: string;
  status: AdminMovieStatus;
  director: string;
  language: string;
  duration: string;
  releaseDate: string;
  ageRatingId: string;
  posterUrl: string;
  trailerUrl: string;
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
  trailerUrl: "",
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
    trailerUrl: movie.trailerUrl ?? "",
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
 * Shared state + submit pipeline for the movie form, used by BOTH the create
 * dialog and the expandable-row editor so validation and the wire payload
 * cannot drift between the two surfaces. `resetKey` re-seeds the form when the
 * edit target changes (dialog: open flag + movie id; inline: mount per expand).
 */
export function useMovieForm({
  movie,
  resetKey,
  onSaved,
}: {
  movie: AdminMovie | null;
  resetKey: string;
  onSaved: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<MovieFormState>(() => toFormState(movie));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [syncedResetKey, setSyncedResetKey] = useState(resetKey);
  if (resetKey !== syncedResetKey) {
    setSyncedResetKey(resetKey);
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

  const submit = () => {
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
      payload.trailerUrl = form.trailerUrl || null;
      payload.featuredLabel = form.featuredLabel || null;
      payload.featuredLabelVi = form.featuredLabelVi || null;
      payload.featuredDescription = form.featuredDescription || null;
      payload.featuredDescriptionVi = form.featuredDescriptionVi || null;
      payload.featuredFrom = form.featuredFrom || null;
      payload.featuredTo = form.featuredTo || null;
    } else {
      if (form.ageRatingId !== "") payload.ageRatingId = form.ageRatingId;
      if (form.posterUrl !== "") payload.posterUrl = form.posterUrl;
      if (form.trailerUrl !== "") payload.trailerUrl = form.trailerUrl;
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
      onSaved();
      router.refresh();
    });
  };

  return {
    values,
    fieldErrors,
    submitError,
    isPending,
    updateField,
    toggleGenre,
    submit,
  };
}
