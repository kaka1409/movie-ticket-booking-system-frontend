"use client";

import AdminFormField, {
  AdminCheckbox,
} from "@/app/(admin)/admin/components/shared/AdminFormField";
import { ADMIN_FIELD_GRID_CLASS, ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import type { ComboFormState } from "./useComboForm";

/**
 * Presentational half of the combo form — shared by the create dialog and the
 * expandable-row editor so the two surfaces render the same fields.
 */
export default function ComboFormFields({
  values,
  fieldErrors,
  updateField,
}: {
  values: ComboFormState;
  fieldErrors: Record<string, string>;
  updateField: <TField extends keyof ComboFormState>(
    field: TField,
    value: ComboFormState[TField],
  ) => void;
}) {
  return (
    <>
      <div className={ADMIN_FIELD_GRID_CLASS}>
        <AdminFormField labelKey="admin.combos.name" error={fieldErrors.name} required>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.combos.name_vi" error={fieldErrors.nameVi}>
          <input
            type="text"
            name="nameVi"
            value={values.nameVi}
            onChange={(event) => updateField("nameVi", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.combos.price" error={fieldErrors.price} required>
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

        <AdminFormField
          labelKey="admin.combos.tag"
          hintKey="admin.combos.tag_hint"
          error={fieldErrors.tag}
        >
          <input
            type="text"
            name="tag"
            value={values.tag}
            onChange={(event) => updateField("tag", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>
      </div>

      <AdminFormField labelKey="admin.combos.description" error={fieldErrors.description}>
        <textarea
          name="description"
          rows={2}
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          className={`${ADMIN_INPUT_CLASS} resize-y`}
        />
      </AdminFormField>

      <AdminFormField labelKey="admin.combos.description_vi" error={fieldErrors.descriptionVi}>
        <textarea
          name="descriptionVi"
          rows={2}
          value={values.descriptionVi}
          onChange={(event) => updateField("descriptionVi", event.target.value)}
          className={`${ADMIN_INPUT_CLASS} resize-y`}
        />
      </AdminFormField>

      <AdminFormField labelKey="admin.combos.image" error={fieldErrors.image}>
        <input
          type="url"
          name="image"
          value={values.image}
          onChange={(event) => updateField("image", event.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </AdminFormField>

      <AdminCheckbox
        labelKey="admin.combos.is_active"
        hintKey="admin.combos.is_active_hint"
        checked={values.isActive}
        onChange={(checked) => updateField("isActive", checked)}
      />
    </>
  );
}
