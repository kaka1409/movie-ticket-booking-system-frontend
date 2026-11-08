"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminDeleteDialog from "@/app/(admin)/admin/components/shared/AdminDeleteDialog";
import { getAdminShowtimeSeatsAction, deleteShowtimeAction } from "@/features/admin/actions/showtimes.action";
import type { AdminScheduleSlot, AdminShowtimeSeats } from "@/features/admin/types";

const SEAT_COLORS: Record<string, string> = {
  free: "border-(--color-border) bg-(--color-surface-2) text-(--color-text-muted)",
  held: "border-(--color-gold)/60 bg-(--color-gold)/15 text-(--color-gold)",
  booked: "border-red-500/50 bg-red-500/20 text-red-300",
  checked_in: "border-emerald-500/60 bg-emerald-500/25 text-emerald-300",
};

/** Right-side ops drawer: slot facts + a lazily fetched read-only seat map. */
export default function ShowtimeDetailDrawer({
  slot,
  roomName,
  cinemaName,
  onClose,
  onEdit,
}: {
  slot: AdminScheduleSlot;
  roomName: string;
  cinemaName: string;
  onClose: () => void;
  onEdit: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [seats, setSeats] = useState<AdminShowtimeSeats | null>(null);
  const [seatsError, setSeatsError] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!token) return;
    getAdminShowtimeSeatsAction(token, slot.id).then((result) => {
      if (cancelled) return;
      if (result.success) setSeats(result.data);
      else setSeatsError(true);
    });
    return () => {
      cancelled = true;
    };
  }, [slot.id, token]);

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60" onClick={onClose}>
      <aside
        className="flex h-full w-full max-w-md flex-col border-l border-(--color-border) bg-(--color-surface)"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b border-(--color-border) p-4">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-(--color-text-primary)">
              {slot.movie.title}
            </h3>
            <p className="mt-0.5 text-[11px] text-(--color-text-muted)">
              {slot.startTime}–{slot.endTime} · {cinemaName} · {roomName} · {slot.format}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={translate("admin.common.close")}
            className="rounded-lg p-1.5 text-(--color-text-muted) hover:bg-(--color-surface-2)"
          >
            <X size={16} aria-hidden />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-3 flex flex-wrap gap-2 text-[11px]">
            <Badge variant="neutral" size="xs">
              {translate("admin.showtimes.booked_label")} {slot.bookedSeats}
            </Badge>
            <Badge variant="neutral" size="xs">
              {translate("admin.showtimes.held_label")} {slot.heldSeats}
            </Badge>
            <Badge variant="neutral" size="xs">
              {translate("admin.showtimes.total_label")} {slot.totalSeats}
            </Badge>
          </div>

          <h4 className="mb-2 text-[11px] font-bold tracking-wider text-(--color-text-muted) uppercase">
            {translate("admin.showtimes.seat_map")}
          </h4>

          {!seats && !seatsError && (
            <div className="space-y-2" aria-hidden>
              {Array.from({ length: 8 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="h-7 animate-pulse rounded-lg bg-(--color-surface-2)"
                />
              ))}
            </div>
          )}
          {seatsError && (
            <p className="text-[12px] text-(--color-text-muted)">
              {translate("admin.common.load_failed")}
            </p>
          )}
          {seats && (
            <div className="space-y-1.5">
              {seats.rows.map((row) => (
                <div key={row.label} className="flex items-center gap-1.5">
                  <span className="w-6 shrink-0 text-center text-[10px] font-bold text-(--color-text-muted)">
                    {row.label}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {row.seats.map((seat) => (
                      <span
                        key={seat.id}
                        title={`${seat.label} · ${seat.status}`}
                        className={`flex h-6 w-6 items-center justify-center rounded border text-[9px] font-bold ${SEAT_COLORS[seat.status]}`}
                      >
                        {seat.seatNumber}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-(--color-text-muted)">
                {(["free", "held", "booked", "checked_in"] as const).map((status) => (
                  <span key={status} className="flex items-center gap-1">
                    <span className={`inline-block h-2.5 w-2.5 rounded-sm ${SEAT_COLORS[status].split(" ")[1]}`} />
                    {translate(`admin.showtimes.seat_${status}`)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-(--color-border) p-4">
          <AdminButton
            size="md"
            variant="ghost"
            icon={Trash2}
            label={translate("admin.common.delete")}
            onClick={() => setIsDeleteOpen(true)}
          />
          <AdminButton size="md" variant="primary" icon={Pencil} onClick={onEdit}>
            {translate("admin.common.edit")}
          </AdminButton>
        </footer>
      </aside>

      <AdminDeleteDialog
        isOpen={isDeleteOpen}
        entityName={`${slot.startTime} · ${slot.movie.title} · ${roomName}`}
        onClose={() => setIsDeleteOpen(false)}
        onDelete={() =>
          token
            ? deleteShowtimeAction(token, slot.id)
            : Promise.resolve({ success: false, error: translate("admin.common.load_failed") })
        }
        onDeleted={(message) => {
          setIsDeleteOpen(false);
          notify(message, { variant: "success" });
          onClose();
          router.refresh();
        }}
      />
    </div>
  );
}
