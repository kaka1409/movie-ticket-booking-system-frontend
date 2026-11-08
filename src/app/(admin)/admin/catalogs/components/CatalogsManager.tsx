"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tags, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminDeleteDialog from "@/app/(admin)/admin/components/shared/AdminDeleteDialog";
import AdminFormModal from "@/app/(admin)/admin/components/shared/AdminFormModal";
import AdminPagination from "@/app/(admin)/admin/components/shared/AdminPagination";
import AdminTable, {
  type AdminTableColumn,
} from "@/app/(admin)/admin/components/shared/AdminTable";
import { useAdminTableState } from "@/features/admin/hooks/useAdminTableState";
import {
  deleteCatalogEntryAction,
  updateCatalogEntryAction,
} from "@/features/admin/actions/catalogs.action";
import type { AdminCatalogEntry, AdminCatalogKind } from "@/features/admin/types";
import CatalogFormFields from "./CatalogFormFields";
import CatalogInlineEdit from "./CatalogInlineEdit";
import CatalogsFiltersCard, { type CatalogFilterDraft } from "./CatalogsFiltersCard";
import { useCatalogForm } from "./useCatalogForm";

const KIND_META: Record<
  AdminCatalogKind,
  { tabKey: string; nounKey: string; newKey: string; usageKey: string; searchKey: string }
> = {
  genres: {
    tabKey: "admin.catalogs.tab_genres",
    nounKey: "admin.catalogs.noun_genre",
    newKey: "admin.catalogs.new_genre",
    usageKey: "admin.catalogs.usage_movies",
    searchKey: "admin.catalogs.search",
  },
  formats: {
    tabKey: "admin.catalogs.tab_formats",
    nounKey: "admin.catalogs.noun_format",
    newKey: "admin.catalogs.new_format",
    usageKey: "admin.catalogs.usage_showtimes",
    searchKey: "admin.catalogs.search",
  },
  "age-ratings": {
    tabKey: "admin.catalogs.tab_age_ratings",
    nounKey: "admin.catalogs.noun_age_rating",
    newKey: "admin.catalogs.new_age_rating",
    usageKey: "admin.catalogs.usage_movies",
    searchKey: "admin.catalogs.search",
  },
};

interface CatalogFilters {
  isActive: string;
}

const EMPTY_FILTERS: CatalogFilters = { isActive: "" };

const getCatalogSearchText = (entry: AdminCatalogEntry) =>
  `${entry.name} ${entry.nameVi ?? ""} ${entry.sortOrder}`;

const matchesCatalogFilters = (entry: AdminCatalogEntry, filters: CatalogFilters) =>
  filters.isActive === "" || String(entry.isActive) === filters.isActive;

const getCatalogSortValue = (entry: AdminCatalogEntry, key: string) => {
  switch (key) {
    case "name":
      return entry.nameVi ?? entry.name;
    case "usage":
      return entry.usageCount;
    case "sortOrder":
      return entry.sortOrder;
    case "isActive":
      return entry.isActive;
    default:
      return null;
  }
};

/**
 * Genres, formats and age ratings carry the same payload on the backend, so one
 * screen edits all three behind a tab strip — the tab only changes the endpoint
 * segment and the copy. Rows expand into an inline editor like the movie table.
 */
export default function CatalogsManager({
  entriesByKind,
}: {
  entriesByKind: Record<AdminCatalogKind, AdminCatalogEntry[]>;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [kind, setKind] = useState<AdminCatalogKind>("genres");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminCatalogEntry | null>(null);

  const {
    search,
    setSearch,
    filters,
    setFilters,
    sort,
    toggleSort,
    page,
    setPage,
    visibleRows,
    totalPages,
  } = useAdminTableState<AdminCatalogEntry, CatalogFilters>({
    rows: entriesByKind[kind],
    getSearchText: getCatalogSearchText,
    matches: matchesCatalogFilters,
    initialFilters: EMPTY_FILTERS,
    getSortValue: getCatalogSortValue,
  });

  const meta = KIND_META[kind];
  const isFiltered = kind !== "genres" || search.trim() !== "" || filters.isActive !== "";

  const applyFilters = (draft: CatalogFilterDraft) => {
    setKind(draft.kind as AdminCatalogKind);
    setSearch(draft.search);
    setFilters({ isActive: draft.isActive });
  };

  const clearFilters = () => {
    setKind("genres");
    setSearch("");
    setFilters(EMPTY_FILTERS);
  };

  const columns: AdminTableColumn<AdminCatalogEntry>[] = [
    {
      id: "name",
      headerKey: "admin.catalogs.name",
      sortKey: "name",
      cell: (entry) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-(--color-text-primary)">{entry.name}</p>
          {entry.nameVi && (
            <p className="truncate text-[11px] text-(--color-text-muted)">{entry.nameVi}</p>
          )}
        </div>
      ),
    },
    {
      id: "usage",
      headerKey: meta.usageKey,
      sortKey: "usage",
      className: "w-24",
      align: "right",
      cell: (entry) => <span className="tabular-nums">{entry.usageCount}</span>,
    },
    {
      id: "sortOrder",
      headerKey: "admin.catalogs.sort_order",
      sortKey: "sortOrder",
      className: "w-20",
      align: "right",
      cell: (entry) => <span className="tabular-nums">{entry.sortOrder}</span>,
    },
    {
      id: "isActive",
      headerKey: "admin.catalogs.status",
      sortKey: "isActive",
      className: "w-28",
      cell: (entry) => (
        <Badge variant={entry.isActive ? "success" : "neutral"} size="xs">
          {translate(entry.isActive ? "admin.catalogs.active" : "admin.catalogs.hidden")}
        </Badge>
      ),
    },
    {
      id: "actions",
      className: "w-16",
      align: "right",
      cell: (entry) => (
        <AdminButton
          size="icon"
          variant="ghost"
          icon={Trash2}
          label={translate("admin.common.delete")}
          onClick={() => setDeleteTarget(entry)}
        />
      ),
    },
  ];

  return (
    <>
      <CatalogsFiltersCard
        kind={kind}
        search={search}
        isActive={filters.isActive}
        isFiltered={isFiltered}
        onApply={applyFilters}
        onClear={clearFilters}
        onCreate={() => setIsCreateOpen(true)}
        createLabelKey={meta.newKey}
        searchPlaceholderKey={meta.searchKey}
      />

      <AdminTable
        columns={columns}
        rows={visibleRows}
        getRowId={(entry) => entry.id}
        emptyIcon={Tags}
        emptyTitleKey={isFiltered ? "admin.common.no_results" : "admin.catalogs.empty_title"}
        emptyDescriptionKey={
          isFiltered ? "admin.common.no_results_body" : "admin.catalogs.empty_body"
        }
        captionKey="admin.catalogs.title"
        sort={sort}
        onSort={toggleSort}
        renderExpanded={(entry, closePanel) => (
          <CatalogInlineEdit
            key={`${kind}-${entry.id}`}
            kind={kind}
            entry={entry}
            onClose={closePanel}
          />
        )}
      />

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <CatalogFormDialog
        isOpen={isCreateOpen}
        kind={kind}
        meta={meta}
        onClose={() => setIsCreateOpen(false)}
      />

      <AdminDeleteDialog
        isOpen={deleteTarget !== null}
        entityName={deleteTarget?.name ?? ""}
        onClose={() => setDeleteTarget(null)}
        onDelete={() => deleteCatalogEntryAction(token ?? "", kind, deleteTarget?.id ?? "")}
        onDeactivate={() =>
          updateCatalogEntryAction(token ?? "", kind, deleteTarget?.id ?? "", {
            isActive: false,
          })
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

function CatalogFormDialog({
  isOpen,
  kind,
  meta,
  onClose,
}: {
  isOpen: boolean;
  kind: AdminCatalogKind;
  meta: { nounKey: string; newKey: string };
  onClose: () => void;
}) {
  const { values, fieldErrors, submitError, isPending, updateField, fillSample, submit } =
    useCatalogForm({
      kind,
      entry: null,
      resetKey: `${isOpen}-${kind}`,
      onSaved: onClose,
    });

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submit}
      titleKey={meta.newKey}
      descriptionKey={meta.nounKey}
      submitLabelKey="admin.common.create"
      error={submitError}
      isPending={isPending}
      size="md"
      onFillSample={fillSample}
    >
      <CatalogFormFields values={values} fieldErrors={fieldErrors} updateField={updateField} />
    </AdminFormModal>
  );
}
