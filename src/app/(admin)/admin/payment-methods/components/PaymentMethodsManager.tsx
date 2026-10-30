"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, FlaskConical, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFormField, { AdminCheckbox } from "@/app/(admin)/admin/components/shared/AdminFormField";
import AdminFormModal from "@/app/(admin)/admin/components/shared/AdminFormModal";
import AdminTable, { type AdminTableColumn } from "@/app/(admin)/admin/components/shared/AdminTable";
import { ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import { createPaymentMethodSchema, toAdminFieldErrors } from "@/features/admin/schema";
import { updatePaymentMethodAction } from "@/features/admin/actions/payments.action";
import type { AdminPaymentMethod } from "@/features/admin/types";

interface PaymentMethodFormState {
  nameEn: string;
  nameVi: string;
  descriptionEn: string;
  descriptionVi: string;
  sortOrder: string;
  isActive: boolean;
}

function toFormState(method: AdminPaymentMethod): PaymentMethodFormState {
  return {
    nameEn: method.nameEn,
    nameVi: method.nameVi ?? "",
    descriptionEn: method.descriptionEn ?? "",
    descriptionVi: method.descriptionVi ?? "",
    sortOrder: String(method.sortOrder),
    isActive: method.isActive,
  };
}

/**
 * The catalog rows are seeded by migrations — the console edits labels, order and
 * the sales switch, but never creates or deletes a gateway. Whether a method is
 * sellable is derived (`isActive && adapterEnabled`), so the table shows both
 * halves instead of a single misleading flag.
 */
export default function PaymentMethodsManager({ methods }: { methods: AdminPaymentMethod[] }) {
  const { translate } = useLocale();
  const [formTarget, setFormTarget] = useState<AdminPaymentMethod | null>(null);

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
    {
      id: "actions",
      className: "w-16",
      align: "right",
      cell: (method) => (
        <AdminButton
          size="icon"
          variant="ghost"
          icon={Pencil}
          label={translate("admin.common.edit")}
          onClick={() => setFormTarget(method)}
        />
      ),
    },
  ];

  return (
    <>
      <AdminTable
        columns={columns}
        rows={methods}
        getRowId={(method) => method.id}
        emptyIcon={CreditCard}
        emptyTitleKey="admin.paymentMethods.empty_title"
        emptyDescriptionKey="admin.paymentMethods.empty_body"
        captionKey="admin.paymentMethods.title"
      />

      <PaymentMethodFormDialog
        isOpen={formTarget !== null}
        method={formTarget}
        onClose={() => setFormTarget(null)}
      />
    </>
  );
}

function PaymentMethodFormDialog({
  isOpen,
  method,
  onClose,
}: {
  isOpen: boolean;
  method: AdminPaymentMethod | null;
  onClose: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [values, setValues] = useState<PaymentMethodFormState>(() =>
    method
      ? toFormState(method)
      : {
          nameEn: "",
          nameVi: "",
          descriptionEn: "",
          descriptionVi: "",
          sortOrder: "0",
          isActive: true,
        },
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formSignature = `${isOpen}-${method?.id ?? "none"}`;
  const [syncedFormSignature, setSyncedFormSignature] = useState(formSignature);
  if (formSignature !== syncedFormSignature) {
    setSyncedFormSignature(formSignature);
    if (method) setValues(toFormState(method));
    setFieldErrors({});
    setSubmitError(null);
  }

  const updateField = <TField extends keyof PaymentMethodFormState>(
    field: TField,
    value: PaymentMethodFormState[TField],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = () => {
    if (!method) return;

    const parsed = createPaymentMethodSchema(translate).safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toAdminFieldErrors(parsed.error));
      return;
    }
    if (!token) {
      setSubmitError(translate("admin.common.session_expired"));
      return;
    }

    const form = parsed.data;
    const target = method;

    startTransition(async () => {
      const result = await updatePaymentMethodAction(token, target.id, {
        nameEn: form.nameEn,
        ...(form.nameVi === "" ? {} : { nameVi: form.nameVi }),
        ...(form.descriptionEn === "" ? {} : { descriptionEn: form.descriptionEn }),
        ...(form.descriptionVi === "" ? {} : { descriptionVi: form.descriptionVi }),
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      });

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate("admin.common.saved"), { variant: "success" });
      onClose();
      router.refresh();
    });
  };

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      titleKey="admin.paymentMethods.edit_title"
      descriptionKey="admin.paymentMethods.description"
      submitLabelKey="admin.common.save"
      error={submitError}
      isPending={isPending}
      size="lg"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminFormField labelKey="admin.paymentMethods.name_en" error={fieldErrors.nameEn}>
          <input
            type="text"
            value={values.nameEn}
            onChange={(event) => updateField("nameEn", event.target.value)}
            className={ADMIN_INPUT_CLASS}
            autoFocus
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
    </AdminFormModal>
  );
}
