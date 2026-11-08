"use client";

import AdminFormField, {
  AdminCheckbox,
} from "@/app/(admin)/admin/components/shared/AdminFormField";
import { ADMIN_FIELD_GRID_CLASS, ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import type { FoodFormState } from "./useFoodForm";

/**
 * Presentational half of the snack form — shared by the create dialog and the
 * expandable-row editor so the two surfaces render the same fields.
 */
export default function FoodFormFields({
  values,
  fieldErrors,
  updateField,
}: {
  values: FoodFormState;
  fieldErrors: Record<string, string>;
  updateField: <TField extends keyof FoodFormState>(
    field: TField,
    value: FoodFormState[TField],
  ) => void;
}) {
  return (
    <>
      <div className={ADMIN_FIELD_GRID_CLASS}>
        <AdminFormField labelKey="admin.food.name" error={fieldErrors.name} required>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.food.name_vi" error={fieldErrors.nameVi}>
          <input
            type="text"
            name="nameVi"
            value={values.nameVi}
            onChange={(event) => updateField("nameVi", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField
          labelKey="admin.food.category"
          hintKey="admin.food.category_hint"
          error={fieldErrors.category}
          required
        >
          <input
            type="text"
            name="category"
            value={values.category}
            onChange={(event) => updateField("category", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.food.price" error={fieldErrors.price} required>
          <input
            type="number"
            name="price"
            min={0}
            step={1000}
            value={values.price}
            onChange={(event) => updateField("price", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>
      </div>

      <AdminFormField labelKey="admin.food.image" error={fieldErrors.image}>
        <input
          type="url"
          name="image"
          value={values.image}
          onChange={(event) => updateField("image", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>

      <AdminCheckbox
        labelKey="admin.food.is_active"
        hintKey="admin.food.is_active_hint"
        checked={values.isActive}
        onChange={(checked) => updateField("isActive", checked)}
      />
    </>
  );
}
