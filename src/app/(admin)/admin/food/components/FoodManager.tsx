"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Popcorn, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import { formatVND } from "@/libs/utils";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminDeleteDialog from "@/app/(admin)/admin/components/shared/AdminDeleteDialog";
import AdminFormField, {
  AdminCheckbox,
} from "@/app/(admin)/admin/components/shared/AdminFormField";
import AdminFormModal from "@/app/(admin)/admin/components/shared/AdminFormModal";
import AdminPagination from "@/app/(admin)/admin/components/shared/AdminPagination";
import AdminSearchInput from "@/app/(admin)/admin/components/shared/AdminSearchInput";
import AdminTable, {
  type AdminTableColumn,
} from "@/app/(admin)/admin/components/shared/AdminTable";
import { ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import { useAdminTableState } from "@/features/admin/hooks/useAdminTableState";
import { createFoodItemSchema, toAdminFieldErrors } from "@/features/admin/schema";
import {
  createFoodItemAction,
  deleteFoodItemAction,
  updateFoodItemAction,
} from "@/features/admin/actions/food.action";
import type { AdminFoodItem } from "@/features/admin/types";

interface FoodFormState {
  name: string;
  nameVi: string;
  category: string;
  price: string;
  image: string;
  isActive: boolean;
}

const EMPTY_FORM: FoodFormState = {
  name: "",
  nameVi: "",
  category: "",
  price: "",
  image: "",
  isActive: true,
};

function toFormState(item: AdminFoodItem | null): FoodFormState {
  if (!item) return EMPTY_FORM;

  return {
    name: item.name,
    nameVi: item.nameVi ?? "",
    category: item.category,
    price: String(item.price),
    image: item.image ?? "",
    isActive: item.isActive,
  };
}

const getFoodSearchText = (item: AdminFoodItem) =>
  `${item.name} ${item.nameVi ?? ""} ${item.category}`;

export default function FoodManager({ items }: { items: AdminFoodItem[] }) {
  const { translate, locale } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [formTarget, setFormTarget] = useState<AdminFoodItem | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminFoodItem | null>(null);

  const { search, setSearch, page, setPage, visibleRows, totalRows, totalPages } =
    useAdminTableState({ rows: items, getSearchText: getFoodSearchText });

  const columns: AdminTableColumn<AdminFoodItem>[] = [
    {
      id: "item",
      headerKey: "admin.food.column_item",
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          {item.image ? (
            /* Admin-supplied URL: next/image's host allowlist does not apply. */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.image}
              alt=""
              loading="lazy"
              className="h-9 w-9 shrink-0 rounded-lg border border-(--color-border) object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-surface-2) text-(--color-text-muted)">
              <Popcorn size={14} aria-hidden />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-(--color-text-primary)">{item.name}</p>
            {item.nameVi && (
              <p className="truncate text-[11px] text-(--color-text-muted)">{item.nameVi}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "category",
      headerKey: "admin.food.column_category",
      className: "w-28",
      cell: (item) => <span className="text-[12px]">{item.category}</span>,
    },
    {
      id: "price",
      headerKey: "admin.food.column_price",
      className: "w-28",
      align: "right",
      cell: (item) => <span className="tabular-nums">{formatVND(item.price, locale)}</span>,
    },
    {
      id: "usage",
      headerKey: "admin.food.column_usage",
      className: "w-24",
      align: "right",
      cell: (item) => <span className="tabular-nums">{item.bookingCount}</span>,
    },
    {
      id: "status",
      headerKey: "admin.food.column_status",
      className: "w-28",
      cell: (item) => (
        <Badge variant={item.isActive ? "success" : "neutral"} size="xs">
          {translate(item.isActive ? "admin.common.active" : "admin.common.inactive")}
        </Badge>
      ),
    },
    {
      id: "actions",
      className: "w-24",
      align: "right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <AdminButton
            size="icon"
            variant="ghost"
            icon={Pencil}
            label={translate("admin.common.edit")}
            onClick={() => setFormTarget(item)}
          />
          <AdminButton
            size="icon"
            variant="ghost"
            icon={Trash2}
            label={translate("admin.common.delete")}
            onClick={() => setDeleteTarget(item)}
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
          placeholderKey="admin.food.search"
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
          {translate("admin.food.new")}
        </AdminButton>
      </div>

      <AdminTable
        columns={columns}
        rows={visibleRows}
        getRowId={(item) => item.id}
        emptyIcon={Popcorn}
        emptyTitleKey={isFiltered ? "admin.common.no_results" : "admin.food.empty_title"}
        emptyDescriptionKey={isFiltered ? "admin.common.no_results_body" : "admin.food.empty_body"}
        captionKey="admin.food.title"
      />

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <FoodFormDialog
        isOpen={formTarget !== null}
        item={formTarget === "new" ? null : formTarget}
        onClose={() => setFormTarget(null)}
      />

      <AdminDeleteDialog
        isOpen={deleteTarget !== null}
        entityName={deleteTarget?.name ?? ""}
        onClose={() => setDeleteTarget(null)}
        onDelete={() => deleteFoodItemAction(token ?? "", deleteTarget?.id ?? "")}
        onDeactivate={() =>
          updateFoodItemAction(token ?? "", deleteTarget?.id ?? "", { isActive: false })
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

function FoodFormDialog({
  isOpen,
  item,
  onClose,
}: {
  isOpen: boolean;
  item: AdminFoodItem | null;
  onClose: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<FoodFormState>(() => toFormState(item));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formSignature = `${isOpen}-${item?.id ?? "new"}`;
  const [syncedFormSignature, setSyncedFormSignature] = useState(formSignature);
  if (formSignature !== syncedFormSignature) {
    setSyncedFormSignature(formSignature);
    setValues(toFormState(item));
    setFieldErrors({});
    setSubmitError(null);
  }

  const updateField = <TField extends keyof FoodFormState>(
    field: TField,
    value: FoodFormState[TField],
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
    const parsed = createFoodItemSchema(translate).safeParse(values);
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
      category: form.category,
      price: Number(form.price),
      isActive: form.isActive,
      ...(form.nameVi === "" ? {} : { nameVi: form.nameVi }),
      ...(form.image === "" ? {} : { image: form.image }),
    };

    startTransition(async () => {
      const result = item
        ? await updateFoodItemAction(token, item.id, {
            ...base,
            // `image` is the only nullable column here; "" would be rejected.
            ...(form.image === "" ? { image: null } : {}),
          })
        : await createFoodItemAction(token, base);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate(item ? "admin.common.saved" : "admin.common.created"), {
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
      titleKey={item ? "admin.food.edit_title" : "admin.food.create_title"}
      submitLabelKey={item ? "admin.common.save" : "admin.common.create"}
      error={submitError}
      isPending={isPending}
      size="lg"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminFormField labelKey="admin.food.name" error={fieldErrors.name}>
          <input
            type="text"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={ADMIN_INPUT_CLASS}
            autoFocus
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.food.name_vi" error={fieldErrors.nameVi}>
          <input
            type="text"
            value={values.nameVi}
            onChange={(event) => updateField("nameVi", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField
          labelKey="admin.food.category"
          hintKey="admin.food.category_hint"
          error={fieldErrors.category}
        >
          <input
            type="text"
            value={values.category}
            onChange={(event) => updateField("category", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.food.price" error={fieldErrors.price}>
          <input
            type="number"
            min={0}
            step={1000}
            value={values.price}
            onChange={(event) => updateField("price", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>
      </div>

      <AdminFormField labelKey="admin.food.image" error={fieldErrors.image}>
        <input
          type="url"
          value={values.image}
          onChange={(event) => updateField("image", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>

      <AdminCheckbox
        labelKey="admin.food.is_active"
        hintKey="admin.food.is_active_hint"
        checked={values.isActive}
        onChange={(checked) => updateField("isActive", checked)}
      />
    </AdminFormModal>
  );
}
