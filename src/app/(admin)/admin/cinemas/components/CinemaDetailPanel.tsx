"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, MapPin, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFormField from "@/app/(admin)/admin/components/shared/AdminFormField";
import { ADMIN_CARD_CLASS, ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import { createCinemaSchema, toAdminFieldErrors } from "@/features/admin/schema";
import { updateCinemaAction } from "@/features/admin/actions/cinemas.action";
import { buildMapsHref } from "@/libs/geo";
import type { AdminCinema, AdminCinemaRoom } from "@/features/admin/types";
import CinemaFloorPlan from "./CinemaFloorPlan";
import RoomSeatDiagram from "./RoomSeatDiagram";

interface CinemaFormValues {
  name: string;
  address: string;
  badge: string;
  latitude: string;
  longitude: string;
}

function toFormValues(cinema: AdminCinema): CinemaFormValues {
  return {
    name: cinema.name,
    address: cinema.address,
    badge: cinema.badge ?? "",
    latitude: cinema.latitude?.toString() ?? "",
    longitude: cinema.longitude?.toString() ?? "",
  };
}

/**
 * One console card per selected cinema: an always-editable identity form (Save
 * arms only on dirty input), the schematic room grid, then the picked room's
 * seat diagram — zones separated by borders so the whole detail reads as a
 * single surface.
 */
export default function CinemaDetailPanel({
  cinema,
  selectedRoomId,
  onSelectRoom,
  onDeleteCinema,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
  onEditLayout,
  onOpenSeatTypes,
}: {
  cinema: AdminCinema;
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string | null) => void;
  onDeleteCinema: () => void;
  onAddRoom: () => void;
  onEditRoom: (room: AdminCinemaRoom) => void;
  onDeleteRoom: (room: AdminCinemaRoom) => void;
  onEditLayout: (room: AdminCinemaRoom) => void;
  onOpenSeatTypes: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<CinemaFormValues>(() => toFormValues(cinema));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  /* Switching cinemas (or a refresh landing new values) re-seeds the form
     during render — the same adjust-state-on-prop-change pattern the dialogs
     use, so the effect-free sync never paints stale fields. */
  const formSignature = JSON.stringify(toFormValues(cinema));
  const [syncedSignature, setSyncedSignature] = useState(formSignature);
  if (formSignature !== syncedSignature) {
    setSyncedSignature(formSignature);
    setValues(toFormValues(cinema));
    setFieldErrors({});
    setSubmitError(null);
  }

  const isDirty = JSON.stringify(values) !== formSignature;

  const updateField = <TField extends keyof CinemaFormValues>(
    field: TField,
    value: CinemaFormValues[TField],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSave = () => {
    const parsed = createCinemaSchema(translate).safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toAdminFieldErrors(parsed.error));
      return;
    }
    if (!token) {
      setSubmitError(translate("admin.common.session_expired"));
      return;
    }

    const form = parsed.data;
    const payload = {
      name: form.name,
      address: form.address,
      badge: form.badge === "" ? null : form.badge,
      latitude: form.latitude,
      longitude: form.longitude,
    };

    startTransition(async () => {
      const result = await updateCinemaAction(token, cinema.id, payload);
      if (!result.success) {
        setSubmitError(result.error);
        return;
      }
      notify(translate("admin.common.saved"), { variant: "success" });
      router.refresh();
    });
  };

  /* The diagram always has a room to show: an explicit pick wins, otherwise the
     first room in name order keeps the panel populated. */
  const orderedRooms = [...cinema.rooms].sort((first, second) =>
    first.name.localeCompare(second.name),
  );
  const selectedRoom =
    orderedRooms.find((room) => room.id === selectedRoomId) ?? orderedRooms[0] ?? null;

  return (
    <div className={`${ADMIN_CARD_CLASS} mt-4 overflow-hidden`}>
      <div className="border-b border-(--color-border) px-4 py-3">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <AdminFormField labelKey="admin.cinemas.name" error={fieldErrors.name} required>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              className={ADMIN_INPUT_CLASS}
            />
          </AdminFormField>

          <AdminFormField
            labelKey="admin.cinemas.address"
            error={fieldErrors.address}
            required
            className="md:col-span-2 xl:col-span-2"
          >
            <div className="relative">
              <MapPin
                size={13}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-(--color-text-muted)"
                aria-hidden
              />
              <input
                type="text"
                name="address"
                value={values.address}
                onChange={(event) => updateField("address", event.target.value)}
                className={`${ADMIN_INPUT_CLASS} pl-8`}
              />
            </div>
          </AdminFormField>

          <AdminFormField labelKey="admin.cinemas.badge" error={fieldErrors.badge}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="badge"
                value={values.badge}
                onChange={(event) => updateField("badge", event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
              {cinema.badge && !isDirty && (
                <Badge variant="gold" size="xs" className="shrink-0">
                  {cinema.badge}
                </Badge>
              )}
            </div>
          </AdminFormField>

          <div className="grid grid-cols-2 gap-3 md:col-span-2 xl:col-span-5 xl:grid-cols-2">
            <AdminFormField labelKey="admin.cinemas.latitude" error={fieldErrors.latitude}>
              <input
                type="number"
                name="latitude"
                step="any"
                value={values.latitude}
                onChange={(event) => updateField("latitude", event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </AdminFormField>
            <AdminFormField labelKey="admin.cinemas.longitude" error={fieldErrors.longitude}>
              <input
                type="number"
                name="longitude"
                step="any"
                value={values.longitude}
                onChange={(event) => updateField("longitude", event.target.value)}
                className={ADMIN_INPUT_CLASS}
              />
            </AdminFormField>
          </div>
        </div>

        {submitError && (
          <p role="alert" className="mt-2 text-[11px] font-semibold text-red-500">
            {submitError}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a
            href={buildMapsHref({ name: values.name || cinema.name, address: values.address })}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-(--color-border) px-3 text-[11px] font-bold tracking-wider text-(--color-text-secondary) uppercase transition hover:border-(--color-gold)/40 hover:text-(--admin-accent-ink)"
          >
            <ExternalLink size={12} aria-hidden />
            {translate("admin.cinemas.open_in_maps")}
          </a>
          <AdminButton
            size="sm"
            variant="primary"
            disabled={!isDirty}
            isLoading={isPending}
            onClick={handleSave}
          >
            {translate("admin.common.save")}
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
            onOpenSeatTypes={onOpenSeatTypes}
          />
        </div>
      )}
    </div>
  );
}
