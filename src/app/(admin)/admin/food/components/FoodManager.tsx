"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Popcorn, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import { formatVND } from "@/libs/utils";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminDeleteDialog from "@/app/(admin)/admin/components/shared/AdminDeleteDialog";
import AdminFormModal from "@/app/(admin)/admin/components/shared/AdminFormModal";
import AdminPagination from "@/app/(admin)/admin/components/shared/AdminPagination";
import AdminTable, {
  type AdminTableColumn,
} from "@/app/(admin)/admin/components/shared/AdminTable";
import { useAdminTableState } from "@/features/admin/hooks/useAdminTableState";
import { deleteFoodItemAction, updateFoodItemAction } from "@/features/admin/actions/food.action";
import type { AdminFoodItem } from "@/features/admin/types";
import FoodFiltersCard, { type FoodFilterDraft } from "./FoodFiltersCard";
import FoodFormFields from "./FoodFormFields";
import FoodInlineEdit from "./FoodInlineEdit";
import { useFoodForm } from "./useFoodForm";

interface FoodFilters {
  isActive: string;
  category: string;
}

const EMPTY_FILTERS: FoodFilters = { isActive: "", category: "" };

const getFoodSearchText = (item: AdminFoodItem) =>
  `${item.name} ${item.nameVi ?? ""} ${item.category}`;

const matchesFoodFilters = (item: AdminFoodItem, filters: FoodFilters) =>
  (filters.isActive === "" || String(item.isActive) === filters.isActive) &&
  (filters.category === "" || item.category === filters.category);

export default function FoodManager({ items }: { items: AdminFoodItem[] }) {
  const { translate, locale } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminFoodItem | null>(null);

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category))].sort(),
    [items],
  );

  const { search, setSearch, filters, setFilters, page, setPage, visibleRows, totalPages } =
    useAdminTableState<AdminFoodItem, FoodFilters>({
      rows: items,
      getSearchText: getFoodSearchText,
      matches: matchesFoodFilters,
      initialFilters: EMPTY_FILTERS,
    });

  const isFiltered = search.trim() !== "" || filters.isActive !== "" || filters.category !== "";

  const applyFilters = (draft: FoodFilterDraft) => {
    setSearch(draft.search);
    setFilters({ isActive: draft.isActive, category: draft.category });
  };

  const clearFilters = () => {
    setSearch("");
    setFilters(EMPTY_FILTERS);
  };

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
      className: "w-16",
      align: "right",
      cell: (item) => (
        <AdminButton
          size="icon"
          variant="ghost"
          icon={Trash2}
          label={translate("admin.common.delete")}
          onClick={() => setDeleteTarget(item)}
        />
      ),
    },
  ];

  return (
    <>
      <FoodFiltersCard
        categories={categories}
        search={search}
        isActive={filters.isActive}
        category={filters.category}
        isFiltered={isFiltered}
        onApply={applyFilters}
        onClear={clearFilters}
        onCreate={() => setIsCreateOpen(true)}
      />

      <AdminTable
        columns={columns}
        rows={visibleRows}
        getRowId={(item) => item.id}
        emptyIcon={Popcorn}
        emptyTitleKey={isFiltered ? "admin.common.no_results" : "admin.food.empty_title"}
        emptyDescriptionKey={isFiltered ? "admin.common.no_results_body" : "admin.food.empty_body"}
        captionKey="admin.food.title"
        renderExpanded={(item, closePanel) => (
          <FoodInlineEdit key={item.id} item={item} onClose={closePanel} />
        )}
      />

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <FoodFormDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

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

function FoodFormDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { values, fieldErrors, submitError, isPending, updateField, fillSample, submit } =
    useFoodForm({ item: null, resetKey: `${isOpen}-new`, onSaved: onClose });

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submit}
      titleKey="admin.food.create_title"
      submitLabelKey="admin.common.create"
      error={submitError}
      isPending={isPending}
      size="lg"
      onFillSample={fillSample}
    >
      <FoodFormFields values={values} fieldErrors={fieldErrors} updateField={updateField} />
    </AdminFormModal>
  );
}
