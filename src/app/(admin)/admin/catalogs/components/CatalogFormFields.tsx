"use client";

import AdminFormField, {
  AdminCheckbox,
} from "@/app/(admin)/admin/components/shared/AdminFormField";
import { ADMIN_FIELD_GRID_CLASS, ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import type { CatalogFormState } from "./useCatalogForm";

/**
 * Presentational half of the catalog form — shared by the create dialog and
 * the expandable-row editor so the two surfaces render the same fields.
 */
export default function CatalogFormFields({
  values,
  fieldErrors,
  updateField,
}: {
  values: CatalogFormState;
  fieldErrors: Record<string, string>;
  updateField: <TField extends keyof CatalogFormState>(
    field: TField,
    value: CatalogFormState[TField],
  ) => void;
}) {
  return (
    <>
      <div className={ADMIN_FIELD_GRID_CLASS}>
        <AdminFormField labelKey="admin.catalogs.name" error={fieldErrors.name} required>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.catalogs.name_vi" error={fieldErrors.nameVi}>
          <input
            type="text"
            name="nameVi"
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
          name="sortOrder"
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
    </>
  );
}
