"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminDeleteDialog from "@/app/(admin)/admin/components/shared/AdminDeleteDialog";
import AdminFormField from "@/app/(admin)/admin/components/shared/AdminFormField";
import AdminFormModal from "@/app/(admin)/admin/components/shared/AdminFormModal";
import AdminTable, {
  type AdminTableColumn,
} from "@/app/(admin)/admin/components/shared/AdminTable";
import { ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import { createCinemaSchema, createRoomSchema, toAdminFieldErrors } from "@/features/admin/schema";
import {
  createCinemaAction,
  createRoomAction,
  deleteCinemaAction,
  deleteRoomAction,
  updateCinemaAction,
  updateRoomAction,
} from "@/features/admin/actions/cinemas.action";
import type { AdminCinema, AdminCinemaRoom, AdminRoom } from "@/features/admin/types";
import CinemaDetailPanel from "./CinemaDetailPanel";
import CinemaMap from "./CinemaMap";
import SeatLayoutEditor from "./SeatLayoutEditor";

export default function CinemasManager({ cinemas }: { cinemas: AdminCinema[] }) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(
    cinemas[0]?.id ?? null,
  );
  const [cinemaFormTarget, setCinemaFormTarget] = useState<AdminCinema | "new" | null>(null);
  const [roomFormTarget, setRoomFormTarget] = useState<AdminRoom | "new" | null>(null);
  const [deleteCinemaTarget, setDeleteCinemaTarget] = useState<AdminCinema | null>(null);
  const [deleteRoomTarget, setDeleteRoomTarget] = useState<AdminCinemaRoom | null>(null);
  const [layoutRoom, setLayoutRoom] = useState<AdminCinemaRoom | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const selectedCinema = cinemas.find((cinema) => cinema.id === selectedCinemaId) ?? null;

  const selectCinema = (cinemaId: string) => {
    setSelectedCinemaId(cinemaId);
    const cinema = cinemas.find((entry) => entry.id === cinemaId);
    setSelectedRoomId(cinema?.rooms[0]?.id ?? null);
  };

  const cinemaColumns: AdminTableColumn<AdminCinema>[] = [
    {
      id: "cinema",
      headerKey: "admin.cinemas.column_cinema",
      cell: (cinema) => (
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-surface-2) text-(--color-gold)">
            <Building2 size={15} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-(--color-text-primary)">{cinema.name}</p>
            <p className="flex items-center gap-1 truncate text-[11px] text-(--color-text-muted)">
              <MapPin size={11} aria-hidden />
              {cinema.address}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "rooms",
      headerKey: "admin.cinemas.column_rooms",
      className: "w-20",
      align: "right",
      cell: (cinema) => <span className="tabular-nums">{cinema.rooms.length}</span>,
    },
  ];

  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <AdminButton
          icon={Plus}
          variant="primary"
          size="md"
          onClick={() => setCinemaFormTarget("new")}
        >
          {translate("admin.cinemas.new")}
        </AdminButton>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="min-w-0 lg:col-span-3">
          <CinemaMap cinema={selectedCinema ?? cinemas[0] ?? null} />
        </div>

        <div className="min-w-0 lg:col-span-2">
          <AdminTable
            columns={cinemaColumns}
            rows={cinemas}
            getRowId={(cinema) => cinema.id}
            emptyIcon={Building2}
            emptyTitleKey="admin.cinemas.empty_title"
            emptyDescriptionKey="admin.cinemas.empty_body"
            captionKey="admin.cinemas.title"
            onRowClick={(cinema) => selectCinema(cinema.id)}
            isRowSelected={(cinema) => cinema.id === selectedCinemaId}
          />
        </div>
      </div>

      {selectedCinema && (
        <CinemaDetailPanel
          cinema={selectedCinema}
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
          onEditCinema={() => setCinemaFormTarget(selectedCinema)}
          onDeleteCinema={() => setDeleteCinemaTarget(selectedCinema)}
          onAddRoom={() => setRoomFormTarget("new")}
          onEditRoom={(room) =>
            setRoomFormTarget({
              ...room,
              cinemaId: selectedCinema.id,
              cinemaName: selectedCinema.name,
            })
          }
          onDeleteRoom={setDeleteRoomTarget}
          onEditLayout={setLayoutRoom}
        />
      )}

      <CinemaFormDialog
        isOpen={cinemaFormTarget !== null}
        cinema={cinemaFormTarget === "new" ? null : cinemaFormTarget}
        onClose={() => setCinemaFormTarget(null)}
      />

      <RoomFormDialog
        isOpen={roomFormTarget !== null}
        room={roomFormTarget === "new" ? null : roomFormTarget}
        cinemas={cinemas}
        defaultCinemaId={selectedCinema?.id ?? cinemas[0]?.id ?? ""}
        onClose={() => setRoomFormTarget(null)}
      />

      <AdminDeleteDialog
        isOpen={deleteCinemaTarget !== null}
        entityName={deleteCinemaTarget?.name ?? ""}
        onClose={() => setDeleteCinemaTarget(null)}
        onDelete={() => deleteCinemaAction(token ?? "", deleteCinemaTarget?.id ?? "")}
        onDeleted={(message) => {
          setDeleteCinemaTarget(null);
          notify(message, { variant: "success" });
          router.refresh();
        }}
      />

      <AdminDeleteDialog
        isOpen={deleteRoomTarget !== null}
        entityName={deleteRoomTarget?.name ?? ""}
        onClose={() => setDeleteRoomTarget(null)}
        onDelete={() => deleteRoomAction(token ?? "", deleteRoomTarget?.id ?? "")}
        onDeleted={(message) => {
          setDeleteRoomTarget(null);
          notify(message, { variant: "success" });
          router.refresh();
        }}
      />

      <SeatLayoutEditor
        isOpen={layoutRoom !== null}
        room={layoutRoom}
        onClose={() => setLayoutRoom(null)}
      />
    </>
  );
}

function CinemaFormDialog({
  isOpen,
  cinema,
  onClose,
}: {
  isOpen: boolean;
  cinema: AdminCinema | null;
  onClose: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<{
    name: string;
    address: string;
    badge: string;
    latitude: string;
    longitude: string;
  }>(() =>
    cinema
      ? {
          name: cinema.name,
          address: cinema.address,
          badge: cinema.badge ?? "",
          latitude: cinema.latitude?.toString() ?? "",
          longitude: cinema.longitude?.toString() ?? "",
        }
      : { name: "", address: "", badge: "", latitude: "", longitude: "" },
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formSignature = `${isOpen}-${cinema?.id ?? "new"}`;
  const [syncedFormSignature, setSyncedFormSignature] = useState(formSignature);
  if (formSignature !== syncedFormSignature) {
    setSyncedFormSignature(formSignature);
    setValues(
      cinema
        ? {
            name: cinema.name,
            address: cinema.address,
            badge: cinema.badge ?? "",
            latitude: cinema.latitude?.toString() ?? "",
            longitude: cinema.longitude?.toString() ?? "",
          }
        : { name: "", address: "", badge: "", latitude: "", longitude: "" },
    );
    setFieldErrors({});
    setSubmitError(null);
  }

  const updateField = <TField extends keyof typeof values>(
    field: TField,
    value: (typeof values)[TField],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = () => {
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
      const result = cinema
        ? await updateCinemaAction(token, cinema.id, payload)
        : await createCinemaAction(token, payload);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate(cinema ? "admin.common.saved" : "admin.common.created"), {
        variant: "success",
      });
      onClose();
      router.refresh();
    });
  };

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      titleKey={cinema ? "admin.cinemas.edit_title" : "admin.cinemas.new"}
      submitLabelKey={cinema ? "admin.common.save" : "admin.common.create"}
      error={submitError}
      isPending={isPending}
      size="md"
    >
      <AdminFormField labelKey="admin.cinemas.name" error={fieldErrors.name}>
        <input
          type="text"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          className={ADMIN_INPUT_CLASS}
          autoFocus
        />
      </AdminFormField>

      <AdminFormField labelKey="admin.cinemas.address" error={fieldErrors.address}>
        <input
          type="text"
          value={values.address}
          onChange={(event) => updateField("address", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>

      <AdminFormField labelKey="admin.cinemas.badge" error={fieldErrors.badge}>
        <input
          type="text"
          value={values.badge}
          onChange={(event) => updateField("badge", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>

      <div className="grid grid-cols-2 gap-3">
        <AdminFormField labelKey="admin.cinemas.latitude" error={fieldErrors.latitude}>
          <input
            type="number"
            step="any"
            value={values.latitude}
            onChange={(event) => updateField("latitude", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>
        <AdminFormField labelKey="admin.cinemas.longitude" error={fieldErrors.longitude}>
          <input
            type="number"
            step="any"
            value={values.longitude}
            onChange={(event) => updateField("longitude", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>
      </div>
    </AdminFormModal>
  );
}

function RoomFormDialog({
  isOpen,
  room,
  cinemas,
  defaultCinemaId,
  onClose,
}: {
  isOpen: boolean;
  room: AdminRoom | null;
  cinemas: AdminCinema[];
  defaultCinemaId: string;
  onClose: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<{ cinemaId: string; name: string }>(() => ({
    cinemaId: room?.cinemaId ?? defaultCinemaId,
    name: room?.name ?? "",
  }));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formSignature = `${isOpen}-${room?.id ?? "new"}`;
  const [syncedFormSignature, setSyncedFormSignature] = useState(formSignature);
  if (formSignature !== syncedFormSignature) {
    setSyncedFormSignature(formSignature);
    setValues({ cinemaId: room?.cinemaId ?? defaultCinemaId, name: room?.name ?? "" });
    setFieldErrors({});
    setSubmitError(null);
  }

  const updateField = <TField extends keyof typeof values>(
    field: TField,
    value: (typeof values)[TField],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = () => {
    const parsed = createRoomSchema(translate).safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toAdminFieldErrors(parsed.error));
      return;
    }
    if (!token) {
      setSubmitError(translate("admin.common.session_expired"));
      return;
    }

    const form = parsed.data;

    startTransition(async () => {
      const result = room
        ? await updateRoomAction(token, room.id, {
            name: form.name,
            cinemaId: form.cinemaId,
          })
        : await createRoomAction(token, {
            cinemaId: form.cinemaId,
            name: form.name,
          });

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate(room ? "admin.common.saved" : "admin.common.created"), {
        variant: "success",
      });
      onClose();
      router.refresh();
    });
  };

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      titleKey={room ? "admin.rooms.edit_title" : "admin.rooms.new"}
      submitLabelKey={room ? "admin.common.save" : "admin.common.create"}
      error={submitError}
      isPending={isPending}
      size="md"
    >
      <AdminFormField labelKey="admin.rooms.cinema" error={fieldErrors.cinemaId}>
        <select
          value={values.cinemaId}
          onChange={(event) => updateField("cinemaId", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        >
          {cinemas.map((cinema) => (
            <option key={cinema.id} value={cinema.id}>
              {cinema.name}
            </option>
          ))}
        </select>
      </AdminFormField>

      <AdminFormField labelKey="admin.rooms.name" error={fieldErrors.name}>
        <input
          type="text"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          className={ADMIN_INPUT_CLASS}
          autoFocus
        />
      </AdminFormField>
    </AdminFormModal>
  );
}
