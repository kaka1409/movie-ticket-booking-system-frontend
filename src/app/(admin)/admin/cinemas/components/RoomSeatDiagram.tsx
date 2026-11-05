"use client";

import { useEffect, useMemo, useState } from "react";
import { Armchair, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Skeleton } from "@/components/ui/Skeleton";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import { useAdminChartTheme } from "@/features/admin/hooks/useAdminChartTheme";
import { formatVND } from "@/libs/utils";
import {
  getAdminRoomSeatLayoutAction,
  getAdminSeatTypesAction,
} from "@/features/admin/actions/cinemas.action";
import type {
  AdminCinemaRoom,
  AdminSeatLayout,
  AdminSeatType,
} from "@/features/admin/types";

interface SeatCell {
  number: number;
  color: string;
  typeName: string;
}

interface DiagramRow {
  label: string;
  seats: SeatCell[];
}

/**
 * Read-only seat map for one room. The layout arrives segment-encoded
 * (`start..end` sharing a seat type), so segments expand into individual cells
 * here; colours come from the chart palette so the diagram re-themes with the
 * console.
 */
export default function RoomSeatDiagram({
  room,
  onEditLayout,
}: {
  room: AdminCinemaRoom;
  onEditLayout: () => void;
}) {
  const { translate, locale } = useLocale();
  const { token } = useAuth();
  const { isLight, palette } = useAdminChartTheme();

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

  const seatColors = useMemo(
    () => [
      palette.gold,
      palette.cyan,
      palette.emerald,
      palette.purple,
      palette.blue,
      palette.orange,
      palette.teal,
      palette.rose,
    ],
    [palette],
  );

  const seatColorByTypeId = useMemo(() => {
    const map = new Map<string, string>();
    (seatTypes ?? []).forEach((type, index) => {
      map.set(type.id, seatColors[index % seatColors.length]);
    });
    return map;
  }, [seatTypes, seatColors]);

  const diagramRows = useMemo<DiagramRow[]>(() => {
    if (!layout) return [];

    return layout.rows.map((row) => {
      const seats: SeatCell[] = [];

      for (const segment of row.segments) {
        const color = seatColorByTypeId.get(segment.seatTypeId) ?? palette.surface;
        for (let number = segment.start; number <= segment.end; number += 1) {
          seats.push({ number, color, typeName: segment.seatTypeName });
        }
      }

      seats.sort((first, second) => first.number - second.number);
      return { label: row.rowLabel, seats };
    });
  }, [layout, seatColorByTypeId, palette.surface]);

  const hasLayout = layout !== null && layout.rows.length > 0;
  const seatTextColor = isLight ? "#ffffff" : "#0f0f0f";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <Armchair size={15} className="text-(--color-gold)" aria-hidden />
        <h3 className="text-xs font-extrabold tracking-tight text-(--color-text-primary)">
          {translate("admin.rooms.seat_diagram")} — {room.name}
        </h3>
        <AdminButton
          size="sm"
          variant="ghost"
          icon={Pencil}
          className="ml-auto"
          onClick={onEditLayout}
        >
          {translate("admin.rooms.edit_layout")}
        </AdminButton>
      </div>

      {isLoading ? (
        <div className="space-y-2 p-4">
          <Skeleton className="mx-auto h-3.5 w-3/4 rounded-full" />
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
        <div className="overflow-x-auto overscroll-x-contain p-4">
          <div className="mx-auto mb-5 flex max-w-2xl flex-col items-center gap-1.5">
            <div className="h-3.5 w-full rounded-full bg-(--color-gold)/70" />
            <span className="text-2xs font-bold tracking-[0.2em] text-(--color-text-muted) uppercase">
              {translate("admin.seatLayout.screen")}
            </span>
          </div>

          <div className="space-y-2">
            {diagramRows.map((row) => (
              <div key={row.label} className="flex items-center gap-2.5">
                <span className="w-8 shrink-0 text-center text-xs font-bold text-(--color-text-muted)">
                  {row.label}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {row.seats.map((seat) => (
                    <span
                      key={seat.number}
                      title={`${seat.typeName} · ${seat.number}`}
                      className="flex h-14 w-14 items-center justify-center rounded-sm text-xs font-bold"
                      style={{ backgroundColor: seat.color, color: seatTextColor }}
                    >
                      {seat.number}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-(--color-border) pt-4">
            {(seatTypes ?? []).map((type, index) => (
              <span
                key={type.id}
                className="flex items-center gap-2 text-xs text-(--color-text-muted)"
              >
                <span
                  className="inline-block h-4 w-4 rounded-sm"
                  style={{ backgroundColor: seatColors[index % seatColors.length] }}
                />
                {type.name}
                <span className="tabular-nums">{formatVND(type.basePrice, locale)}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
