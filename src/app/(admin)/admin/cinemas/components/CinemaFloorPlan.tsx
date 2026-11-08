"use client";

import { Pencil, Plus, Trash2, type LucideIcon } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import { getRoomDisplayName } from "@/libs/utils";
import type { AdminCinema, AdminCinemaRoom } from "@/features/admin/types";

/**
 * Schematic floor plan: the schema stores no room coordinates, so rooms tile an
 * auto-fill grid inside a "building" frame. Selecting a block drives the seat
 * diagram below; the per-room actions stay on the block itself.
 */
export default function CinemaFloorPlan({
  cinema,
  selectedRoomId,
  onSelectRoom,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
}: {
  cinema: AdminCinema;
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onAddRoom: () => void;
  onEditRoom: (room: AdminCinemaRoom) => void;
  onDeleteRoom: (room: AdminCinemaRoom) => void;
}) {
  const { translate, locale } = useLocale();
  const rooms = [...cinema.rooms].sort((first, second) =>
    getRoomDisplayName(first, locale).localeCompare(getRoomDisplayName(second, locale)),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <h3 className="text-xs font-extrabold tracking-tight text-(--color-text-primary)">
          {translate("admin.cinemas.floor_plan")}
        </h3>
        <span className="text-[11px] text-(--color-text-muted)">
          {translate("admin.cinemas.floor_plan_hint")}
        </span>
        <AdminButton
          icon={Plus}
          variant="primary"
          size="sm"
          className="ml-auto"
          onClick={onAddRoom}
        >
          {translate("admin.rooms.new")}
        </AdminButton>
      </div>

      {rooms.length === 0 ? (
        <p className="px-4 py-8 text-center text-[11px] text-(--color-text-muted)">
          {translate("admin.rooms.empty_body")}
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))] gap-2 p-4">
          {rooms.map((room) => {
            const isSelected = room.id === selectedRoomId;
            return (
              <div
                key={room.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => onSelectRoom(room.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectRoom(room.id);
                  }
                }}
                className={`flex cursor-pointer flex-col rounded-xl border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold) ${
                  isSelected
                    ? "border-(--color-gold) bg-(--color-gold)/10"
                    : "border-(--color-border) bg-(--color-surface-2) hover:border-(--color-border-strong) hover:bg-(--color-surface)"
                }`}
              >
                <div className="flex-1 px-3.5 py-3 text-left">
                  <p className="truncate text-[13px] font-bold text-(--color-text-primary)">
                    {getRoomDisplayName(room, locale)}
                  </p>
                  <p className="mt-1 text-[11px] text-(--color-text-muted)">
                    {translate("admin.rooms.column_seats")}: {room.seats} ·{" "}
                    {translate("admin.rooms.column_showtimes")}: {room.showtimes}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-0.5 border-t border-(--color-border)/60 px-1.5 py-1">
                  <RoomBlockAction
                    icon={Pencil}
                    label={translate("admin.common.edit")}
                    onClick={() => onEditRoom(room)}
                  />
                  <RoomBlockAction
                    icon={Trash2}
                    label={translate("admin.common.delete")}
                    onClick={() => onDeleteRoom(room)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RoomBlockAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      /* The block itself selects the room — these must not bubble into that. */
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-(--color-text-muted) transition hover:bg-(--color-surface) hover:text-(--color-text-primary)"
    >
      <Icon size={12} aria-hidden />
    </button>
  );
}
