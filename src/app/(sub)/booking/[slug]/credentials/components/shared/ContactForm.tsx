"use client";

import { User, Mail, FileText, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useContactDraft } from "@/features/booking/hooks/useContactDraft";
import { Skeleton } from "@/components/ui/Skeleton";
import InputField from "@/components/ui/InputField";
import PhoneField from "./PhoneField";

/**
 * Gates the form on the session-restore call so the account prefill runs with a
 * resolved `user` — initializing the fields inline used to leave them empty on a
 * hard refresh, because AuthContext resolves asynchronously.
 */
export default function ContactForm({ className = "px-4 space-y-4", showPrivacy = false }: { className?: string; showPrivacy?: boolean }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <section className={`${className}`} aria-busy="true">
        <Skeleton className="h-7 w-40 rounded-md" />
        <Skeleton className="h-13 w-full rounded-2xl" />
        <Skeleton className="h-13 w-full rounded-2xl" />
        <Skeleton className="h-13 w-full rounded-2xl" />
      </section>
    );
  }

  return <ContactFields className={className} showPrivacy={showPrivacy} />;
}

function ContactFields({ className, showPrivacy }: { className: string; showPrivacy?: boolean }) {
  const { translate } = useLocale();
  const { name, email, phone, countryCode, errors, setField, setCountryCode } = useContactDraft();

  return (
    <section className={className}>
      <h2 className="font-bold text-xl text-(--color-text-primary)">
        {translate("booking.credentials.your_details")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="full-name"
            className="block text-2xs font-bold tracking-[0.16em] uppercase text-(--color-text-muted) mb-1.5"
          >
            {translate("booking.credentials.full_name")}
          </label>
          <InputField
            id="full-name"
            value={name}
            maxLength={100}
            onChange={(value) => setField("name", value)}
            placeholder={translate("booking.credentials.name_placeholder")}
            icon={User}
            autoComplete="name"
            error={errors.name}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-2xs font-bold tracking-[0.16em] uppercase text-(--color-text-muted) mb-1.5"
          >
            {translate("booking.credentials.email")}
          </label>
          <InputField
            id="email"
            type="email"
            value={email}
            maxLength={254}
            onChange={(value) => setField("email", value)}
            placeholder={translate("booking.credentials.email_placeholder")}
            icon={Mail}
            autoComplete="email"
            inputMode="email"
            error={errors.email}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-2xs font-bold tracking-[0.16em] uppercase text-(--color-text-muted) mb-1.5"
        >
          {translate("booking.credentials.phone")}
        </label>
        <PhoneField
          countryCode={countryCode}
          onCountryChange={setCountryCode}
          phone={phone}
          onPhoneChange={(value) => setField("phone", value)}
          error={errors.phone}
        />
      </div>

      {showPrivacy && (
        <div className="rounded-xl border border-(--color-border) bg-(--color-surface-2) p-4">
          <div className="flex items-start gap-3">
            <FileText size={20} className="text-(--color-gold) shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-(--color-text-primary) mb-2">
                {translate("booking.credentials.privacy_title")}
              </h3>
              <p className="text-xs text-(--color-text-muted) leading-relaxed mb-3">
                {translate("booking.credentials.privacy_desc")}
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Check size={14} className="text-(--color-gold) shrink-0 mt-0.5" />
                  <span className="text-xs text-(--color-text-secondary)">
                    {translate("booking.credentials.privacy_point_1")}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={14} className="text-(--color-gold) shrink-0 mt-0.5" />
                  <span className="text-xs text-(--color-text-secondary)">
                    {translate("booking.credentials.privacy_point_2")}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={14} className="text-(--color-gold) shrink-0 mt-0.5" />
                  <span className="text-xs text-(--color-text-secondary)">
                    {translate("booking.credentials.privacy_point_3")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-[11px] text-(--color-text-muted) leading-relaxed">
        {translate("booking.credentials.email_notice")}
      </p>
    </section>
  );
}
