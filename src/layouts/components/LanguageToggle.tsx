"use client";

import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import { HEADER_PRESS_CLASS, HEADER_TILE_CLASS } from "@/layouts/components/constants";

type LanguageToggleSize = "sm" | "lg";

interface LanguageToggleProps {
  variant?: "flag" | "text";
  /**
   * `lg` is the desktop header cluster tile (36px, pill). `sm` is the compact
   * size the mobile header and the mobile auth screen keep.
   */
  size?: LanguageToggleSize;
}

const FLAG_BUTTON_CLASSES: Record<LanguageToggleSize, string> = {
  sm: "gap-1.5 rounded border border-(--color-border) px-2 py-1 text-xs font-semibold",
  lg: `${HEADER_TILE_CLASS} ${HEADER_PRESS_CLASS} gap-1.5 bg-(--color-surface) px-3 text-[11px] font-bold hover:border-(--color-gold)/40 hover:text-(--color-gold)`,
};

export default function LanguageToggle({ variant = "flag", size = "sm" }: LanguageToggleProps) {
  const { locale, setLocale, translate } = useLocale();
  const isLarge = size === "lg";

  if (variant === "text") {
    return (
      <button
        type="button"
        className="text-xs font-semibold tracking-widest px-2 py-1 rounded text-(--color-gold-light) border border-(--color-border)"
        aria-label={translate("common.change_language")}
        onClick={() => setLocale(locale === "en" ? "vn" : "en")}
      >
        {locale === "en" ? "EN" : "VN"}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`flex items-center tracking-widest text-(--color-gold-light) ${FLAG_BUTTON_CLASSES[size]}`}
      aria-label={translate("common.change_language")}
      onClick={() => setLocale(locale === "en" ? "vn" : "en")}
    >
      <Image
        src={locale === "en" ? "https://flagcdn.com/w20/gb.png" : "https://flagcdn.com/w20/vn.png"}
        alt={locale === "en" ? "English" : "Tiếng Việt"}
        width={isLarge ? 20 : 16}
        height={isLarge ? 14 : 12}
        className={isLarge ? "h-3.5 w-5" : "h-3 w-4"}
      />
      <span>{locale === "en" ? "EN" : "VN"}</span>
    </button>
  );
}
