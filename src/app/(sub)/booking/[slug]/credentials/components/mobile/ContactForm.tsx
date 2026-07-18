"use client";

import { useState, useEffect } from "react";
import { User, Mail } from "lucide-react";
import { useCredentials } from "@/features/booking/contexts/CredentialsContext";
import { useLocale } from "@/contexts/LocaleContext";
import FieldLabel from "./FieldLabel";
import TextInput from "./TextInput";
import PhoneField from "./PhoneField";

function validateFields(name: string, email: string, phone: string, translate: (key: string) => string) {
  const errors: { name?: string; email?: string; phone?: string } = {};
  if (!name.trim()) errors.name = translate("booking.credentials.error_name_required");
  if (!email.trim()) errors.email = translate("booking.credentials.error_email_required");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = translate("booking.credentials.error_email_invalid");
  if (!phone.trim()) errors.phone = translate("booking.credentials.error_phone_required");
  else if (phone.replace(/\D/g, "").length < 7) errors.phone = translate("booking.credentials.error_phone_invalid");
  return errors;
}

export default function ContactForm() {
  const { setIsValid } = useCredentials();
  const { translate } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+84");
  const [touched, setTouched] = useState(false);

  const errors = validateFields(name, email, phone, translate);
  const isValid = Object.keys(errors).length === 0;
  const showErrors = touched && !isValid;

  useEffect(() => {
    setIsValid(isValid);
  }, [isValid, setIsValid]);

  return (
    <section className="px-4 space-y-4">
      <h2 className="font-bold text-xl text-(--color-text-primary)">{translate("booking.credentials.your_details")}</h2>

      <div>
        <FieldLabel>{translate("booking.credentials.full_name")}</FieldLabel>
        <TextInput
          id="full-name"
          value={name}
          onChange={(v) => { setName(v); setTouched(true); }}
          placeholder={translate("booking.credentials.name_placeholder")}
          icon={User}
          autoComplete="name"
          error={showErrors ? errors.name : undefined}
        />
      </div>

      <div>
        <FieldLabel>{translate("booking.credentials.email")}</FieldLabel>
        <TextInput
          id="email"
          type="email"
          value={email}
          onChange={(v) => { setEmail(v); setTouched(true); }}
          placeholder={translate("booking.credentials.email_placeholder")}
          icon={Mail}
          autoComplete="email"
          inputMode="email"
          error={showErrors ? errors.email : undefined}
        />
      </div>

      <div>
        <FieldLabel>{translate("booking.credentials.phone")}</FieldLabel>
        <PhoneField
          countryCode={countryCode}
          onCountryChange={setCountryCode}
          phone={phone}
          onPhoneChange={(v) => { setPhone(v); setTouched(true); }}
          error={showErrors ? errors.phone : undefined}
        />
      </div>

      <p className="text-[11px] text-(--color-text-muted) leading-relaxed">
        {translate("booking.credentials.email_notice")}
      </p>
    </section>
  );
}
