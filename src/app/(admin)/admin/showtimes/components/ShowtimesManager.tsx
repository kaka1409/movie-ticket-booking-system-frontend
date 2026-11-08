"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Plus, Sparkles } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import type {
  AdminCatalogEntry,
  AdminCinema,
  AdminScheduleDayCount,
  AdminScheduleResult,
  AdminScheduleSlot,
  AdminShowtimeSlot,
  AdminSlotTemplate,
} from "@/features/admin/types";
import ScheduleDateStrip from "./ScheduleDateStrip";
import ScheduleHierarchy from "./ScheduleHierarchy";
import MovieFilterGrid from "./MovieFilterGrid";
import ShowtimeDetailDrawer from "./ShowtimeDetailDrawer";
import ShowtimeFormDialog from "./ShowtimeFormDialog";
import SeedScheduleModal from "./SeedScheduleModal";
import type { ShowtimeFormState } from "./useShowtimeForm";

interface ShowtimesManagerProps {
  movies: {
    id: string;
    title: string;
    slug: string;
    posterUrl?: string | null;
    duration?: number | null;
  }[];
  cinemas: AdminCinema[];
  formats: AdminCatalogEntry[];
  templates: AdminSlotTemplate[];
  schedule: AdminScheduleResult;
  dayCounts: AdminScheduleDayCount[];
  stripDates: string[];
  date: string;
  movie: string;
}

interface DetailTarget {
  slot: AdminScheduleSlot;
  roomId: string;
  roomName: string;
  roomNameVi: string | null;
  cinemaName: string;
}

/**
 * Day-first schedule board: date strip → cinema → room → showtime cards.
 * The server component streams one day at a time; date changes navigate via
 * `?date=` so the hierarchy always reflects committed rows.
 */
export default function ShowtimesManager({
  movies,
  cinemas,
  formats,
  templates,
  schedule,
  dayCounts,
  stripDates,
  date,
  movie,
}: ShowtimesManagerProps) {
  const { translate } = useLocale();
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();

  const [movieFilter, setMovieFilter] = useState(movie);
  const [detail, setDetail] = useState<DetailTarget | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editSlot, setEditSlot] = useState<AdminShowtimeSlot | null>(null);
  const [editDefaults, setEditDefaults] = useState({ movieSlug: "", date });
  const [seedOpen, setSeedOpen] = useState(false);

  const counts = useMemo(() => new Map(dayCounts.map((row) => [row.date, row.count])), [dayCounts]);

  const selectDate = (next: string) => {
    startNavigation(() => router.push(`/admin/showtimes?date=${next}`));
  };

  const openSlot = (
    slot: AdminScheduleSlot,
    roomId: string,
    roomName: string,
    roomNameVi: string | null,
    cinemaName: string,
  ) => {
    setDetail({ slot, roomId, roomName, roomNameVi, cinemaName });
  };

  const openEdit = (target: DetailTarget) => {
    setEditDefaults({ movieSlug: target.slot.movie.slug, date: schedule.date });
    setEditSlot({
      id: target.slot.id,
      startTime: target.slot.startTime,
      endTime: target.slot.endTime,
      format: target.slot.format,
      roomId: target.roomId,
      roomName: target.roomName,
      roomNameVi: target.roomNameVi,
      isAvailable: !target.slot.isPast,
    });
    setDetail(null);
  };

  const sampleForm = (): ShowtimeFormState => ({
    movieSlug: movies[0]?.slug ?? "",
    roomId: cinemas.flatMap((cinema) => cinema.rooms)[0]?.id ?? "",
    formatId: formats[0]?.id ?? "",
    date: schedule.date,
    startTime: "19:30",
  });

  return (
    <div className={isNavigating ? "pointer-events-none opacity-60 transition-opacity" : ""}>
      <div className="mb-4 space-y-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4">
        <ScheduleDateStrip
          dates={stripDates}
          counts={counts}
          selected={schedule.date}
          onSelect={selectDate}
        />

        <MovieFilterGrid movies={movies} value={movieFilter} onChange={setMovieFilter} />

        <div className="flex items-center justify-start gap-2 border-t border-(--color-border) pt-3">
          <AdminButton size="sm" variant="primary" icon={Plus} onClick={() => setCreateOpen(true)}>
            {translate("admin.showtimes.new")}
          </AdminButton>
          <AdminButton
            size="sm"
            variant="outline"
            icon={Sparkles}
            onClick={() => setSeedOpen(true)}
          >
            {translate("admin.showtimes.seed")}
          </AdminButton>
        </div>
      </div>

      <ScheduleHierarchy
        schedule={schedule}
        movieFilter={movieFilter}
        onSlotClick={(slot, roomId, roomName, roomNameVi, cinemaName) =>
          openSlot(slot, roomId, roomName, roomNameVi, cinemaName)
        }
      />

      {schedule.cinemas.length === 0 && (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) py-10 text-center">
          <CalendarClock size={28} className="mx-auto mb-2 text-(--color-text-muted)" />
          <p className="text-sm font-bold text-(--color-text-primary)">
            {translate("admin.showtimes.empty_title")}
          </p>
        </div>
      )}

      {detail && (
        <ShowtimeDetailDrawer
          slot={detail.slot}
          roomName={detail.roomName}
          roomNameVi={detail.roomNameVi}
          cinemaName={detail.cinemaName}
          onClose={() => setDetail(null)}
          onEdit={() => openEdit(detail)}
        />
      )}

      <ShowtimeFormDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        slot={null}
        defaults={{ movieSlug: movies[0]?.slug ?? "", date: schedule.date }}
        movies={movies}
        cinemas={cinemas}
        formats={formats}
        sampleForm={sampleForm}
      />

      {editSlot && (
        <ShowtimeFormDialog
          isOpen
          onClose={() => setEditSlot(null)}
          slot={editSlot}
          defaults={editDefaults}
          movies={movies}
          cinemas={cinemas}
          formats={formats}
        />
      )}

      <SeedScheduleModal
        isOpen={seedOpen}
        onClose={() => setSeedOpen(false)}
        templates={templates}
      />
    </div>
  );
}
