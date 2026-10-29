"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Pencil, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import AdminButton from "@/features/admin/components/AdminButton";
import AdminDeleteDialog from "@/features/admin/components/AdminDeleteDialog";
import AdminFormField from "@/features/admin/components/AdminFormField";
import AdminFormModal from "@/features/admin/components/AdminFormModal";
import { ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import { resolveAdminError } from "@/features/admin/errorMessages";
import { createShowtimeSchema, toAdminFieldErrors } from "@/features/admin/schema";
import {
  createShowtimeAction,
  deleteShowtimeAction,
  updateShowtimeAction,
} from "@/features/admin/actions/showtimes.action";
import type { AdminCinema, AdminShowtimeBoard, AdminShowtimeSlot } from "@/features/admin/types";

interface ShowtimesManagerProps {
  movies: { id: string; title: string; slug: string }[];
  cinemas: AdminCinema[];
  formats: { id: string; name: string }[];
  board: AdminShowtimeBoard | null;
  movie: string;
  date: string;
}

interface FormState {
  movieSlug: string;
  roomId: string;
  formatId: string;
  date: string;
  startTime: string;
}

const EMPTY_FORM: FormState = {
  movieSlug: "",
  roomId: "",
  formatId: "",
  date: "",
  startTime: "",
};

/**
 * Schedule board for one movie-day. The board itself is the public
 * `GET /showtimes` read (grouped by cinema), so a slot the operator creates
 * here is exactly what a customer will see on the movie page.
 */
export default function ShowtimesManager({
  movies,
  cinemas,
  formats,
  board,
  movie,
  date,
}: ShowtimesManagerProps) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [movieFilter, setMovieFilter] = useState(movie);
  const [dateFilter, setDateFilter] = useState(date);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AdminShowtimeSlot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<
    (AdminShowtimeSlot & { cinemaName: string }) | null
  >(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toFormState = (slot: AdminShowtimeSlot | null): FormState => {
    if (!slot) return { ...EMPTY_FORM, movieSlug: movie, date };
    return {
      movieSlug: board?.movie.slug ?? movie,
      roomId: slot.roomId,
      formatId: formats.find((format) => format.name === slot.format)?.id ?? "",
      date: board?.date ?? date,
      startTime: slot.startTime,
    };
  };

  const [values, setValues] = useState<FormState>(() => toFormState(null));

  const allSlots: (AdminShowtimeSlot & { cinemaName: string })[] = [];
  board?.cinemas.forEach((cinema) => {
    cinema.showtimes.forEach((slot) => {
      allSlots.push({ ...slot, cinemaName: cinema.name });
    });
  });

  const updateField = <TField extends keyof FormState>(field: TField, value: FormState[TField]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (movieFilter) params.set("movie", movieFilter);
    if (dateFilter) params.set("date", dateFilter);
    router.replace(`/admin/showtimes?${params.toString()}`);
  };

  const openCreate = () => {
    setValues(toFormState(null));
    setFieldErrors({});
    setSubmitError(null);
    setEditingSlot(null);
    setFormOpen(true);
  };

  const openEdit = (slot: AdminShowtimeSlot) => {
    setValues(toFormState(slot));
    setFieldErrors({});
    setSubmitError(null);
    setEditingSlot(slot);
    setFormOpen(true);
  };

  const handleSubmit = () => {
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
      const result = editingSlot
        ? await updateShowtimeAction(token, editingSlot.id, parsed.data)
        : await createShowtimeAction(token, parsed.data);
      if (!result.success) {
        setSubmitError(resolveAdminError(result, translate));
        return;
      }

      notify(translate(editingSlot ? "admin.common.saved" : "admin.common.created"), {
        variant: "success",
      });
      setFormOpen(false);
      // Follow the saved slot: a create may land on another movie or day than the
      // one the board is showing.
      const nextMovie = result.data.movie.slug;
      const nextDate = result.data.date;
      if (nextMovie !== movie || nextDate !== date) {
        router.replace(`/admin/showtimes?movie=${nextMovie}&date=${nextDate}`);
      }
      router.refresh();
    });
  };

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select
          value={movieFilter}
          onChange={(event) => setMovieFilter(event.target.value)}
          className={ADMIN_INPUT_CLASS + " w-full sm:max-w-xs"}
          aria-label={translate("admin.showtimes.movie")}
        >
          {movies.map((entry) => (
            <option key={entry.id} value={entry.slug}>
              {entry.title}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          className={ADMIN_INPUT_CLASS + " w-auto"}
          aria-label={translate("admin.showtimes.date")}
        />
        <AdminButton variant="outline" size="md" onClick={applyFilters}>
          {translate("admin.common.apply")}
        </AdminButton>
        <AdminButton
          icon={Plus}
          variant="primary"
          size="md"
          className="ml-auto"
          onClick={openCreate}
        >
          {translate("admin.showtimes.new")}
        </AdminButton>
      </div>

      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4">
        {allSlots.length === 0 ? (
          <div className="py-8 text-center">
            <CalendarClock size={28} className="mx-auto mb-2 text-(--color-text-muted)" />
            <p className="text-sm font-bold text-(--color-text-primary)">
              {translate("admin.showtimes.empty_title")}
            </p>
            <p className="mt-1 text-[12px] text-(--color-text-muted)">
              {translate("admin.showtimes.empty_body")}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {allSlots.map((slot) => (
              <div
                key={slot.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-3 py-2"
              >
                <div className="flex items-center gap-2 text-sm">
                  <CalendarClock size={14} className="text-(--color-gold)" />
                  <span className="font-bold tabular-nums">
                    {slot.startTime}–{slot.endTime}
                  </span>
                  <Badge variant={slot.isAvailable ? "success" : "neutral"} size="xs">
                    {slot.format}
                  </Badge>
                  <span className="text-[11px] text-(--color-text-muted)">
                    {slot.cinemaName} · {slot.roomName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <AdminButton
                    size="icon"
                    variant="ghost"
                    icon={Pencil}
                    label={translate("admin.common.edit")}
                    onClick={() => openEdit(slot)}
                  />
                  <AdminButton
                    size="icon"
                    variant="ghost"
                    icon={Trash2}
                    label={translate("admin.common.delete")}
                    onClick={() => setDeleteTarget(slot)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        titleKey={editingSlot ? "admin.showtimes.edit_title" : "admin.showtimes.create_title"}
        submitLabelKey={editingSlot ? "admin.common.save" : "admin.common.create"}
        error={submitError}
        isPending={isPending}
        size="lg"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminFormField labelKey="admin.showtimes.movie" error={fieldErrors.movieSlug}>
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
          <AdminFormField labelKey="admin.showtimes.date" error={fieldErrors.date}>
            <input
              type="date"
              value={values.date}
              onChange={(event) => updateField("date", event.target.value)}
              className={ADMIN_INPUT_CLASS}
            />
          </AdminFormField>
          <AdminFormField labelKey="admin.showtimes.column_room" error={fieldErrors.roomId}>
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
          <AdminFormField labelKey="admin.showtimes.column_format" error={fieldErrors.formatId}>
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
          <AdminFormField labelKey="admin.showtimes.column_time" error={fieldErrors.startTime}>
            <input
              type="time"
              value={values.startTime}
              onChange={(event) => updateField("startTime", event.target.value)}
              className={ADMIN_INPUT_CLASS}
            />
          </AdminFormField>
        </div>
      </AdminFormModal>

      <AdminDeleteDialog
        isOpen={deleteTarget !== null}
        entityName={
          deleteTarget
            ? `${deleteTarget.startTime} · ${deleteTarget.cinemaName} · ${deleteTarget.roomName}`
            : ""
        }
        onClose={() => setDeleteTarget(null)}
        onDelete={() =>
          deleteTarget
            ? deleteShowtimeAction(token ?? "", deleteTarget.id)
            : Promise.resolve({ success: false, error: translate("admin.common.load_failed") })
        }
        onDeleted={(message) => {
          setDeleteTarget(null);
          notify(message, { variant: "success" });
          router.refresh();
        }}
      />
    </>
  );
}
