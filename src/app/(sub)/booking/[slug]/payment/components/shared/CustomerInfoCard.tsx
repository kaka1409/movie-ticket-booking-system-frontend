"use client";

import { User, Mail, Smartphone, Lock } from "lucide-react";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import InputField from "@/components/ui/InputField";

const LOCK_SLOT = <Lock size={14} className="text-(--color-text-muted)" />;

/**
 * Read-only recap of the contact details captured on the credentials step,
 * rendered as disabled form fields — the same container and field language as
 * `ContactForm`, so the buyer verifies them in place before paying.
 */
export default function CustomerInfoCard() {
  const { translate } = useLocale();
  const { contactName, contactEmail, contactPhone, contactCountryCode } = useBooking();

  return (
    <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
      <h2 className="font-bold text-xl text-(--color-text-primary)">
        {translate("booking.credentials.your_details")}
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="payment-full-name"
            className="mb-1.5 block text-2xs font-bold tracking-[0.16em] text-(--color-text-muted) uppercase"
          >
            {translate("booking.credentials.full_name")}
          </label>
          <InputField
            id="payment-full-name"
            value={contactName}
            onChange={() => {}}
            placeholder="—"
            icon={User}
            disabled
            rightSlot={LOCK_SLOT}
          />
        </div>

        <div>
          <label
            htmlFor="payment-email"
            className="mb-1.5 block text-2xs font-bold tracking-[0.16em] text-(--color-text-muted) uppercase"
          >
            {translate("booking.credentials.email")}
          </label>
          <InputField
            id="payment-email"
            type="email"
            value={contactEmail}
            onChange={() => {}}
            placeholder="—"
            icon={Mail}
            disabled
            rightSlot={LOCK_SLOT}
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="payment-phone"
          className="mb-1.5 block text-2xs font-bold tracking-[0.16em] text-(--color-text-muted) uppercase"
        >
          {translate("booking.credentials.phone")}
        </label>
        <InputField
          id="payment-phone"
          type="tel"
          value={contactPhone ? `${contactCountryCode} ${contactPhone}`.trim() : ""}
          onChange={() => {}}
          placeholder="—"
          icon={Smartphone}
          disabled
          rightSlot={LOCK_SLOT}
        />
      </div>
    </section>
  );
}
