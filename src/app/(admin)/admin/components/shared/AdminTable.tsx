"use client";

import { Fragment, useState, type ReactNode } from "react";
import { ArrowUpDown, ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import EmptyState from "@/components/ui/EmptyState";
import { ADMIN_CARD_CLASS } from "@/features/admin/constants";

export type AdminSortDirection = "asc" | "desc";

/** The active header sort, reported upward so the owner can re-fetch or re-sort. */
export interface AdminTableSort {
  key: string;
  direction: AdminSortDirection;
}

export interface AdminTableColumn<TRow> {
  /** Stable identity for the header cell and the row cells. */
  id: string;
  /** i18n key for the header. Omit on the actions column: the phone card also
   * drops the label so the buttons get the full width. */
  headerKey?: string;
  cell: (row: TRow) => ReactNode;
  /** Extra classes on the desktop `<th>`/`<td>` (widths, colours). */
  className?: string;
  align?: "left" | "right";
  /** Marks the column sortable: the header becomes a button reporting this key
   * through `onSort`. The key is opaque to the table — the owner maps it to a
   * wire field (server-paginated lists) or a comparator (in-memory lists). */
  sortKey?: string;
}

/**
 * Console table with a single markup for both widths: a real table from 740px
 * up, a stack of labelled cards below it (see `.admin-table` in
 * `styles/admin-theme.css`). Rows are already fetched by the page — this never
 * sorts, filters or paginates on its own.
 *
 * Expansion is opt-in: pass `renderExpanded` and every row gains a centred
 * toggle bar plus a full-width detail row underneath. State is internal
 * (accordion by default); pass `expandedRowId` + `onToggleExpand` to control it.
 */
export default function AdminTable<TRow>({
  columns,
  rows,
  getRowId,
  emptyIcon,
  emptyTitleKey,
  emptyDescriptionKey,
  captionKey,
  onRowClick,
  isRowSelected,
  expandedRowId,
  onToggleExpand,
  renderExpanded,
  expandLabelKey = "admin.common.view_detail",
  collapseLabelKey = "admin.common.collapse",
  sort = null,
  onSort,
}: {
  columns: AdminTableColumn<TRow>[];
  rows: TRow[];
  getRowId: (row: TRow) => string;
  emptyIcon: LucideIcon;
  emptyTitleKey: string;
  emptyDescriptionKey?: string;
  /** Visually hidden `<caption>` — the page header already names the table. */
  captionKey?: string;
  /** Makes a row activate on click (selection sync with another surface). */
  onRowClick?: (row: TRow) => void;
  isRowSelected?: (row: TRow) => boolean;
  /** Id of the row whose detail panel is open; `null` collapses all. */
  expandedRowId?: string | null;
  onToggleExpand?: (row: TRow) => void;
  /** Detail content rendered in a `colSpan` row under the expanded row;
   * receives `closePanel` so the panel can dismiss itself. */
  renderExpanded?: (row: TRow, closePanel: () => void) => ReactNode;
  expandLabelKey?: string;
  collapseLabelKey?: string;
  /** Active sort — `null` means the owner's default order. Only rendered on
   * columns that declare `sortKey`. */
  sort?: AdminTableSort | null;
  /** Header click handler; receives the column's `sortKey`. */
  onSort?: (key: string) => void;
}) {
  const { translate } = useLocale();
  // Expansion state lives here so a toggle re-renders only the table, not the
  // page that owns the row data. Controlled mode stays for callers that need it.
  const isControlled = expandedRowId !== undefined || onToggleExpand !== undefined;
  const [internalExpandedId, setInternalExpandedId] = useState<string | null>(null);
  const activeExpandedId = isControlled ? expandedRowId : internalExpandedId;
  const isExpandable = Boolean(renderExpanded);
  const handleToggleExpand = (row: TRow) => {
    if (isControlled) {
      onToggleExpand?.(row);
      return;
    }
    const rowId = getRowId(row);
    setInternalExpandedId((current) => (current === rowId ? null : rowId));
  };
  const expandedRow = rows.find((row) => getRowId(row) === activeExpandedId);
  const closePanel = () => {
    if (isControlled) {
      if (expandedRow) onToggleExpand?.(expandedRow);
    } else {
      setInternalExpandedId(null);
    }
  };

  if (rows.length === 0) {
    return (
      <div className={ADMIN_CARD_CLASS}>
        <EmptyState
          icon={emptyIcon}
          title={translate(emptyTitleKey)}
          description={emptyDescriptionKey ? translate(emptyDescriptionKey) : undefined}
        />
      </div>
    );
  }

  return (
    <div className={`${ADMIN_CARD_CLASS} overflow-x-auto overscroll-x-contain`}>
      <table className="admin-table">
        {captionKey && <caption className="sr-only">{translate(captionKey)}</caption>}

        <thead>
          <tr>
            {columns.map((column) => {
              const isSortable = Boolean(column.sortKey && onSort && column.headerKey);
              const isSorted = isSortable && sort?.key === column.sortKey;
              const SortIcon = !isSorted
                ? ArrowUpDown
                : sort?.direction === "asc"
                  ? ChevronUp
                  : ChevronDown;
              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={
                    isSorted ? (sort?.direction === "asc" ? "ascending" : "descending") : undefined
                  }
                  className={`${column.align === "right" ? "admin-table-right" : ""} ${column.className ?? ""}`}
                >
                  {column.headerKey ? (
                    isSortable ? (
                      <button
                        type="button"
                        onClick={() => onSort?.(column.sortKey!)}
                        className="admin-table-sort"
                      >
                        {translate(column.headerKey)}
                        <SortIcon
                          size={12}
                          aria-hidden
                          className={isSorted ? "text-(--admin-accent-ink)" : "opacity-50"}
                        />
                      </button>
                    ) : (
                      translate(column.headerKey)
                    )
                  ) : (
                    <span className="sr-only">—</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const rowId = getRowId(row);
            const isExpanded = activeExpandedId === rowId;

            return (
              <Fragment key={rowId}>
                <tr
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={[
                    onRowClick ? "cursor-pointer" : "",
                    isRowSelected?.(row) ? "bg-(--color-gold)/10" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      data-label={column.headerKey ? translate(column.headerKey) : undefined}
                      className={`${column.align === "right" ? "admin-table-right" : ""} ${column.className ?? ""}`}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>

                {isExpandable && (
                  <>
                    <tr className={isExpanded ? "admin-expand-toggle is-expanded" : "admin-expand-toggle"}>
                      <td colSpan={columns.length}>
                        <button
                          type="button"
                          onClick={() => handleToggleExpand(row)}
                          aria-expanded={isExpanded}
                          className="admin-expand-toggle-button"
                        >
                          {translate(isExpanded ? collapseLabelKey : expandLabelKey)}
                          <ChevronDown
                            size={14}
                            aria-hidden
                            className={isExpanded ? "rotate-180" : ""}
                          />
                        </button>
                      </td>
                    </tr>

                    {isExpanded && renderExpanded && (
                      <tr className="admin-expand-panel">
                        <td colSpan={columns.length}>{renderExpanded(row, closePanel)}</td>
                      </tr>
                    )}
                  </>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
