"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import ActionSheet from "@/components/ui/ActionSheet";

export default function ConfirmationSheet({
  open,
  refundAmount,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  refundAmount: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { translate, locale } = useLocale();

  return (
    <ActionSheet open={open} onClose={onCancel}>
      <div className="space-y-5 text-center">
        <h2 className="text-lg font-extrabold text-(--color-text-primary)">
          {translate("tickets.cancel.confirm_heading")}
        </h2>

        <p className="text-sm text-(--color-text-muted)">
          {translate("tickets.cancel.confirm_description")}
        </p>

        <div className="py-2">
          <p className="text-xs text-(--color-text-muted) mb-2">
            {translate("tickets.cancel.confirm_you_receive")}
          </p>
          <p className="text-3xl font-extrabold text-(--color-gold)">
            {formatVND(refundAmount, locale)}
          </p>
          <p className="text-xs text-(--color-text-muted) mt-2">
            {translate("tickets.cancel.confirm_refund_text")}
          </p>
        </div>

        <p className="text-xs text-(--color-text-muted)">
          {translate("tickets.cancel.confirm_warning")}
        </p>

        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={onConfirm}
            className="
              w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase border border-red-500
              bg-transparent text-red-500 active:scale-[0.98] transition-all duration-150
            "
          >
            {translate("tickets.cancel.confirm_cta")}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="
              w-full py-3.5 rounded-2xl font-extrabold text-sm tracking-widest uppercase
              text-black bg-(--color-gold) active:scale-[0.98] transition-all duration-150
            "
          >
            {translate("tickets.cancel.keep_ticket")}
          </button>
        </div>
      </div>
    </ActionSheet>
  );
}
