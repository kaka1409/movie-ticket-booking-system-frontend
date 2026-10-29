"use client";

import Image from "next/image";
import { CheckCircle2, FlaskConical, Lock } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useLocale } from "@/contexts/LocaleContext";
import { getPaymentBrandImage } from "../../paymentBrand";
import type { PaymentMethodOption } from "../../types";

/**
 * One catalog card, controlled: the caller owns the selection because the
 * booking draft and a transfer checkout keep their choice in different places.
 * A method the server reports `enabled: false` stays visible ("coming soon")
 * but inert — no flow may hand a gateway that would answer 503.
 */
export default function PaymentMethodCard({
  method,
  isDemo,
  isSelected,
  onSelect,
}: {
  method: PaymentMethodOption;
  isDemo: boolean;
  isSelected: boolean;
  onSelect: (method: PaymentMethodOption) => void;
}) {
  const { translate } = useLocale();
  const selected = method.enabled && isSelected;
  const brandImage = getPaymentBrandImage(method.id);

  return (
    <button
      type="button"
      disabled={!method.enabled}
      aria-pressed={selected}
      aria-disabled={!method.enabled}
      onClick={() => {
        if (!method.enabled) return;
        onSelect(method);
      }}
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border transition duration-150 text-left ${
        !method.enabled
          ? "bg-(--color-surface) border-(--color-border) opacity-55 cursor-not-allowed"
          : selected
            ? "bg-(--color-surface) border-(--color-gold) shadow-[0_0_0_1px_rgba(255,204,77,0.12)] active:scale-[0.99]"
            : "bg-(--color-surface) border-(--color-border) hover:border-(--color-gold)/30 active:scale-[0.99]"
      }`}
    >
      <div
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition duration-150 ${
          selected
            ? "border-(--color-gold) bg-(--color-gold)"
            : "border-(--color-text-muted) bg-transparent"
        }`}
      >
        {selected ? (
          <div className="w-2 h-2 rounded-full bg-[#0F0F0F]" />
        ) : (
          !method.enabled && <Lock size={10} className="text-(--color-text-muted)" />
        )}
      </div>

      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-(--color-surface-2) overflow-hidden">
        {brandImage ? (
          <Image
            src={brandImage}
            alt={method.name}
            width={28}
            height={28}
            className="object-contain"
          />
        ) : (
          <FlaskConical size={20} className="text-(--color-gold)" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-bold text-sm ${
              selected ? "text-(--color-text-primary)" : "text-(--color-text-secondary)"
            }`}
          >
            {method.name}
          </span>
          {!method.enabled && (
            <Badge variant="neutral" size="xs">
              {translate("booking.payment.coming_soon")}
            </Badge>
          )}
          {method.enabled && isDemo && (
            <Badge variant="gold" size="xs">
              {translate("booking.payment.demo")}
            </Badge>
          )}
        </div>
        <p className="text-xs text-(--color-text-muted) mt-0.5">{method.description}</p>
      </div>

      {selected && <CheckCircle2 size={18} className="text-(--color-gold) flex-shrink-0" />}
    </button>
  );
}
