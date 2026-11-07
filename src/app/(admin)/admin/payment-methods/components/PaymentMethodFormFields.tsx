"use client";

import AdminFormField, {
  AdminCheckbox,
} from "@/app/(admin)/admin/components/shared/AdminFormField";
import { ADMIN_FIELD_GRID_CLASS, ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import type { PaymentMethodFormState } from "./usePaymentMethodForm";

/**
 * Presentational half of the payment-method form — shared by the dialog and
 * the expandable-row editor so the two surfaces render the same fields.
 */
export default function PaymentMethodFormFields({
  values,
  fieldErrors,
  updateField,
}: {
  values: PaymentMethodFormState;
  fieldErrors: Record<string, string>;
  updateField: <TField extends keyof PaymentMethodFormState>(
    field: TField,
    value: PaymentMethodFormState[TField],
  ) => void;
}) {
  return (
    <>
      <div className={ADMIN_FIELD_GRID_CLASS}>
        <AdminFormField labelKey="admin.paymentMethods.name_en" error={fieldErrors.nameEn} required>
          <input
            type="text"
            value={values.nameEn}
            onChange={(event) => updateField("nameEn", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.paymentMethods.name_vi" error={fieldErrors.nameVi}>
          <input
            type="text"
            value={values.nameVi}
            onChange={(event) => updateField("nameVi", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField
          labelKey="admin.paymentMethods.description_en"
          error={fieldErrors.descriptionEn}
        >
          <input
            type="text"
            value={values.descriptionEn}
            onChange={(event) => updateField("descriptionEn", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField
          labelKey="admin.paymentMethods.description_vi"
          error={fieldErrors.descriptionVi}
        >
          <input
            type="text"
            value={values.descriptionVi}
            onChange={(event) => updateField("descriptionVi", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>
      </div>

      <AdminFormField
        labelKey="admin.paymentMethods.sort_order"
        error={fieldErrors.sortOrder}
        required
        className="sm:max-w-[10rem]"
      >
        <input
          type="number"
          min={0}
          max={99}
          value={values.sortOrder}
          onChange={(event) => updateField("sortOrder", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>

      <AdminCheckbox
        labelKey="admin.paymentMethods.is_active"
        hintKey="admin.paymentMethods.is_active_hint"
        checked={values.isActive}
        onChange={(checked) => updateField("isActive", checked)}
      />
    </>
  );
}
