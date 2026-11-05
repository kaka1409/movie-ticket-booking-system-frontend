"use client";

import { ExternalLink, MapPin, Pencil, Trash2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Badge from "@/components/ui/Badge";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import { ADMIN_CARD_CLASS } from "@/features/admin/constants";
import { buildMapsHref } from "@/libs/geo";
import type { AdminCinema, AdminCinemaRoom } from "@/features/admin/types";
import CinemaFloorPlan from "./CinemaFloorPlan";
import RoomSeatDiagram from "./RoomSeatDiagram";

/**
 * One console card per selected cinema: identity header, the schematic room
 * grid, then the picked room's seat diagram — zones separated by borders so the
 * whole detail reads as a single surface.
 */
export default function CinemaDetailPanel({
  cinema,
  selectedRoomId,
  onSelectRoom,
  onEditCinema,
  onDeleteCinema,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
  onEditLayout,
}: {
  cinema: AdminCinema;
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string | null) => void;
  onEditCinema: () => void;
  onDeleteCinema: () => void;
  onAddRoom: () => void;
  onEditRoom: (room: AdminCinemaRoom) => void;
  onDeleteRoom: (room: AdminCinemaRoom) => void;
  onEditLayout: (room: AdminCinemaRoom) => void;
}) {
  const { translate } = useLocale();
  /* The diagram always has a room to show: an explicit pick wins, otherwise the
     first room in name order keeps the panel populated. */
  const orderedRooms = [...cinema.rooms].sort((first, second) =>
    first.name.localeCompare(second.name),
  );
  const selectedRoom =
    orderedRooms.find((room) => room.id === selectedRoomId) ?? orderedRooms[0] ?? null;

  return (
    <div className={`${ADMIN_CARD_CLASS} mt-4 overflow-hidden`}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-sm font-extrabold tracking-tight text-(--color-text-primary)">
              {cinema.name}
            </h2>
            {cinema.badge && (
              <Badge variant="gold" size="xs">
                {cinema.badge}
              </Badge>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1.5 truncate text-[11px] text-(--color-text-muted)">
            <MapPin size={12} className="shrink-0 text-(--color-gold)" aria-hidden />
            {cinema.address}
          </p>
          {cinema.latitude !== null && cinema.longitude !== null && (
            <p className="mt-0.5 pl-4.5 text-[10px] text-(--color-text-muted)">
              {cinema.latitude.toFixed(5)}, {cinema.longitude.toFixed(5)}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={buildMapsHref({ name: cinema.name, address: cinema.address })}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-(--color-border) px-3 text-[11px] font-bold tracking-wider text-(--color-text-secondary) uppercase transition hover:border-(--color-gold)/40 hover:text-(--admin-accent-ink)"
          >
            <ExternalLink size={12} aria-hidden />
            {translate("admin.cinemas.open_in_maps")}
          </a>
          <AdminButton size="sm" variant="ghost" icon={Pencil} onClick={onEditCinema}>
            {translate("admin.common.edit")}
          </AdminButton>
          <AdminButton size="sm" variant="danger" icon={Trash2} onClick={onDeleteCinema}>
            {translate("admin.common.delete")}
          </AdminButton>
        </div>
      </div>

      <div className="border-t border-(--color-border)">
        <CinemaFloorPlan
          cinema={cinema}
          selectedRoomId={selectedRoom?.id ?? null}
          onSelectRoom={onSelectRoom}
          onAddRoom={onAddRoom}
          onEditRoom={onEditRoom}
          onDeleteRoom={onDeleteRoom}
        />
      </div>

      {selectedRoom && (
        <div className="border-t border-(--color-border)">
          <RoomSeatDiagram
            key={selectedRoom.id}
            room={selectedRoom}
            onEditLayout={() => onEditLayout(selectedRoom)}
          />
        </div>
      )}
    </div>
  );
}
