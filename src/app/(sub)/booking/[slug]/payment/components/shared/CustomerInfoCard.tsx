"use client";

import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import MicroLabel from "@/components/ui/MicroLabel";

/**
 * Read-only recap of the contact details captured on the credentials step,
 * shown above the payment-method picker so the buyer can verify them before
 * paying. Reads the booking draft — the payment step never re-asks for them.
 */
export default function CustomerInfoCard() {
  const { translate } = useLocale();
  const { contactName, contactEmail, contactPhone, contactCountryCode } = useBooking();

  const rows = [
    { label: translate("booking.credentials.full_name"), value: contactName },
    { label: translate("booking.credentials.email"), value: contactEmail },
    {
      label: translate("booking.credentials.phone"),
      value: contactPhone ? `${contactCountryCode} ${contactPhone}`.trim() : "",
    },
  ];

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
      <MicroLabel className="text-(--color-gold)">
        {translate("booking.payment.customer_info")}
      </MicroLabel>
      <dl className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <dt className="shrink-0 text-xs font-semibold text-(--color-text-muted)">
              {row.label}
            </dt>
            <dd className="min-w-0 truncate text-sm font-medium text-(--color-text-primary)">
              {row.value || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
