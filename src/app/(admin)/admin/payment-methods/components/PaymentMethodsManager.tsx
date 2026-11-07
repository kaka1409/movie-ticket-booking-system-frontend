"use client";

import { CreditCard, FlaskConical } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Badge from "@/components/ui/Badge";
import AdminTable, {
  type AdminTableColumn,
} from "@/app/(admin)/admin/components/shared/AdminTable";
import { useAdminTableState } from "@/features/admin/hooks/useAdminTableState";
import type { AdminPaymentMethod } from "@/features/admin/types";
import PaymentMethodInlineEdit from "./PaymentMethodInlineEdit";
import PaymentMethodsFiltersCard, {
  type PaymentMethodFilterDraft,
} from "./PaymentMethodsFiltersCard";

interface PaymentMethodFilters {
  isActive: string;
  adapterEnabled: string;
}

const EMPTY_FILTERS: PaymentMethodFilters = { isActive: "", adapterEnabled: "" };

const getPaymentMethodSearchText = (method: AdminPaymentMethod) =>
  `${method.nameEn} ${method.nameVi ?? ""} ${method.id}`;

const matchesPaymentMethodFilters = (method: AdminPaymentMethod, filters: PaymentMethodFilters) =>
  (filters.isActive === "" || String(method.isActive) === filters.isActive) &&
  (filters.adapterEnabled === "" || String(method.adapterEnabled) === filters.adapterEnabled);

/**
 * The catalog rows are seeded by migrations — the console edits labels, order and
 * the sales switch, but never creates or deletes a gateway. Whether a method is
 * sellable is derived (`isActive && adapterEnabled`), so the table shows both
 * halves instead of a single misleading flag. Rows expand into an inline editor.
 */
export default function PaymentMethodsManager({ methods }: { methods: AdminPaymentMethod[] }) {
  const { translate } = useLocale();

  const { filters, setFilters, visibleRows } = useAdminTableState<
    AdminPaymentMethod,
    PaymentMethodFilters
  >({
    rows: methods,
    getSearchText: getPaymentMethodSearchText,
    matches: matchesPaymentMethodFilters,
    initialFilters: EMPTY_FILTERS,
  });

  const isFiltered = filters.isActive !== "" || filters.adapterEnabled !== "";

  const applyFilters = (draft: PaymentMethodFilterDraft) => {
    setFilters({ isActive: draft.isActive, adapterEnabled: draft.adapterEnabled });
  };

  const columns: AdminTableColumn<AdminPaymentMethod>[] = [
    {
      id: "method",
      headerKey: "admin.paymentMethods.column_method",
      cell: (method) => (
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-surface-2) text-(--color-gold)">
            {method.id === "simulated" ? (
              <FlaskConical size={15} aria-hidden />
            ) : (
              <CreditCard size={15} aria-hidden />
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-(--color-text-primary)">{method.nameEn}</p>
            <p className="truncate text-[11px] text-(--color-text-muted)">
              {method.nameVi ?? translate("admin.common.none")} · {method.id}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "sortOrder",
      headerKey: "admin.paymentMethods.column_order",
      className: "w-20",
      align: "right",
      cell: (method) => <span className="tabular-nums">{method.sortOrder}</span>,
    },
    {
      id: "adapter",
      headerKey: "admin.paymentMethods.column_adapter",
      className: "w-32",
      cell: (method) => (
        <Badge variant={method.adapterEnabled ? "success" : "neutral"} size="xs">
          {translate(
            method.adapterEnabled
              ? "admin.paymentMethods.adapter_on"
              : "admin.paymentMethods.adapter_off",
          )}
        </Badge>
      ),
    },
    {
      id: "isActive",
      headerKey: "admin.paymentMethods.column_sale",
      className: "w-28",
      cell: (method) => (
        <Badge variant={method.isActive ? "success" : "neutral"} size="xs">
          {translate(method.isActive ? "admin.common.yes" : "admin.common.no")}
        </Badge>
      ),
    },
    {
      id: "sellable",
      headerKey: "admin.paymentMethods.column_catalog",
      className: "w-32",
      cell: (method) => {
        const isSellable = method.isActive && method.adapterEnabled;
        const labelKey = !method.isActive
          ? "admin.paymentMethods.hidden"
          : isSellable
            ? "admin.paymentMethods.sellable"
            : method.id === "simulated"
              ? "admin.paymentMethods.demo"
              : "admin.paymentMethods.unsellable";

        return (
          <Badge variant={isSellable ? "gold" : "neutral"} size="xs">
            {translate(labelKey)}
          </Badge>
        );
      },
    },
  ];

  return (
    <>
      <PaymentMethodsFiltersCard
        isActive={filters.isActive}
        adapterEnabled={filters.adapterEnabled}
        isFiltered={isFiltered}
        onApply={applyFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      <AdminTable
        columns={columns}
        rows={visibleRows}
        getRowId={(method) => method.id}
        emptyIcon={CreditCard}
        emptyTitleKey={isFiltered ? "admin.common.no_results" : "admin.paymentMethods.empty_title"}
        emptyDescriptionKey={
          isFiltered ? "admin.common.no_results_body" : "admin.paymentMethods.empty_body"
        }
        captionKey="admin.paymentMethods.title"
        renderExpanded={(method, closePanel) => (
          <PaymentMethodInlineEdit key={method.id} method={method} onClose={closePanel} />
        )}
      />
    </>
  );
}
