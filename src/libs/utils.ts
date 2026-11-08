/** Lowercase, strip Vietnamese diacritics and punctuation, collapse spaces to hyphens. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** BCP-47 tag for `Intl`/`toLocale*` calls — the UI locale is `en` | `vn`. */
export function toLocaleTag(locale: "en" | "vn"): string {
  return locale === "vn" ? "vi-VN" : "en-US";
}

/**
 * Locale-formatted amount with the ₫ suffix (`120,000₫` in EN, `120.000₫`
 * in VN). The suffix stays ₫ in both locales — the amount is always VND.
 */
export function formatVND(amount: number, locale: "en" | "vn"): string {
  return `${amount.toLocaleString(toLocaleTag(locale))}₫`;
}

/** Room names carry a Vietnamese column; English stays the canonical fallback. */
export function getRoomDisplayName(
  room: { name: string; nameVi?: string | null },
  locale: "en" | "vn",
): string {
  return locale === "vn" && room.nameVi ? room.nameVi : room.name;
}


