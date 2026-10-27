"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import Tabs, { tabId, tabPanelId } from "@/components/ui/Tabs";
import AdminButton from "@/features/admin/components/AdminButton";
import AdminDeleteDialog from "@/features/admin/components/AdminDeleteDialog";
import AdminFormField, { AdminCheckbox } from "@/features/admin/components/AdminFormField";
import AdminFormModal from "@/features/admin/components/AdminFormModal";
import AdminPagination from "@/features/admin/components/AdminPagination";
import AdminSearchInput from "@/features/admin/components/AdminSearchInput";
import AdminTable, { type AdminTableColumn } from "@/features/admin/components/AdminTable";
import { ADMIN_FIELD_GRID_CLASS, ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import { useAdminTableState } from "@/features/admin/hooks/useAdminTableState";
import { createCatalogSchema, toAdminFieldErrors } from "@/features/admin/schema";
import {
  createCatalogEntryAction,
  deleteCatalogEntryAction,
  updateCatalogEntryAction,
} from "@/features/admin/actions/catalogs.action";
import type { AdminCatalogEntry, AdminCatalogKind } from "@/features/admin/types";

const TAB_ID_BASE = "admin-catalogs";

const KIND_META: Record<
  AdminCatalogKind,
  { tabKey: string; nounKey: string; newKey: string; usageKey: string }
> = {
  genres: {
    tabKey: "admin.catalogs.tab_genres",
    nounKey: "admin.catalogs.noun_genre",
    newKey: "admin.catalogs.new_genre",
    usageKey: "admin.catalogs.usage_movies",
  },
  formats: {
    tabKey: "admin.catalogs.tab_formats",
    nounKey: "admin.catalogs.noun_format",
    newKey: "admin.catalogs.new_format",
    usageKey: "admin.catalogs.usage_showtimes",
  },
  "age-ratings": {
    tabKey: "admin.catalogs.tab_age_ratings",
    nounKey: "admin.catalogs.noun_age_rating",
    newKey: "admin.catalogs.new_age_rating",
    usageKey: "admin.catalogs.usage_movies",
  },
};

const getCatalogSearchText = (entry: AdminCatalogEntry) =>
  `${entry.name} ${entry.nameVi ?? ""} ${entry.sortOrder}`;

/**
 * Genres, formats and age ratings carry the same payload on the backend, so one
 * screen edits all three behind a tab strip — the tab only changes the endpoint
 * segment and the copy.
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
  const [formTarget, setFormTarget] = useState<AdminCatalogEntry | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCatalogEntry | null>(null);

  const { search, setSearch, page, setPage, visibleRows, totalRows, totalPages } =
    useAdminTableState({ rows: entriesByKind[kind], getSearchText: getCatalogSearchText });

  const meta = KIND_META[kind];

  const columns: AdminTableColumn<AdminCatalogEntry>[] = [
    {
      id: "name",
      headerKey: "admin.catalogs.name",
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
      className: "w-24",
      align: "right",
      cell: (entry) => <span className="tabular-nums">{entry.usageCount}</span>,
    },
    {
      id: "sortOrder",
      headerKey: "admin.catalogs.sort_order",
      className: "w-20",
      align: "right",
      cell: (entry) => <span className="tabular-nums">{entry.sortOrder}</span>,
    },
    {
      id: "isActive",
      headerKey: "admin.catalogs.status",
      className: "w-28",
      cell: (entry) => (
        <Badge variant={entry.isActive ? "success" : "neutral"} size="xs">
          {translate(entry.isActive ? "admin.catalogs.active" : "admin.catalogs.hidden")}
        </Badge>
      ),
    },
    {
      id: "actions",
      className: "w-24",
      align: "right",
      cell: (entry) => (
        <div className="flex items-center justify-end gap-1">
          <AdminButton
            size="icon"
            variant="ghost"
            icon={Pencil}
            label={translate("admin.common.edit")}
            onClick={() => setFormTarget(entry)}
          />
          <AdminButton
            size="icon"
            variant="ghost"
            icon={Trash2}
            label={translate("admin.common.delete")}
            onClick={() => setDeleteTarget(entry)}
          />
        </div>
      ),
    },
  ];

  const isFiltered = search.trim() !== "";

  return (
    <>
      <Tabs
        tabs={(Object.keys(KIND_META) as AdminCatalogKind[]).map((tabKind) => ({
          key: tabKind,
          label: translate(KIND_META[tabKind].tabKey),
        }))}
        activeTab={kind}
        onTabChange={(nextKind) => {
          setKind(nextKind as AdminCatalogKind);
          setSearch("");
        }}
        ariaLabel={translate("admin.catalogs.title")}
        idBase={TAB_ID_BASE}
      />

      <div
        role="tabpanel"
        id={tabPanelId(TAB_ID_BASE, kind)}
        aria-labelledby={tabId(TAB_ID_BASE, kind)}
        tabIndex={0}
        className="pt-4 outline-none"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            className="w-full sm:max-w-xs"
            placeholderKey="admin.catalogs.search"
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
            {translate(meta.newKey)}
          </AdminButton>
        </div>

        <AdminTable
          columns={columns}
          rows={visibleRows}
          getRowId={(entry) => entry.id}
          emptyIcon={Tags}
          emptyTitleKey={isFiltered ? "admin.common.no_results" : "admin.catalogs.empty_title"}
          emptyDescriptionKey={
            isFiltered ? "admin.common.no_results_body" : "admin.catalogs.empty_body"
          }
        />

        <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <CatalogFormDialog
        isOpen={formTarget !== null}
        kind={kind}
        meta={meta}
        entry={formTarget === "new" ? null : formTarget}
        onClose={() => setFormTarget(null)}
      />

      <AdminDeleteDialog
        isOpen={deleteTarget !== null}
        entityName={deleteTarget?.name ?? ""}
        onClose={() => setDeleteTarget(null)}
        onDelete={() =>
          deleteCatalogEntryAction(token ?? "", kind, deleteTarget?.id ?? "")
        }
        onDeactivate={() =>
          updateCatalogEntryAction(token ?? "", kind, deleteTarget?.id ?? "", { isActive: false })
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

interface CatalogFormState {
  name: string;
  nameVi: string;
  sortOrder: string;
  isActive: boolean;
}

function toFormState(entry: AdminCatalogEntry | null): CatalogFormState {
  return entry
    ? {
        name: entry.name,
        nameVi: entry.nameVi ?? "",
        sortOrder: String(entry.sortOrder),
        isActive: entry.isActive,
      }
    : { name: "", nameVi: "", sortOrder: "0", isActive: true };
}

function CatalogFormDialog({
  isOpen,
  kind,
  entry,
  meta,
  onClose,
}: {
  isOpen: boolean;
  kind: AdminCatalogKind;
  entry: AdminCatalogEntry | null;
  meta: { nounKey: string; newKey: string };
  onClose: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<CatalogFormState>(() => toFormState(entry));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Re-seed the fields whenever the dialog opens for a different row.
  const formSignature = `${isOpen}-${entry?.id ?? "new"}`;
  const [syncedFormSignature, setSyncedFormSignature] = useState(formSignature);
  if (formSignature !== syncedFormSignature) {
    setSyncedFormSignature(formSignature);
    setValues(toFormState(entry));
    setFieldErrors({});
    setSubmitError(null);
  }

  const updateField = <TField extends keyof CatalogFormState>(
    field: TField,
    value: CatalogFormState[TField],
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
    const parsed = createCatalogSchema(translate).safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toAdminFieldErrors(parsed.error));
      return;
    }
    if (!token) {
      setSubmitError(translate("admin.common.session_expired"));
      return;
    }

    const payload = {
      name: parsed.data.name,
      nameVi: parsed.data.nameVi === "" ? null : parsed.data.nameVi,
      sortOrder: parsed.data.sortOrder,
      isActive: parsed.data.isActive,
    };

    startTransition(async () => {
      const result = entry
        ? await updateCatalogEntryAction(token, kind, entry.id, payload)
        : await createCatalogEntryAction(token, kind, payload);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate(entry ? "admin.common.saved" : "admin.common.created"), {
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
      titleKey={entry ? "admin.catalogs.edit_title" : meta.newKey}
      descriptionKey={meta.nounKey}
      submitLabelKey={entry ? "admin.common.save" : "admin.common.create"}
      error={submitError}
      isPending={isPending}
      size="md"
    >
      <div className={ADMIN_FIELD_GRID_CLASS}>
        <AdminFormField labelKey="admin.catalogs.name" error={fieldErrors.name}>
          <input
            type="text"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={ADMIN_INPUT_CLASS}
            autoFocus
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.catalogs.name_vi" error={fieldErrors.nameVi}>
          <input
            type="text"
            value={values.nameVi}
            onChange={(event) => updateField("nameVi", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>
      </div>

      <AdminFormField
        labelKey="admin.catalogs.sort_order"
        hintKey="admin.catalogs.sort_order_hint"
        error={fieldErrors.sortOrder}
        className="sm:max-w-[10rem]"
      >
        <input
          type="number"
          min={0}
          max={999}
          value={values.sortOrder}
          onChange={(event) => updateField("sortOrder", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>

      <AdminCheckbox
        labelKey="admin.catalogs.is_active"
        hintKey="admin.catalogs.is_active_hint"
        checked={values.isActive}
        onChange={(checked) => updateField("isActive", checked)}
      />
    </AdminFormModal>
  );
}
