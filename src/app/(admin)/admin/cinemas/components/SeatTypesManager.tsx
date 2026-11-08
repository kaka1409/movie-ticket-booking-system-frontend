"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminDeleteDialog from "@/app/(admin)/admin/components/shared/AdminDeleteDialog";
import AdminFormField from "@/app/(admin)/admin/components/shared/AdminFormField";
import AdminFormModal from "@/app/(admin)/admin/components/shared/AdminFormModal";
import { ADMIN_INPUT_CLASS, CANONICAL_SEAT_TYPE_NAMES } from "@/features/admin/constants";
import { seatTypeSchema, toAdminFieldErrors } from "@/features/admin/schema";
import {
  createSeatTypeAction,
  deleteSeatTypeAction,
  getAdminSeatTypesAction,
  updateSeatTypeAction,
} from "@/features/admin/actions/cinemas.action";
import { formatVND } from "@/libs/utils";
import type { AdminSeatType } from "@/features/admin/types";

/** Public seat-map colours so the console previews what customers see. */
function seatTypeColorClass(name: string): string {
  const key = name.toLowerCase();
  if (key === "vip") return "bg-amber-700";
  if (key === "sweetbox") return "bg-pink-500";
  return "bg-(--color-surface-2) border border-(--color-border)";
}

/**
 * Seat-type catalog manager: canonical names only (the public seat map derives
 * kind + SweetBox pairing from `name`), price edits, delete while unreferenced.
 */
export default function SeatTypesManager({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { translate, locale } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [seatTypes, setSeatTypes] = useState<AdminSeatType[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formTarget, setFormTarget] = useState<AdminSeatType | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminSeatType | null>(null);

  const formSignature = `${isOpen}`;
  const [syncedSignature, setSyncedSignature] = useState(formSignature);
  if (formSignature !== syncedSignature) {
    setSyncedSignature(formSignature);
    setSeatTypes(null);
    setLoadError(null);
    setFormTarget(null);
    setDeleteTarget(null);
  }

  const isLoading = isOpen && seatTypes === null && loadError === null;

  useEffect(() => {
    if (!isOpen || !token) return;

    let cancelled = false;

    getAdminSeatTypesAction(token).then((result) => {
      if (cancelled) return;
      if (!result.success) {
        setLoadError(result.error);
        return;
      }
      setSeatTypes(result.data);
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen, token]);

  const refresh = () => {
    if (!token) return;
    getAdminSeatTypesAction(token).then((result) => {
      if (result.success) setSeatTypes(result.data);
    });
  };

  const usedNames = new Set((seatTypes ?? []).map((type) => type.name));
  const creatableNames = CANONICAL_SEAT_TYPE_NAMES.filter((name) => !usedNames.has(name));

  return (
    <>
      <AdminFormModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onClose}
        titleKey="admin.seatTypes.title"
        descriptionKey="admin.seatTypes.description"
        submitLabelKey="admin.common.close"
        hideFooter
        size="lg"
      >
        {isLoading ? (
          <p className="text-[12px] text-(--color-text-muted)">
            {translate("admin.common.loading")}
          </p>
        ) : loadError ? (
          <p className="text-[12px] text-red-400">{loadError}</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] text-(--color-text-muted)">
                {translate("admin.seatTypes.canonical_hint")}
              </p>
              <AdminButton
                size="sm"
                variant="primary"
                icon={Plus}
                disabled={creatableNames.length === 0}
                onClick={() => setFormTarget("new")}
              >
                {translate("admin.seatTypes.new")}
              </AdminButton>
            </div>

            <ul className="divide-y divide-(--color-border) overflow-hidden rounded-xl border border-(--color-border)">
              {(seatTypes ?? []).map((type) => {
                const usage = type.seatCount + type.configCount;
                return (
                  <li
                    key={type.id}
                    className="flex items-center gap-3 bg-(--color-surface-2)/40 px-3 py-2.5"
                  >
                    <span
                      className={`h-6 w-6 shrink-0 rounded-sm ${seatTypeColorClass(type.name)}`}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-(--color-text-primary)">
                        {type.name}
                      </p>
                      <p className="text-[11px] text-(--color-text-muted)">
                        {usage === 0
                          ? translate("admin.seatTypes.unused")
                          : `${translate("admin.seatTypes.in_use")} — ${type.seatCount} ${translate("admin.seatTypes.seats")} · ${type.configCount} ${translate("admin.seatTypes.layouts")}`}
                      </p>
                    </div>
                    <span className="shrink-0 text-[13px] font-bold tabular-nums text-(--color-gold)">
                      {formatVND(type.basePrice, locale)}
                    </span>
                    <AdminButton
                      size="icon"
                      variant="ghost"
                      icon={Pencil}
                      label={translate("admin.common.edit")}
                      onClick={() => setFormTarget(type)}
                    />
                    <AdminButton
                      size="icon"
                      variant="ghost"
                      icon={Trash2}
                      label={translate("admin.common.delete")}
                      disabled={usage > 0}
                      title={usage > 0 ? translate("admin.seatTypes.delete_blocked") : undefined}
                      onClick={() => setDeleteTarget(type)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </AdminFormModal>

      <SeatTypeFormDialog
        isOpen={formTarget !== null}
        seatType={formTarget === "new" ? null : formTarget}
        availableNames={
          formTarget === "new"
            ? creatableNames
            : CANONICAL_SEAT_TYPE_NAMES.filter(
                (name) =>
                  name === formTarget?.name ||
                  !(seatTypes ?? []).some((type) => type.name === name),
              )
        }
        onClose={() => setFormTarget(null)}
        onSaved={() => {
          setFormTarget(null);
          notify(translate("admin.common.saved"), { variant: "success" });
          refresh();
          router.refresh();
        }}
      />

      <AdminDeleteDialog
        isOpen={deleteTarget !== null}
        entityName={deleteTarget?.name ?? ""}
        onClose={() => setDeleteTarget(null)}
        onDelete={() => deleteSeatTypeAction(token ?? "", deleteTarget?.id ?? "")}
        onDeleted={(message) => {
          setDeleteTarget(null);
          notify(message, { variant: "success" });
          refresh();
          router.refresh();
        }}
      />
    </>
  );
}

function SeatTypeFormDialog({
  isOpen,
  seatType,
  availableNames,
  onClose,
  onSaved,
}: {
  isOpen: boolean;
  seatType: AdminSeatType | null;
  availableNames: readonly string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const [values, setValues] = useState({ name: "", basePrice: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formSignature = `${isOpen}-${seatType?.id ?? "new"}`;
  const [syncedSignature, setSyncedSignature] = useState(formSignature);
  if (formSignature !== syncedSignature) {
    setSyncedSignature(formSignature);
    setValues({
      name: seatType?.name ?? availableNames[0] ?? "",
      basePrice: seatType ? String(seatType.basePrice) : "",
    });
    setFieldErrors({});
    setSubmitError(null);
  }

  const handleSubmit = () => {
    const parsed = seatTypeSchema(translate).safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toAdminFieldErrors(parsed.error));
      return;
    }
    if (!token) {
      setSubmitError(translate("admin.common.session_expired"));
      return;
    }

    const payload = { name: parsed.data.name, basePrice: Number(parsed.data.basePrice) };

    startTransition(async () => {
      const result = seatType
        ? await updateSeatTypeAction(token, seatType.id, payload)
        : await createSeatTypeAction(token, payload);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      onSaved();
    });
  };

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      titleKey={seatType ? "admin.seatTypes.edit_title" : "admin.seatTypes.new_title"}
      submitLabelKey={seatType ? "admin.common.save" : "admin.common.create"}
      error={submitError}
      isPending={isPending}
      size="md"
    >
      <AdminFormField labelKey="admin.seatTypes.name" error={fieldErrors.name} required>
        <select
          name="name"
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          className={ADMIN_INPUT_CLASS}
        >
          {availableNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </AdminFormField>

      <AdminFormField labelKey="admin.seatTypes.price" error={fieldErrors.basePrice} required>
        <input
          type="number"
          name="basePrice"
          min={0}
          step="any"
          value={values.basePrice}
          onChange={(event) =>
            setValues((current) => ({ ...current, basePrice: event.target.value }))
          }
          className={ADMIN_INPUT_CLASS}
          autoFocus
        />
      </AdminFormField>
    </AdminFormModal>
  );
}
