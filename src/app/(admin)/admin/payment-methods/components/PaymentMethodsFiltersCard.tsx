"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFilterChipGroup from "@/app/(admin)/admin/components/shared/AdminFilterChips";
import { ADMIN_CARD_CLASS } from "@/features/admin/constants";

/** Draft the card hands to `onApply` — committed filter state, not URL params. */
export interface PaymentMethodFilterDraft {
  isActive: string;
  adapterEnabled: string;
}

/**
 * Compact filter card above the payment-method table — same shape as
 * `MovieFiltersCard` minus the search row (the catalog is a handful of seeded
 * rows). Edits stay local until Apply.
 */
export default function PaymentMethodsFiltersCard({
  isActive,
  adapterEnabled,
  isFiltered,
  onApply,
  onClear,
}: {
  isActive: string;
  adapterEnabled: string;
  isFiltered: boolean;
  onApply: (draft: PaymentMethodFilterDraft) => void;
  onClear: () => void;
}) {
  const { translate } = useLocale();

  const [isActiveValue, setIsActiveValue] = useState(isActive);
  const [adapterValue, setAdapterValue] = useState(adapterEnabled);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply({ isActive: isActiveValue, adapterEnabled: adapterValue });
  };

  const handleClear = () => {
    setIsActiveValue("");
    setAdapterValue("");
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className={`${ADMIN_CARD_CLASS} mb-3 p-3`}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <AdminFilterChipGroup
          labelKey="admin.paymentMethods.column_sale"
          options={[
            { value: "true", labelKey: "admin.common.yes" },
            { value: "false", labelKey: "admin.common.no" },
          ]}
          value={isActiveValue}
          onChange={setIsActiveValue}
        />

        <AdminFilterChipGroup
          labelKey="admin.paymentMethods.column_adapter"
          options={[
            { value: "true", labelKey: "admin.paymentMethods.adapter_on" },
            { value: "false", labelKey: "admin.paymentMethods.adapter_off" },
          ]}
          value={adapterValue}
          onChange={setAdapterValue}
        />
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-(--color-border) pt-3">
        <AdminButton type="submit" variant="outline" size="md">
          {translate("admin.common.apply")}
        </AdminButton>
        {isFiltered && (
          <AdminButton onClick={handleClear}>{translate("admin.common.clear_filters")}</AdminButton>
        )}
      </div>
    </form>
  );
}
