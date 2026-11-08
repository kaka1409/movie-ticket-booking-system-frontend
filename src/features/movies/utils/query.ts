import { formatDateOnly } from "@/libs/date";

/** Length bucket labels → inclusive minute bounds. */
const LENGTH_RANGES: Record<string, { min?: number; max?: number }> = {
  "< 90 min": { max: 89 },
  "90-120 min": { min: 90, max: 120 },
  "> 120 min": { min: 121 },
};

export function toDurationRange(length?: string): { min?: number; max?: number } {
  if (!length) return {};
  return LENGTH_RANGES[length] ?? {};
}

/**
 * Release window tokens → inclusive YYYY-MM-DD bounds computed in local time.
 * - "today" → the current calendar day
 * - "week"  → Monday … Sunday of the week containing today
 * - "month" → 1st … last day of the month containing today
 */
export function toReleaseWindow(release?: string): { from: string; to: string } | null {
  if (!release) return null;
  const now = new Date();

  if (release === "today") {
    const iso = formatDateOnly(now);
    return { from: iso, to: iso };
  }

  if (release === "week") {
    const day = now.getDay(); // 0 = Sunday … 6 = Saturday
    const daysSinceMonday = (day + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysSinceMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { from: formatDateOnly(monday), to: formatDateOnly(sunday) };
  }

  if (release === "month") {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: formatDateOnly(first), to: formatDateOnly(last) };
  }

  return null;
}
