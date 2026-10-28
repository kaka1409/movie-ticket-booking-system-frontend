"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Pencil, Plus, Settings2, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import AdminButton from "@/features/admin/components/AdminButton";
import AdminDeleteDialog from "@/features/admin/components/AdminDeleteDialog";
import AdminFormField from "@/features/admin/components/AdminFormField";
import AdminFormModal from "@/features/admin/components/AdminFormModal";
import AdminTable, { type AdminTableColumn } from "@/features/admin/components/AdminTable";
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
import SeatLayoutEditor from "./SeatLayoutEditor";

export default function CinemasManager({ cinemas }: { cinemas: AdminCinema[] }) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(cinemas[0]?.id ?? null);
  const [cinemaFormTarget, setCinemaFormTarget] = useState<AdminCinema | "new" | null>(null);
  const [roomFormTarget, setRoomFormTarget] = useState<AdminRoom | "new" | null>(null);
  const [deleteCinemaTarget, setDeleteCinemaTarget] = useState<AdminCinema | null>(null);
  const [deleteRoomTarget, setDeleteRoomTarget] = useState<AdminCinemaRoom | null>(null);
  const [layoutRoom, setLayoutRoom] = useState<AdminCinemaRoom | null>(null);

  const selectedCinema = cinemas.find((cinema) => cinema.id === selectedCinemaId) ?? null;

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
      id: "badge",
      headerKey: "admin.cinemas.column_badge",
      className: "w-24",
      cell: (cinema) =>
        cinema.badge ? (
          <Badge variant="gold" size="xs">
            {cinema.badge}
          </Badge>
        ) : (
          <span className="text-[11px] text-(--color-text-muted)">
            {translate("admin.common.none")}
          </span>
        ),
    },
    {
      id: "rooms",
      headerKey: "admin.cinemas.column_rooms",
      className: "w-20",
      align: "right",
      cell: (cinema) => <span className="tabular-nums">{cinema.rooms.length}</span>,
    },
    {
      id: "actions",
      className: "w-32",
      align: "right",
      cell: (cinema) => (
        <div className="flex items-center justify-end gap-1">
          <AdminButton
            size="icon"
            variant="ghost"
            icon={Settings2}
            label={translate("admin.cinemas.manage_rooms")}
            onClick={() => setSelectedCinemaId(cinema.id)}
          />
          <AdminButton
            size="icon"
            variant="ghost"
            icon={Pencil}
            label={translate("admin.common.edit")}
            onClick={() => setCinemaFormTarget(cinema)}
          />
          <AdminButton
            size="icon"
            variant="ghost"
            icon={Trash2}
            label={translate("admin.common.delete")}
            onClick={() => setDeleteCinemaTarget(cinema)}
          />
        </div>
      ),
    },
  ];

  const roomColumns: AdminTableColumn<AdminCinemaRoom>[] = [
    {
      id: "room",
      headerKey: "admin.rooms.column_room",
      cell: (room) => <p className="font-semibold text-(--color-text-primary)">{room.name}</p>,
    },
    {
      id: "showtimes",
      headerKey: "admin.rooms.column_showtimes",
      className: "w-28",
      align: "right",
      cell: (room) => <span className="tabular-nums">{room.showtimes}</span>,
    },
    {
      id: "seats",
      headerKey: "admin.rooms.column_seats",
      className: "w-24",
      align: "right",
      cell: (room) => <span className="tabular-nums">{room.seats}</span>,
    },
    {
      id: "actions",
      className: "w-40",
      align: "right",
      cell: (room) => (
        <div className="flex items-center justify-end gap-1">
          <AdminButton
            size="sm"
            variant="ghost"
            icon={Settings2}
            label={translate("admin.seatLayout.open")}
            onClick={() => setLayoutRoom(room)}
          >
            {translate("admin.seatLayout.open")}
          </AdminButton>
          <AdminButton
            size="icon"
            variant="ghost"
            icon={Pencil}
            label={translate("admin.common.edit")}
            onClick={() =>
              setRoomFormTarget({
                ...room,
                cinemaId: selectedCinema?.id ?? "",
                cinemaName: selectedCinema?.name ?? "",
              })
            }
          />
          <AdminButton
            size="icon"
            variant="ghost"
            icon={Trash2}
            label={translate("admin.common.delete")}
            onClick={() => setDeleteRoomTarget(room)}
          />
        </div>
      ),
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

      <AdminTable
        columns={cinemaColumns}
        rows={cinemas}
        getRowId={(cinema) => cinema.id}
        emptyIcon={Building2}
        emptyTitleKey="admin.cinemas.empty_title"
        emptyDescriptionKey="admin.cinemas.empty_body"
        captionKey="admin.cinemas.title"
      />

      {selectedCinema && (
        <section className="mt-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-extrabold tracking-tight text-(--color-text-primary)">
              {selectedCinema.name} — {translate("admin.rooms.title")}
            </h2>

            <AdminButton
              icon={Plus}
              variant="primary"
              size="sm"
              className="ml-auto"
              onClick={() => setRoomFormTarget("new")}
            >
              {translate("admin.rooms.new")}
            </AdminButton>
          </div>

          <AdminTable
            columns={roomColumns}
            rows={selectedCinema.rooms}
            getRowId={(room) => room.id}
            emptyIcon={Building2}
            emptyTitleKey="admin.rooms.empty_title"
            emptyDescriptionKey="admin.rooms.empty_body"
            captionKey="admin.rooms.title"
          />
        </section>
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
  }>(() =>
    cinema
      ? { name: cinema.name, address: cinema.address, badge: cinema.badge ?? "" }
      : { name: "", address: "", badge: "" },
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
        ? { name: cinema.name, address: cinema.address, badge: cinema.badge ?? "" }
        : { name: "", address: "", badge: "" },
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
