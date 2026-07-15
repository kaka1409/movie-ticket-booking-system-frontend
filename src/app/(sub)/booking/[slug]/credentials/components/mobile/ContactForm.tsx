"use client";

import { useState, useCallback } from "react";
import { User, Mail } from "lucide-react";
import { useCredentials } from "./CredentialsContext";
import FieldLabel from "./FieldLabel";
import TextInput from "./TextInput";
import PhoneField from "./PhoneField";

function validateFields(name: string, email: string, phone: string) {
  const errors: { name?: string; email?: string; phone?: string } = {};
  if (!name.trim()) errors.name = "Full name is required.";
  if (!email.trim()) errors.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!phone.trim()) errors.phone = "Phone number is required.";
  else if (phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a valid phone number.";
  return errors;
}

export default function ContactForm() {
  const { setIsValid } = useCredentials();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+84");
  const [touched, setTouched] = useState(false);

  const errors = validateFields(name, email, phone);
  const isValid = Object.keys(errors).length === 0;
  const showErrors = touched && !isValid;

  const handleChange = useCallback(() => {
    if (touched) {
      const updatedErrors = validateFields(name, email, phone);
      setIsValid(Object.keys(updatedErrors).length === 0);
    }
  }, [touched, name, email, phone, setIsValid]);

  return (
    <section className="px-4 space-y-4">
      <h2 className="font-bold text-xl text-(--color-text-primary)">Your Details</h2>

      <div>
        <FieldLabel>Full Name</FieldLabel>
        <TextInput
          id="full-name"
          value={name}
          onChange={(v) => { setName(v); handleChange(); }}
          placeholder="John Doe"
          icon={User}
          autoComplete="name"
          error={showErrors ? errors.name : undefined}
        />
      </div>

      <div>
        <FieldLabel>Email Address</FieldLabel>
        <TextInput
          id="email"
          type="email"
          value={email}
          onChange={(v) => { setEmail(v); handleChange(); }}
          placeholder="john.doe@example.com"
          icon={Mail}
          autoComplete="email"
          inputMode="email"
          error={showErrors ? errors.email : undefined}
        />
      </div>

      <div>
        <FieldLabel>Phone Number</FieldLabel>
        <PhoneField
          countryCode={countryCode}
          onCountryChange={setCountryCode}
          phone={phone}
          onPhoneChange={(v) => { setPhone(v); handleChange(); }}
          error={showErrors ? errors.phone : undefined}
        />
      </div>

      <p className="text-[11px] text-(--color-text-muted) leading-relaxed">
        Your e-ticket will be sent to the email address above. We&apos;ll only use your phone number to contact you about this booking.
      </p>
    </section>
  );
}
