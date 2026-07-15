"use client";

import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";

interface LanguageToggleProps {
  variant?: "flag" | "text";
}

export default function LanguageToggle({ variant = "flag" }: LanguageToggleProps) {
  const { locale, setLocale } = useLocale();

  if (variant === "text") {
    return (
      <button
        className="text-xs font-semibold tracking-widest px-2 py-1 rounded text-(--color-gold-light) border border-(--color-border)"
        aria-label="Change language"
        onClick={() => setLocale(locale === "en" ? "vn" : "en")}
      >
        {locale === "en" ? "EN" : "VN"}
      </button>
    );
  }

  return (
    <button
      className="flex items-center gap-1.5 text-xs font-semibold tracking-widest px-2 py-1 rounded text-(--color-gold-light) border border-(--color-border)"
      aria-label="Change language"
      onClick={() => setLocale(locale === "en" ? "vn" : "en")}
    >
      <Image
        src={locale === "en" ? "https://flagcdn.com/w20/gb.png" : "https://flagcdn.com/w20/vn.png"}
        alt={locale === "en" ? "English" : "Tiếng Việt"}
        width={16}
        height={12}
        className="w-4 h-3"
      />
      <span>{locale === "en" ? "EN" : "VN"}</span>
    </button>
  );
}
