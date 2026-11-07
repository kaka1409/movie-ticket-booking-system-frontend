"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import { createShowtimeSchema, toAdminFieldErrors } from "@/features/admin/schema";
import { resolveAdminError } from "@/features/admin/errorMessages";
import {
  createShowtimeAction,
  updateShowtimeAction,
} from "@/features/admin/actions/showtimes.action";
import type { AdminCatalogEntry, AdminShowtimeSlot } from "@/features/admin/types";

export interface ShowtimeFormState {
  movieSlug: string;
  roomId: string;
  formatId: string;
  date: string;
  startTime: string;
}

const EMPTY_FORM: ShowtimeFormState = {
  movieSlug: "",
  roomId: "",
  formatId: "",
  date: "",
  startTime: "",
};

function toFormState(
  slot: AdminShowtimeSlot | null,
  defaults: { movieSlug: string; date: string },
  formats: AdminCatalogEntry[],
): ShowtimeFormState {
  if (!slot) return { ...EMPTY_FORM, ...defaults };
  return {
    movieSlug: defaults.movieSlug,
    roomId: slot.roomId,
    formatId: formats.find((format) => format.name === slot.format)?.id ?? "",
    date: defaults.date,
    startTime: slot.startTime,
  };
}

/**
 * Shared state + submit pipeline for the showtime form, used by BOTH the
 * create dialog and the expandable slot editor. A saved slot may land on a
 * different movie-day than the board shows — the hook follows it via the URL.
 */
export function useShowtimeForm({
  slot,
  defaults,
  formats,
  resetKey,
  onSaved,
}: {
  slot: AdminShowtimeSlot | null;
  /** Board context: the movie slug and wall-clock date the form edits within. */
  defaults: { movieSlug: string; date: string };
  formats: AdminCatalogEntry[];
  resetKey: string;
  onSaved: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<ShowtimeFormState>(() =>
    toFormState(slot, defaults, formats),
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [syncedResetKey, setSyncedResetKey] = useState(resetKey);
  if (resetKey !== syncedResetKey) {
    setSyncedResetKey(resetKey);
    setValues(toFormState(slot, defaults, formats));
    setFieldErrors({});
    setSubmitError(null);
  }

  const updateField = <TField extends keyof ShowtimeFormState>(
    field: TField,
    value: ShowtimeFormState[TField],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  /** Create-mode only: the sample button writes caller-computed values. */
  const fillSample = (sample: ShowtimeFormState) => {
    setValues(sample);
    setFieldErrors({});
    setSubmitError(null);
  };

  const submit = () => {
    const parsed = createShowtimeSchema(translate).safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toAdminFieldErrors(parsed.error));
      return;
    }
    if (!token) {
      setSubmitError(translate("admin.common.session_expired"));
      return;
    }

    startTransition(async () => {
      const result = slot
        ? await updateShowtimeAction(token, slot.id, parsed.data)
        : await createShowtimeAction(token, parsed.data);
      if (!result.success) {
        setSubmitError(resolveAdminError(result, translate));
        return;
      }

      notify(translate(slot ? "admin.common.saved" : "admin.common.created"), {
        variant: "success",
      });
      onSaved();
      // Follow the saved slot: a write may land on another movie or day than the
      // one the board is showing.
      const nextMovie = result.data.movie.slug;
      const nextDate = result.data.date;
      if (nextMovie !== defaults.movieSlug || nextDate !== defaults.date) {
        router.replace(`/admin/showtimes?movie=${nextMovie}&date=${nextDate}`);
      }
      router.refresh();
    });
  };

  return {
    values,
    fieldErrors,
    submitError,
    isPending,
    updateField,
    fillSample,
    submit,
  };
}
