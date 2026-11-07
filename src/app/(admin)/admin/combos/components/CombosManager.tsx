"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Trash2 } from "lucide-react";
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
import { deleteComboAction, updateComboAction } from "@/features/admin/actions/food.action";
import type { AdminCombo } from "@/features/admin/types";
import ComboFormFields from "./ComboFormFields";
import ComboInlineEdit from "./ComboInlineEdit";
import CombosFiltersCard, { type ComboFilterDraft } from "./CombosFiltersCard";
import { useComboForm } from "./useComboForm";

interface ComboFilters {
  isActive: string;
  tag: string;
}

const EMPTY_FILTERS: ComboFilters = { isActive: "", tag: "" };

const getComboSearchText = (combo: AdminCombo) =>
  `${combo.name} ${combo.nameVi ?? ""} ${combo.tag ?? ""}`;

const matchesComboFilters = (combo: AdminCombo, filters: ComboFilters) =>
  (filters.isActive === "" || String(combo.isActive) === filters.isActive) &&
  (filters.tag === "" || (combo.tag ?? "") === filters.tag);

export default function CombosManager({ combos }: { combos: AdminCombo[] }) {
  const { translate, locale } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminCombo | null>(null);

  const tags = useMemo(
    () =>
      [...new Set(combos.map((combo) => combo.tag).filter((tag): tag is string => !!tag))].sort(),
    [combos],
  );

  const { search, setSearch, filters, setFilters, page, setPage, visibleRows, totalPages } =
    useAdminTableState<AdminCombo, ComboFilters>({
      rows: combos,
      getSearchText: getComboSearchText,
      matches: matchesComboFilters,
      initialFilters: EMPTY_FILTERS,
    });

  const isFiltered = search.trim() !== "" || filters.isActive !== "" || filters.tag !== "";

  const applyFilters = (draft: ComboFilterDraft) => {
    setSearch(draft.search);
    setFilters({ isActive: draft.isActive, tag: draft.tag });
  };

  const clearFilters = () => {
    setSearch("");
    setFilters(EMPTY_FILTERS);
  };

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
      className: "w-16",
      align: "right",
      cell: (combo) => (
        <AdminButton
          size="icon"
          variant="ghost"
          icon={Trash2}
          label={translate("admin.common.delete")}
          onClick={() => setDeleteTarget(combo)}
        />
      ),
    },
  ];

  return (
    <>
      <CombosFiltersCard
        tags={tags}
        search={search}
        isActive={filters.isActive}
        tag={filters.tag}
        isFiltered={isFiltered}
        onApply={applyFilters}
        onClear={clearFilters}
        onCreate={() => setIsCreateOpen(true)}
      />

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
        renderExpanded={(combo, closePanel) => (
          <ComboInlineEdit key={combo.id} combo={combo} onClose={closePanel} />
        )}
      />

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ComboFormDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

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

function ComboFormDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { values, fieldErrors, submitError, isPending, updateField, fillSample, submit } =
    useComboForm({ combo: null, resetKey: `${isOpen}-new`, onSaved: onClose });

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submit}
      titleKey="admin.combos.create_title"
      submitLabelKey="admin.common.create"
      error={submitError}
      isPending={isPending}
      size="lg"
      onFillSample={fillSample}
    >
      <ComboFormFields values={values} fieldErrors={fieldErrors} updateField={updateField} />
    </AdminFormModal>
  );
}
