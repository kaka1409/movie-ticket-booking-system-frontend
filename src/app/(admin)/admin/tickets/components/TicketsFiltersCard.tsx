"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFilterChipGroup from "@/app/(admin)/admin/components/shared/AdminFilterChips";
import AdminSearchInput from "@/app/(admin)/admin/components/shared/AdminSearchInput";
import { ADMIN_CARD_CLASS, ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import type { AdminTicketStatus } from "@/features/admin/types";

/** Draft the card hands to `onApply` — wire param names for the URL commit. */
export interface TicketFilterDraft {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

const STATUS_OPTIONS: { value: AdminTicketStatus; labelKey: string }[] = [
  { value: "active", labelKey: "admin.tickets.status_active" },
  { value: "used", labelKey: "admin.tickets.status_used" },
  { value: "expired", labelKey: "admin.tickets.status_expired" },
  { value: "cancelled", labelKey: "admin.tickets.status_cancelled" },
  { value: "refunded", labelKey: "admin.tickets.status_refunded" },
];

/**
 * Filter card above the ticket table: owner/buyer search, status chips and a
 * showtime date range. Edits stay local until Apply — one URL navigation per
 * commit.
 */
export default function TicketsFiltersCard({
  filters,
  total,
  isFiltered,
  onApply,
  onClear,
}: {
  filters: TicketFilterDraft;
  total: number;
  isFiltered: boolean;
  onApply: (draft: TicketFilterDraft) => void;
  onClear: () => void;
}) {
  const { translate } = useLocale();

  const [searchInput, setSearchInput] = useState(filters.search);
  const [statusValue, setStatusValue] = useState(filters.status);
  const [dateFromValue, setDateFromValue] = useState(filters.dateFrom);
  const [dateToValue, setDateToValue] = useState(filters.dateTo);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply({
      search: searchInput,
      status: statusValue,
      dateFrom: dateFromValue,
      dateTo: dateToValue,
    });
  };

  const handleClear = () => {
    setSearchInput("");
    setStatusValue("");
    setDateFromValue("");
    setDateToValue("");
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className={`${ADMIN_CARD_CLASS} mb-3 p-3`}>
      <AdminSearchInput
        value={searchInput}
        onChange={setSearchInput}
        placeholderKey="admin.tickets.search"
      />

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-(--color-border) pt-3 sm:grid-cols-3">
        <AdminFilterChipGroup
          labelKey="admin.tickets.column_status"
          options={STATUS_OPTIONS}
          value={statusValue}
          onChange={setStatusValue}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-(--color-border) pt-3">
        <label className="block">
          <span className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.transactions.date_from")}
          </span>
          <input
            type="date"
            value={dateFromValue}
            onChange={(event) => setDateFromValue(event.target.value)}
            className={`${ADMIN_INPUT_CLASS} mt-1.5`}
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.transactions.date_to")}
          </span>
          <input
            type="date"
            value={dateToValue}
            onChange={(event) => setDateToValue(event.target.value)}
            className={`${ADMIN_INPUT_CLASS} mt-1.5`}
          />
        </label>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-(--color-border) pt-3">
        <AdminButton type="submit" variant="primary" size="md">
          {translate("admin.common.apply")}
        </AdminButton>
        {isFiltered && (
          <AdminButton onClick={handleClear}>{translate("admin.common.clear_filters")}</AdminButton>
        )}
        <p className="ml-auto text-[11px] font-semibold text-(--color-text-muted)">
          {translate("admin.common.total")}: {total}
        </p>
      </div>
    </form>
  );
}
