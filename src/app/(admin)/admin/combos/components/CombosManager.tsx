"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Package, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import { formatVND } from "@/libs/utils";
import AdminButton from "@/features/admin/components/AdminButton";
import AdminDeleteDialog from "@/features/admin/components/AdminDeleteDialog";
import AdminFormField, { AdminCheckbox } from "@/features/admin/components/AdminFormField";
import AdminFormModal from "@/features/admin/components/AdminFormModal";
import AdminPagination from "@/features/admin/components/AdminPagination";
import AdminSearchInput from "@/features/admin/components/AdminSearchInput";
import AdminTable, { type AdminTableColumn } from "@/features/admin/components/AdminTable";
import { ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import { useAdminTableState } from "@/features/admin/hooks/useAdminTableState";
import { createComboSchema, toAdminFieldErrors } from "@/features/admin/schema";
import {
  createComboAction,
  deleteComboAction,
  updateComboAction,
} from "@/features/admin/actions/food.action";
import type { AdminCombo } from "@/features/admin/types";

interface ComboFormState {
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  price: string;
  image: string;
  tag: string;
  isActive: boolean;
}

const EMPTY_FORM: ComboFormState = {
  name: "",
  nameVi: "",
  description: "",
  descriptionVi: "",
  price: "",
  image: "",
  tag: "",
  isActive: true,
};

function toFormState(combo: AdminCombo | null): ComboFormState {
  if (!combo) return EMPTY_FORM;

  return {
    name: combo.name,
    nameVi: combo.nameVi ?? "",
    description: combo.description ?? "",
    descriptionVi: combo.descriptionVi ?? "",
    price: String(combo.price),
    image: combo.image ?? "",
    tag: combo.tag ?? "",
    isActive: combo.isActive,
  };
}

const getComboSearchText = (combo: AdminCombo) =>
  `${combo.name} ${combo.nameVi ?? ""} ${combo.tag ?? ""}`;

export default function CombosManager({ combos }: { combos: AdminCombo[] }) {
  const { translate, locale } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [formTarget, setFormTarget] = useState<AdminCombo | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCombo | null>(null);

  const { search, setSearch, page, setPage, visibleRows, totalRows, totalPages } =
    useAdminTableState({ rows: combos, getSearchText: getComboSearchText });

  const columns: AdminTableColumn<AdminCombo>[] = [
    {
      id: "combo",
      headerKey: "admin.combos.column_combo",
      cell: (combo) => (
        <div className="flex items-center gap-2.5">
          {combo.image ? (
            /* Admin-supplied URL: next/image's host allowlist does not apply. */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={combo.image}
              alt=""
              loading="lazy"
              className="h-9 w-9 shrink-0 rounded-lg border border-(--color-border) object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-surface-2) text-(--color-text-muted)">
              <Package size={14} aria-hidden />
            </span>
          )}
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate font-semibold text-(--color-text-primary)">
              {combo.name}
              {combo.tag && (
                <Badge variant="gold" size="xs">
                  {combo.tag}
                </Badge>
              )}
            </p>
            {combo.nameVi && (
              <p className="truncate text-[11px] text-(--color-text-muted)">{combo.nameVi}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "price",
      headerKey: "admin.combos.column_price",
      className: "w-28",
      align: "right",
      cell: (combo) => <span className="tabular-nums">{formatVND(combo.price, locale)}</span>,
    },
    {
      id: "usage",
      headerKey: "admin.combos.column_usage",
      className: "w-24",
      align: "right",
      cell: (combo) => <span className="tabular-nums">{combo.bookingCount}</span>,
    },
    {
      id: "status",
      headerKey: "admin.combos.column_status",
      className: "w-28",
      cell: (combo) => (
        <Badge variant={combo.isActive ? "success" : "neutral"} size="xs">
          {translate(combo.isActive ? "admin.common.active" : "admin.common.inactive")}
        </Badge>
      ),
    },
    {
      id: "actions",
      className: "w-24",
      align: "right",
      cell: (combo) => (
        <div className="flex items-center justify-end gap-1">
          <AdminButton
            size="icon"
            variant="ghost"
            icon={Pencil}
            label={translate("admin.common.edit")}
            onClick={() => setFormTarget(combo)}
          />
          <AdminButton
            size="icon"
            variant="ghost"
            icon={Trash2}
            label={translate("admin.common.delete")}
            onClick={() => setDeleteTarget(combo)}
          />
        </div>
      ),
    },
  ];

  const isFiltered = search.trim() !== "";

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          className="w-full sm:max-w-xs"
          placeholderKey="admin.combos.search"
        />

        <p className="text-[11px] font-semibold text-(--color-text-muted)">
          {translate("admin.common.total")}: {totalRows}
        </p>

        <AdminButton
          icon={Plus}
          variant="primary"
          size="md"
          className="ml-auto"
          onClick={() => setFormTarget("new")}
        >
          {translate("admin.combos.new")}
        </AdminButton>
      </div>

      <AdminTable
        columns={columns}
        rows={visibleRows}
        getRowId={(combo) => combo.id}
        emptyIcon={Package}
        emptyTitleKey={isFiltered ? "admin.common.no_results" : "admin.combos.empty_title"}
        emptyDescriptionKey={
          isFiltered ? "admin.common.no_results_body" : "admin.combos.empty_body"
        }
        captionKey="admin.combos.title"
      />

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ComboFormDialog
        isOpen={formTarget !== null}
        combo={formTarget === "new" ? null : formTarget}
        onClose={() => setFormTarget(null)}
      />

      <AdminDeleteDialog
        isOpen={deleteTarget !== null}
        entityName={deleteTarget?.name ?? ""}
        onClose={() => setDeleteTarget(null)}
        onDelete={() => deleteComboAction(token ?? "", deleteTarget?.id ?? "")}
        onDeactivate={() =>
          updateComboAction(token ?? "", deleteTarget?.id ?? "", { isActive: false })
        }
        onDeleted={(message) => {
          setDeleteTarget(null);
          notify(message, { variant: "success" });
          router.refresh();
        }}
      />
    </>
  );
}

function ComboFormDialog({
  isOpen,
  combo,
  onClose,
}: {
  isOpen: boolean;
  combo: AdminCombo | null;
  onClose: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<ComboFormState>(() => toFormState(combo));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formSignature = `${isOpen}-${combo?.id ?? "new"}`;
  const [syncedFormSignature, setSyncedFormSignature] = useState(formSignature);
  if (formSignature !== syncedFormSignature) {
    setSyncedFormSignature(formSignature);
    setValues(toFormState(combo));
    setFieldErrors({});
    setSubmitError(null);
  }

  const updateField = <TField extends keyof ComboFormState>(
    field: TField,
    value: ComboFormState[TField],
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
    const parsed = createComboSchema(translate).safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toAdminFieldErrors(parsed.error));
      return;
    }
    if (!token) {
      setSubmitError(translate("admin.common.session_expired"));
      return;
    }

    const form = parsed.data;
    const base = {
      name: form.name,
      price: Number(form.price),
      isActive: form.isActive,
      ...(form.nameVi === "" ? {} : { nameVi: form.nameVi }),
      ...(form.description === "" ? {} : { description: form.description }),
      ...(form.descriptionVi === "" ? {} : { descriptionVi: form.descriptionVi }),
      ...(form.image === "" ? {} : { image: form.image }),
      ...(form.tag === "" ? {} : { tag: form.tag }),
    };

    startTransition(async () => {
      const result = combo
        ? await updateComboAction(token, combo.id, {
            ...base,
            // Every optional column here is nullable: `null` clears it.
            nameVi: form.nameVi === "" ? null : form.nameVi,
            description: form.description === "" ? null : form.description,
            descriptionVi: form.descriptionVi === "" ? null : form.descriptionVi,
            image: form.image === "" ? null : form.image,
            tag: form.tag === "" ? null : form.tag,
          })
        : await createComboAction(token, base);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate(combo ? "admin.common.saved" : "admin.common.created"), {
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
      titleKey={combo ? "admin.combos.edit_title" : "admin.combos.create_title"}
      submitLabelKey={combo ? "admin.common.save" : "admin.common.create"}
      error={submitError}
      isPending={isPending}
      size="lg"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminFormField labelKey="admin.combos.name" error={fieldErrors.name}>
          <input
            type="text"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={ADMIN_INPUT_CLASS}
            autoFocus
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.combos.name_vi" error={fieldErrors.nameVi}>
          <input
            type="text"
            value={values.nameVi}
            onChange={(event) => updateField("nameVi", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.combos.price" error={fieldErrors.price}>
          <input
            type="number"
            min={0}
            step={1000}
            value={values.price}
            onChange={(event) => updateField("price", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField
          labelKey="admin.combos.tag"
          hintKey="admin.combos.tag_hint"
          error={fieldErrors.tag}
        >
          <input
            type="text"
            value={values.tag}
            onChange={(event) => updateField("tag", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>
      </div>

      <AdminFormField labelKey="admin.combos.description" error={fieldErrors.description}>
        <textarea
          rows={2}
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          className={`${ADMIN_INPUT_CLASS} resize-y`}
        />
      </AdminFormField>

      <AdminFormField labelKey="admin.combos.description_vi" error={fieldErrors.descriptionVi}>
        <textarea
          rows={2}
          value={values.descriptionVi}
          onChange={(event) => updateField("descriptionVi", event.target.value)}
          className={`${ADMIN_INPUT_CLASS} resize-y`}
        />
      </AdminFormField>

      <AdminFormField labelKey="admin.combos.image" error={fieldErrors.image}>
        <input
          type="url"
          value={values.image}
          onChange={(event) => updateField("image", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>

      <AdminCheckbox
        labelKey="admin.combos.is_active"
        hintKey="admin.combos.is_active_hint"
        checked={values.isActive}
        onChange={(checked) => updateField("isActive", checked)}
      />
    </AdminFormModal>
  );
}
