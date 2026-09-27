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

export function formatVND(amount: number): string {
  return `${amount.toLocaleString("vi-VN")}₫`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(isoDate: string, locale: "en" | "vn"): string {
  const timestamp = Date.parse(isoDate);
  if (Number.isNaN(timestamp)) return "";

  const rtf = new Intl.RelativeTimeFormat(locale === "vn" ? "vi" : "en", {
    numeric: "auto",
  });
  const diff = timestamp - Date.now();
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000000],
    ["month", 2592000000],
    ["week", 604800000],
    ["day", 86400000],
    ["hour", 3600000],
    ["minute", 60000],
  ];

  for (const [unit, ms] of units) {
    if (Math.abs(diff) >= ms) {
      return rtf.format(Math.round(diff / ms), unit);
    }
  }

  return rtf.format(0, "minute");
}
