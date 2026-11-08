"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFilterChipGroup from "@/app/(admin)/admin/components/shared/AdminFilterChips";
import AdminSearchInput from "@/app/(admin)/admin/components/shared/AdminSearchInput";
import { ADMIN_CARD_CLASS, ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import type {
  AdminBookingStatus,
  AdminPaymentMethodCode,
  AdminPaymentStatus,
} from "@/features/admin/types";

/** Draft the card hands to `onApply` — wire param names for the URL commit. */
export interface TransactionFilterDraft {
  search: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  dateFrom: string;
  dateTo: string;
}

const BOOKING_STATUS_OPTIONS: { value: AdminBookingStatus; labelKey: string }[] = [
  { value: "pending", labelKey: "admin.transactions.status_pending" },
  { value: "paid", labelKey: "admin.transactions.status_paid" },
  { value: "expired", labelKey: "admin.transactions.status_expired" },
  { value: "cancelled", labelKey: "admin.transactions.status_cancelled" },
];

const PAYMENT_STATUS_OPTIONS: { value: AdminPaymentStatus; labelKey: string }[] = [
  { value: "pending", labelKey: "admin.transactions.pay_pending" },
  { value: "success", labelKey: "admin.transactions.pay_success" },
  { value: "failed", labelKey: "admin.transactions.pay_failed" },
  { value: "expired", labelKey: "admin.transactions.pay_expired" },
];

const PAYMENT_METHOD_OPTIONS: { value: AdminPaymentMethodCode; labelKey: string }[] = [
  { value: "vnpay", labelKey: "admin.transactions.method_vnpay" },
  { value: "momo", labelKey: "admin.transactions.method_momo" },
  { value: "simulated", labelKey: "admin.transactions.method_simulated" },
];

/**
 * Filter card above the transaction table: free-text search (customer, contact,
 * movie) plus booking/payment chip groups and a showtime date range. Edits
 * stay local until Apply — one URL navigation per commit.
 */
export default function TransactionsFiltersCard({
  filters,
  total,
  isFiltered,
  onApply,
  onClear,
}: {
  filters: TransactionFilterDraft;
  total: number;
  isFiltered: boolean;
  onApply: (draft: TransactionFilterDraft) => void;
  onClear: () => void;
}) {
  const { translate } = useLocale();

  const [searchInput, setSearchInput] = useState(filters.search);
  const [statusValue, setStatusValue] = useState(filters.status);
  const [paymentStatusValue, setPaymentStatusValue] = useState(filters.paymentStatus);
  const [paymentMethodValue, setPaymentMethodValue] = useState(filters.paymentMethod);
  const [dateFromValue, setDateFromValue] = useState(filters.dateFrom);
  const [dateToValue, setDateToValue] = useState(filters.dateTo);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply({
      search: searchInput,
      status: statusValue,
      paymentStatus: paymentStatusValue,
      paymentMethod: paymentMethodValue,
      dateFrom: dateFromValue,
      dateTo: dateToValue,
    });
  };

  const handleClear = () => {
    setSearchInput("");
    setStatusValue("");
    setPaymentStatusValue("");
    setPaymentMethodValue("");
    setDateFromValue("");
    setDateToValue("");
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className={`${ADMIN_CARD_CLASS} mb-3 p-3`}>
      <AdminSearchInput
        value={searchInput}
        onChange={setSearchInput}
        placeholderKey="admin.transactions.search"
      />

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-(--color-border) pt-3 sm:grid-cols-3">
        <AdminFilterChipGroup
          labelKey="admin.transactions.column_booking_status"
          options={BOOKING_STATUS_OPTIONS}
          value={statusValue}
          onChange={setStatusValue}
        />
        <AdminFilterChipGroup
          labelKey="admin.transactions.column_payment_status"
          options={PAYMENT_STATUS_OPTIONS}
          value={paymentStatusValue}
          onChange={setPaymentStatusValue}
        />
        <AdminFilterChipGroup
          labelKey="admin.transactions.column_payment_method"
          options={PAYMENT_METHOD_OPTIONS}
          value={paymentMethodValue}
          onChange={setPaymentMethodValue}
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
        <a
          href={`/admin/transactions/export${buildExportQuery(filters)}`}
          className="ml-auto inline-flex items-center rounded-lg border border-(--color-border) px-3 py-1.5 text-[12px] font-semibold text-(--color-text-secondary) transition-colors hover:border-(--color-gold)/40 hover:text-(--color-gold)"
          download
        >
          {translate("admin.transactions.export_csv")}
        </a>
        <p className="text-[11px] font-semibold text-(--color-text-muted)">
          {translate("admin.common.total")}: {total}
        </p>
      </div>
    </form>
  );
}

function buildExportQuery(filters: TransactionFilterDraft): string {
  const params = new URLSearchParams();
  if (filters.search !== "") params.set("search", filters.search);
  if (filters.status !== "") params.set("status", filters.status);
  if (filters.paymentStatus !== "") params.set("paymentStatus", filters.paymentStatus);
  if (filters.paymentMethod !== "") params.set("paymentMethod", filters.paymentMethod);
  if (filters.dateFrom !== "") params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo !== "") params.set("dateTo", filters.dateTo);
  const query = params.toString();
  return query === "" ? "" : `?${query}`;
}
