"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import EmptyState from "@/components/ui/EmptyState";
import { ADMIN_CARD_CLASS } from "../constants";

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
}

/**
 * Console table with a single markup for both widths: a real table from 740px
 * up, a stack of labelled cards below it (see `.admin-table` in
 * `styles/admin-theme.css`). Rows are already fetched by the page — this never
 * sorts, filters or paginates on its own.
 */
export default function AdminTable<TRow>({
  columns,
  rows,
  getRowId,
  emptyIcon,
  emptyTitleKey,
  emptyDescriptionKey,
  captionKey,
}: {
  columns: AdminTableColumn<TRow>[];
  rows: TRow[];
  getRowId: (row: TRow) => string;
  emptyIcon: LucideIcon;
  emptyTitleKey: string;
  emptyDescriptionKey?: string;
  /** Visually hidden `<caption>` — the page header already names the table. */
  captionKey?: string;
}) {
  const { translate } = useLocale();

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
    <div className={`${ADMIN_CARD_CLASS} overflow-x-auto`}>
      <table className="admin-table">
        {captionKey && <caption className="sr-only">{translate(captionKey)}</caption>}

        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={`${column.align === "right" ? "admin-table-right" : ""} ${column.className ?? ""}`}
              >
                {column.headerKey ? translate(column.headerKey) : <span className="sr-only">—</span>}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={getRowId(row)}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
