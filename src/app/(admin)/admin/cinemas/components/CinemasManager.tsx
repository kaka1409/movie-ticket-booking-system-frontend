"use client";

import { useMemo, useState, useTransition } from "react";
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
  type AdminSortDirection,
  type AdminTableColumn,
} from "@/app/(admin)/admin/components/shared/AdminTable";
import { ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import { ADMIN_FORM_SAMPLES } from "@/features/admin/samples";
import { createCinemaSchema, createRoomSchema, toAdminFieldErrors } from "@/features/admin/schema";
import {
  createCinemaAction,
  createRoomAction,
  deleteCinemaAction,
  deleteRoomAction,
  updateRoomAction,
} from "@/features/admin/actions/cinemas.action";
import type { AdminCinema, AdminCinemaRoom, AdminRoom } from "@/features/admin/types";
import CinemaDetailPanel from "./CinemaDetailPanel";
import CinemaMap from "./CinemaMap";
import SeatLayoutEditor from "./SeatLayoutEditor";
import SeatTypesManager from "./SeatTypesManager";

export default function CinemasManager({ cinemas }: { cinemas: AdminCinema[] }) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(cinemas[0]?.id ?? null);
  const [isCinemaFormOpen, setIsCinemaFormOpen] = useState(false);
  const [roomFormTarget, setRoomFormTarget] = useState<AdminRoom | "new" | null>(null);
  const [deleteCinemaTarget, setDeleteCinemaTarget] = useState<AdminCinema | null>(null);
  const [deleteRoomTarget, setDeleteRoomTarget] = useState<AdminCinemaRoom | null>(null);
  const [layoutRoom, setLayoutRoom] = useState<AdminCinemaRoom | null>(null);
  const [isSeatTypesOpen, setIsSeatTypesOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: string; direction: AdminSortDirection } | null>(null);

  const sortedCinemas = useMemo(() => {
    if (!sort) return cinemas;
    const direction = sort.direction === "asc" ? 1 : -1;
    return [...cinemas].sort((left, right) => {
      const compared =
        sort.key === "rooms"
          ? left.rooms.length - right.rooms.length
          : left.name.localeCompare(right.name);
      return compared * direction;
    });
  }, [cinemas, sort]);

  const toggleSort = (key: string) =>
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );

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
      sortKey: "cinema",
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
      sortKey: "rooms",
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
          onClick={() => setIsCinemaFormOpen(true)}
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
            rows={sortedCinemas}
            sort={sort}
            onSort={toggleSort}
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
          onOpenSeatTypes={() => setIsSeatTypesOpen(true)}
        />
      )}

      <CinemaFormDialog isOpen={isCinemaFormOpen} onClose={() => setIsCinemaFormOpen(false)} />

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

      <SeatTypesManager isOpen={isSeatTypesOpen} onClose={() => setIsSeatTypesOpen(false)} />
    </>
  );
}

function CinemaFormDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState({
    name: "",
    address: "",
    badge: "",
    latitude: "",
    longitude: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [syncedOpen, setSyncedOpen] = useState(isOpen);
  if (isOpen !== syncedOpen) {
    setSyncedOpen(isOpen);
    if (isOpen) {
      setValues({ name: "", address: "", badge: "", latitude: "", longitude: "" });
      setFieldErrors({});
      setSubmitError(null);
    }
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

  /** Prefill a valid test cinema — the operator still reviews and submits. */
  const fillSample = () => {
    setValues({ ...ADMIN_FORM_SAMPLES.cinema });
    setFieldErrors({});
    setSubmitError(null);
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
      const result = await createCinemaAction(token, payload);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate("admin.common.created"), { variant: "success" });
      onClose();
      router.refresh();
    });
  };

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      titleKey="admin.cinemas.create_title"
      submitLabelKey="admin.common.create"
      error={submitError}
      isPending={isPending}
      size="md"
      onFillSample={fillSample}
    >
      <AdminFormField labelKey="admin.cinemas.name" error={fieldErrors.name} required>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          className={ADMIN_INPUT_CLASS}
          autoFocus
        />
      </AdminFormField>

      <AdminFormField labelKey="admin.cinemas.address" error={fieldErrors.address} required>
        <input
          type="text"
          name="address"
          value={values.address}
          onChange={(event) => updateField("address", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>

      <AdminFormField labelKey="admin.cinemas.badge" error={fieldErrors.badge}>
        <input
          type="text"
          name="badge"
          value={values.badge}
          onChange={(event) => updateField("badge", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>

      <div className="grid grid-cols-2 gap-3">
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

  const [values, setValues] = useState<{ cinemaId: string; name: string; nameVi: string }>(() => ({
    cinemaId: room?.cinemaId ?? defaultCinemaId,
    name: room?.name ?? "",
    nameVi: room?.nameVi ?? "",
  }));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formSignature = `${isOpen}-${room?.id ?? "new"}`;
  const [syncedFormSignature, setSyncedFormSignature] = useState(formSignature);
  if (formSignature !== syncedFormSignature) {
    setSyncedFormSignature(formSignature);
    setValues({
      cinemaId: room?.cinemaId ?? defaultCinemaId,
      name: room?.name ?? "",
      nameVi: room?.nameVi ?? "",
    });
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

  /** Prefill a valid test room — the operator still reviews and submits. */
  const fillSample = () => {
    setValues({
      cinemaId: values.cinemaId,
      name: ADMIN_FORM_SAMPLES.room.name,
      nameVi: ADMIN_FORM_SAMPLES.room.nameVi,
    });
    setFieldErrors({});
    setSubmitError(null);
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

    const nameVi = form.nameVi === "" ? null : form.nameVi;

    startTransition(async () => {
      const result = room
        ? await updateRoomAction(token, room.id, {
            name: form.name,
            nameVi,
            cinemaId: form.cinemaId,
          })
        : await createRoomAction(token, {
            cinemaId: form.cinemaId,
            name: form.name,
            nameVi,
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
      onFillSample={room === null ? fillSample : undefined}
    >
      <AdminFormField labelKey="admin.rooms.cinema" error={fieldErrors.cinemaId} required>
        <select
          name="cinemaId"
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

      <AdminFormField labelKey="admin.rooms.name" error={fieldErrors.name} required>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          className={ADMIN_INPUT_CLASS}
          autoFocus
        />
      </AdminFormField>

      <AdminFormField labelKey="admin.rooms.name_vi" error={fieldErrors.nameVi}>
        <input
          type="text"
          name="nameVi"
          value={values.nameVi}
          onChange={(event) => updateField("nameVi", event.target.value)}
          className={ADMIN_INPUT_CLASS}
          placeholder={translate("admin.rooms.name_vi_hint")}
        />
      </AdminFormField>
    </AdminFormModal>
  );
}
