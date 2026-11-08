"use client";

import Image from "next/image";
import { Phone, ChevronDown, AlertCircle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const COUNTRY_CODES = [
  { code: "+84", label: "VN", flag: "vn" },
  { code: "+1", label: "US", flag: "us" },
  { code: "+44", label: "UK", flag: "gb" },
  { code: "+61", label: "AU", flag: "au" },
  { code: "+81", label: "JP", flag: "jp" },
  { code: "+65", label: "SG", flag: "sg" },
];

export default function PhoneField({
  id = "phone",
  countryCode,
  onCountryChange,
  phone,
  onPhoneChange,
  error,
}: {
  id?: string;
  countryCode: string;
  onCountryChange: (v: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  error?: string;
}) {
  const selected =
    COUNTRY_CODES.find((country) => country.code === countryCode) ?? COUNTRY_CODES[0];
  const { translate } = useLocale();

  return (
    <div>
      <div
        className={`group flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-xl bg-(--color-surface) border transition-colors duration-150 ${
          error
            ? "border-red-500/80 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
            : "border-(--color-border-strong) hover:border-(--color-gold)/50 focus-within:border-(--color-gold) focus-within:ring-2 focus-within:ring-(--color-gold)/20"
        }`}
      >
        <div className="relative flex items-center gap-1.5 flex-shrink-0 cursor-pointer">
          <select
            name="countryCode"
            value={countryCode}
            onChange={(event) => onCountryChange(event.target.value)}
            aria-label={translate("booking.credentials.country_code")}
            className="absolute inset-0 opacity-0 w-full text-black text-center cursor-pointer"
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code} {country.label}
              </option>
            ))}
          </select>
          <Image
            src={`https://flagcdn.com/w20/${selected.flag}.png`}
            alt={selected.label}
            width={20}
            height={14}
            unoptimized
          />
          <span className="text-sm font-semibold text-(--color-text-primary) pointer-events-none">
            {countryCode}
          </span>
          <ChevronDown size={14} className="text-(--color-text-muted) pointer-events-none group-focus-within:text-(--color-gold) transition-colors duration-150" />
        </div>

        <div className="h-6 w-px bg-(--color-border)" />

        <Phone
          size={18}
          className={`flex-shrink-0 transition-colors duration-150 h-4.5 w-4.5 ${
            error ? "text-red-400" : "text-(--color-text-muted) group-focus-within:text-(--color-gold)"
          }`}
        />
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={15}
          aria-invalid={error ? true : undefined}
          placeholder={translate("booking.credentials.phone_placeholder")}
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value.replace(/\D/g, ""))}
          className="flex-1 min-w-0 bg-transparent text-sm text-(--color-text-primary) placeholder-(--color-text-muted) outline-none font-[inherit]"
        />
      </div>
      {error && (
        <p className="flex items-center gap-1.5 mt-1.5 px-1 text-xs text-red-400">
          <AlertCircle size={12} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
