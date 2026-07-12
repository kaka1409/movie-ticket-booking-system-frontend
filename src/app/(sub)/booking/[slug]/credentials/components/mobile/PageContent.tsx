"use client";

import { useState } from "react";
import { User, Mail } from "lucide-react";
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";
import FieldLabel from "./FieldLabel";
import TextInput from "./TextInput";
import PhoneField from "./PhoneField";
import OrderSummary from "./OrderSummary";
import BottomBar from "./BottomBar";

function validate(name: string, email: string, phone: string) {
  const errors: { name?: string; email?: string; phone?: string } = {};
  if (!name.trim()) errors.name = "Full name is required.";
  if (!email.trim()) errors.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!phone.trim()) errors.phone = "Phone number is required.";
  else if (phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a valid phone number.";
  return errors;
}

export default function PageContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+84");
  const [touched, setTouched] = useState(false);

  const errors = validate(name, email, phone);
  const isValid = Object.keys(errors).length === 0;
  const showErrors = touched && !isValid;

  const handleContinue = () => {
    if (!isValid) setTouched(true);
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <StepBar current={4} />

      <main className="flex-1 overflow-y-auto pb-5 pt-1 space-y-6">
        <CountdownBanner />

        <section className="px-4 space-y-4">
          <h2 className="font-bold text-xl text-(--color-text-primary)">Your Details</h2>

          <div>
            <FieldLabel>Full Name</FieldLabel>
            <TextInput
              id="full-name"
              value={name}
              onChange={setName}
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
              onChange={setEmail}
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
              onPhoneChange={setPhone}
              error={showErrors ? errors.phone : undefined}
            />
          </div>

          <p className="text-[11px] text-(--color-text-muted) leading-relaxed">
            Your e-ticket will be sent to the email address above. We&apos;ll only use your phone number to contact you about this booking.
          </p>
        </section>

        <OrderSummary />
      </main>

      <div onClick={handleContinue}>
        <BottomBar canContinue={isValid} />
      </div>
    </div>
  );
}
