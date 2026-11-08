"use client";

import { useEffect, useMemo, useState } from "react";
import { Armchair, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Skeleton } from "@/components/ui/Skeleton";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import { formatVND, getRoomDisplayName } from "@/libs/utils";
import {
  ADMIN_SEAT_KIND_CELL_CLASS,
  ADMIN_SEAT_KIND_SWATCH_CLASS,
  seatKindOfTypeName,
  type AdminSeatKind,
} from "@/features/admin/utils/seat-kind";
import {
  getAdminRoomSeatLayoutAction,
  getAdminSeatTypesAction,
} from "@/features/admin/actions/cinemas.action";
import type {
  AdminCinemaRoom,
  AdminSeatLayout,
  AdminSeatLayoutSegment,
  AdminSeatType,
} from "@/features/admin/types";

interface DisplayCell {
  key: string;
  kind: AdminSeatKind;
  /** Seat number for singles, `start-end` range for a SweetBox pair cell. */
  label: string;
  title: string;
}

interface DisplayRow {
  label: string;
  left: DisplayCell[];
  right: DisplayCell[];
}

/**
 * Mirrors the backend seat-map cell rules on the stored layout: a SweetBox
 * segment paints as ONE wide pair cell (`seatIds` cover the whole segment),
 * standard/VIP segments expand to single seats. The per-config cell arrays are
 * then folded into the same two half-rows `SeatGrid` renders, aisle included.
 */
function segmentToCells(rowLabel: string, segment: AdminSeatLayoutSegment): DisplayCell[] {
  const kind = seatKindOfTypeName(segment.seatTypeName);

  if (kind === "sweetbox" && segment.end - segment.start + 1 >= 2) {
    const range = `${segment.start}-${segment.end}`;
    return [
      {
        key: `${rowLabel}-${segment.start}-${segment.end}`,
        kind,
        label: range,
        title: `${rowLabel}(${range}) · ${segment.seatTypeName}`,
      },
    ];
  }

  const cells: DisplayCell[] = [];
  for (let seat = segment.start; seat <= segment.end; seat += 1) {
    cells.push({
      key: `${rowLabel}-${seat}`,
      kind,
      label: String(seat),
      title: `${rowLabel}${seat} · ${segment.seatTypeName}`,
    });
  }
  return cells;
}

/** Same fold as `adaptSeatMap`: >2 config segments split at the midpoint. */
function toHalfRows(segmentCells: DisplayCell[][]): [DisplayCell[], DisplayCell[]] {
  if (segmentCells.length <= 2) {
    return [segmentCells[0] ?? [], segmentCells[1] ?? []];
  }
  const middle = Math.ceil(segmentCells.length / 2);
  return [segmentCells.slice(0, middle).flat(), segmentCells.slice(middle).flat()];
}

/**
 * Read-only seat map for one room, drawn with the public booking vocabulary:
 * curved screen, two half-rows around an aisle, canonical Standard/VIP/
 * SweetBox colours and SweetBox pair cells. The layout arrives segment-encoded
 * (`start..end` sharing a seat type); colours no longer depend on seat-type id.
 */
export default function RoomSeatDiagram({
  room,
  onEditLayout,
  onOpenSeatTypes,
}: {
  room: AdminCinemaRoom;
  onEditLayout: () => void;
  onOpenSeatTypes: () => void;
}) {
  const { translate, locale } = useLocale();
  const { token } = useAuth();

  const [seatTypes, setSeatTypes] = useState<AdminSeatType[] | null>(null);
  const [layout, setLayout] = useState<AdminSeatLayout | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const roomId = room.id;
  const isLoading = seatTypes === null && loadError === null;

  /* Room switches reset the fetch state during render (React's adjust-state-on-
     prop-change pattern) so the effect below only talks to the network. */
  const fetchSignature = `${roomId}-${token ?? ""}`;
  const [syncedSignature, setSyncedSignature] = useState(fetchSignature);
  if (fetchSignature !== syncedSignature) {
    setSyncedSignature(fetchSignature);
    setSeatTypes(null);
    setLayout(null);
    setLoadError(null);
  }

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    Promise.all([getAdminSeatTypesAction(token), getAdminRoomSeatLayoutAction(token, roomId)]).then(
      ([typesResult, layoutResult]) => {
        if (cancelled) return;

        if (!typesResult.success) {
          setLoadError(typesResult.error);
          return;
        }
        if (!layoutResult.success) {
          setLoadError(layoutResult.error);
          return;
        }

        setSeatTypes(typesResult.data);
        setLayout(layoutResult.data);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [token, roomId]);

  const diagramRows = useMemo<DisplayRow[]>(() => {
    if (!layout) return [];

    return layout.rows.map((row) => {
      const segmentCells = row.segments.map((segment) =>
        segmentToCells(row.rowLabel, segment),
      );
      const [left, right] = toHalfRows(segmentCells);
      return { label: row.rowLabel, left, right };
    });
  }, [layout]);

  const hasLayout = layout !== null && layout.rows.length > 0;

  return (
    <div className="select-none">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <h3 className="text-xs font-extrabold tracking-tight text-(--color-text-primary)">
          {translate("admin.rooms.seat_diagram")} — {getRoomDisplayName(room, locale)}
        </h3>
        <div className="ml-auto flex items-center gap-2">
          <AdminButton
            size="sm"
            variant="outline"
            icon={Armchair}
            onClick={onOpenSeatTypes}
          >
            {translate("admin.seatTypes.title")}
          </AdminButton>
          <AdminButton size="sm" variant="ghost" icon={Pencil} onClick={onEditLayout}>
            {translate("admin.rooms.edit_layout")}
          </AdminButton>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2 p-4">
          <Skeleton className="mx-auto h-6 w-3/4 rounded-full" />
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-sm" />
          ))}
        </div>
      ) : loadError ? (
        <p className="px-4 py-8 text-center text-[11px] text-red-400">{loadError}</p>
      ) : !hasLayout ? (
        <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
          <p className="text-[11px] text-(--color-text-muted)">
            {translate("admin.rooms.no_layout")}
          </p>
          <AdminButton size="sm" variant="outline" icon={Pencil} onClick={onEditLayout}>
            {translate("admin.rooms.edit_layout")}
          </AdminButton>
        </div>
      ) : (
        <div className="overflow-x-auto overscroll-x-contain p-4 scrollbar-hide">
          <div className="mx-auto mb-5 flex max-w-2xl flex-col items-center gap-1.5">
            <span className="text-2xs font-bold tracking-[0.2em] text-(--color-gold) uppercase">
              {translate("admin.seatLayout.screen")}
            </span>
            <svg width={300} height={24} viewBox="0 0 300 24" fill="none" aria-hidden>
              <path
                d="M 2 20 Q 150 0 298 20"
                stroke="rgba(255,204,77,0.8)"
                strokeWidth="5"
              />
            </svg>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="inline-flex flex-col justify-center gap-2 w-full">
              {diagramRows.map((row) => (
                <div key={row.label} className="flex items-center gap-1 justify-between">
                  <span className="w-5 shrink-0 text-center text-xs font-bold text-(--color-text-muted)">
                    {row.label}
                  </span>
                  <div className="flex gap-1.5">
                    {row.left.map((cell) => (
                      <span
                        key={cell.key}
                        title={cell.title}
                        className={`flex items-center justify-center select-none ${ADMIN_SEAT_KIND_CELL_CLASS[cell.kind]}`}
                      >
                        {cell.label}
                      </span>
                    ))}
                  </div>
                  <div className="w-3 shrink-0" />
                  <div className="flex gap-1.5">
                    {row.right.map((cell) => (
                      <span
                        key={cell.key}
                        title={cell.title}
                        className={`flex items-center justify-center select-none ${ADMIN_SEAT_KIND_CELL_CLASS[cell.kind]}`}
                      >
                        {cell.label}
                      </span>
                    ))}
                  </div>
                  <span className="w-5 shrink-0 text-center text-xs font-bold text-(--color-text-muted)">
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center gap-4 border-t border-(--color-border) pt-4">
            {(seatTypes ?? []).map((type) => {
              const kind = seatKindOfTypeName(type.name);
              return (
                <span
                  key={type.id}
                  className="flex items-center gap-2 text-xs text-(--color-text-muted)"
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-sm ${ADMIN_SEAT_KIND_SWATCH_CLASS[kind]}`}
                  />
                  {type.name}
                  <span className="tabular-nums">{formatVND(type.basePrice, locale)}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
