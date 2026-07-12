"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, ChevronDown, AlertCircle } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+84", label: "VN", flag: "vn" },
  { code: "+1", label: "US", flag: "us" },
  { code: "+44", label: "UK", flag: "gb" },
  { code: "+61", label: "AU", flag: "au" },
  { code: "+81", label: "JP", flag: "jp" },
  { code: "+65", label: "SG", flag: "sg" },
];

export default function PhoneField({
  countryCode,
  onCountryChange,
  phone,
  onPhoneChange,
  error,
}: {
  countryCode: string;
  onCountryChange: (v: string) => void;
  phone: string;
  onPhoneChange: (v: string) => void;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const selected = COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0];

  return (
    <div>
      <div className="flex gap-2">
        <div
          className={`relative flex items-center gap-1.5 px-3 py-3.5 rounded-2xl bg-(--color-surface) border transition-all duration-150 flex-shrink-0 cursor-pointer ${
            error ? "border-red-500/70" : "border-(--color-border)"
          }`}
        >
          <select
            value={countryCode}
            onChange={(e) => onCountryChange(e.target.value)}
            aria-label="Country code"
            className="absolute inset-0 opacity-0 w-full text-black text-center cursor-pointer"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} {c.label}
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
          <ChevronDown size={14} className="text-(--color-text-muted) pointer-events-none" />
        </div>

        <div
          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl flex-1 bg-(--color-surface) border transition-all duration-150 ${
            error ? "border-red-500/70" : focused ? "border-(--color-gold)/60" : "border-(--color-border)"
          }`}
        >
          <Phone
            size={17}
            className={`flex-shrink-0 transition-colors duration-150 ${
              error ? "text-red-400" : focused ? "text-(--color-gold)" : "text-(--color-text-muted)"
            }`}
          />
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(555) 123-4567"
            value={phone}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="flex-1 bg-transparent text-sm text-(--color-text-primary) placeholder-(--color-text-muted) outline-none font-[inherit]"
          />
        </div>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}
