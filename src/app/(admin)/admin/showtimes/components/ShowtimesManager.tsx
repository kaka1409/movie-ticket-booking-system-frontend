"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, ChevronDown, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminDeleteDialog from "@/app/(admin)/admin/components/shared/AdminDeleteDialog";
import AdminFormModal from "@/app/(admin)/admin/components/shared/AdminFormModal";
import { deleteShowtimeAction } from "@/features/admin/actions/showtimes.action";
import type {
  AdminCatalogEntry,
  AdminCinema,
  AdminShowtimeBoard,
  AdminShowtimeSlot,
} from "@/features/admin/types";
import ShowtimeFormFields from "./ShowtimeFormFields";
import ShowtimeInlineEdit from "./ShowtimeInlineEdit";
import ShowtimesFiltersCard, { type ShowtimeFilterDraft } from "./ShowtimesFiltersCard";
import { useShowtimeForm, type ShowtimeFormState } from "./useShowtimeForm";

interface ShowtimesManagerProps {
  movies: { id: string; title: string; slug: string }[];
  cinemas: AdminCinema[];
  formats: AdminCatalogEntry[];
  board: AdminShowtimeBoard | null;
  movie: string;
  date: string;
}

type SlotWithCinema = AdminShowtimeSlot & { cinemaName: string };

interface SlotFilters {
  format: string;
  cinema: string;
}

const EMPTY_SLOT_FILTERS: SlotFilters = { format: "", cinema: "" };

/**
 * Schedule board for one movie-day. The board itself is the public
 * `GET /showtimes` read (grouped by cinema), so a slot the operator creates
 * here is exactly what a customer will see on the movie page. Rows expand into
 * an inline editor like the other console tables.
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
  const [isNavigating, startNavigation] = useTransition();

  const [formOpen, setFormOpen] = useState(false);
  const [expandedSlotId, setExpandedSlotId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SlotWithCinema | null>(null);
  const [slotFilters, setSlotFilters] = useState<SlotFilters>(EMPTY_SLOT_FILTERS);

  const boardDefaults = { movieSlug: board?.movie.slug ?? movie, date: board?.date ?? date };
  const cinemaNames = [...new Set((board?.cinemas ?? []).map((cinema) => cinema.name))];

  const allSlots: SlotWithCinema[] = [];
  board?.cinemas.forEach((cinema) => {
    cinema.showtimes.forEach((slot) => {
      allSlots.push({ ...slot, cinemaName: cinema.name });
    });
  });

  const visibleSlots = allSlots.filter(
    (slot) =>
      (slotFilters.format === "" || slot.format === slotFilters.format) &&
      (slotFilters.cinema === "" || slot.cinemaName === slotFilters.cinema),
  );

  const isSlotFiltered = slotFilters.format !== "" || slotFilters.cinema !== "";
  const isFiltered = movie !== "" || date !== "" || isSlotFiltered;

  const applyFilters = (draft: ShowtimeFilterDraft) => {
    setSlotFilters({ format: draft.format, cinema: draft.cinema });
    const params = new URLSearchParams();
    if (draft.movie) params.set("movie", draft.movie);
    if (draft.date) params.set("date", draft.date);
    const query = params.toString();
    startNavigation(() =>
      router.push(query === "" ? "/admin/showtimes" : `/admin/showtimes?${query}`),
    );
  };

  const clearFilters = () => {
    setSlotFilters(EMPTY_SLOT_FILTERS);
    startNavigation(() => router.push("/admin/showtimes"));
  };

  const sampleForm = (): ShowtimeFormState => ({
    movieSlug: boardDefaults.movieSlug || movies[0]?.slug || "",
    roomId: cinemas.flatMap((cinema) => cinema.rooms)[0]?.id ?? "",
    formatId: formats[0]?.id ?? "",
    date: boardDefaults.date,
    startTime: "19:30",
  });

  return (
    <>
      <ShowtimesFiltersCard
        movies={movies}
        formats={formats}
        cinemas={cinemaNames}
        movie={boardDefaults.movieSlug}
        date={boardDefaults.date}
        format={slotFilters.format}
        cinema={slotFilters.cinema}
        isFiltered={isFiltered}
        onApply={applyFilters}
        onClear={clearFilters}
        onCreate={() => setFormOpen(true)}
      />

      <div
        className={`rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 ${
          isNavigating ? "pointer-events-none opacity-60 transition-opacity" : ""
        }`}
      >
        {visibleSlots.length === 0 ? (
          <div className="py-8 text-center">
            <CalendarClock size={28} className="mx-auto mb-2 text-(--color-text-muted)" />
            <p className="text-sm font-bold text-(--color-text-primary)">
              {translate(
                isSlotFiltered ? "admin.common.no_results" : "admin.showtimes.empty_title",
              )}
            </p>
            <p className="mt-1 text-[12px] text-(--color-text-muted)">
              {translate(
                isSlotFiltered ? "admin.common.no_results_body" : "admin.showtimes.empty_body",
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleSlots.map((slot) => {
              const isExpanded = expandedSlotId === slot.id;
              return (
                <div
                  key={slot.id}
                  className="rounded-xl border border-(--color-border) bg-(--color-surface-2)"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
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
                      <button
                        type="button"
                        onClick={() => setExpandedSlotId(isExpanded ? null : slot.id)}
                        aria-expanded={isExpanded}
                        className="admin-expand-toggle-button"
                      >
                        {translate(isExpanded ? "admin.common.collapse" : "admin.common.edit")}
                        <ChevronDown
                          size={14}
                          aria-hidden
                          className={isExpanded ? "rotate-180" : ""}
                        />
                      </button>
                      <AdminButton
                        size="icon"
                        variant="ghost"
                        icon={Trash2}
                        label={translate("admin.common.delete")}
                        onClick={() => setDeleteTarget(slot)}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-(--color-border) px-3 py-3">
                      <ShowtimeInlineEdit
                        slot={slot}
                        defaults={boardDefaults}
                        movies={movies}
                        cinemas={cinemas}
                        formats={formats}
                        onClose={() => setExpandedSlotId(null)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ShowtimeFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        movies={movies}
        cinemas={cinemas}
        formats={formats}
        defaults={boardDefaults}
        sampleForm={sampleForm}
      />

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

function ShowtimeFormDialog({
  isOpen,
  onClose,
  movies,
  cinemas,
  formats,
  defaults,
  sampleForm,
}: {
  isOpen: boolean;
  onClose: () => void;
  movies: { id: string; title: string; slug: string }[];
  cinemas: AdminCinema[];
  formats: AdminCatalogEntry[];
  defaults: { movieSlug: string; date: string };
  sampleForm: () => ShowtimeFormState;
}) {
  const { values, fieldErrors, submitError, isPending, updateField, fillSample, submit } =
    useShowtimeForm({
      slot: null,
      defaults,
      formats,
      resetKey: `${isOpen}-new`,
      onSaved: onClose,
    });

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submit}
      titleKey="admin.showtimes.create_title"
      submitLabelKey="admin.common.create"
      error={submitError}
      isPending={isPending}
      size="lg"
      onFillSample={() => fillSample(sampleForm())}
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
