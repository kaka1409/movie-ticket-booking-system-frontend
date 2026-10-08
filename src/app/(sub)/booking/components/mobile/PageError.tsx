import SectionFallback from "@/components/ui/SectionFallback";
import type { ErrorResponse } from "@/libs/api";

/**
 * Full-page fetch-error state shared by the booking step pages —
 * identical markup to the per-page `<div className="min-h-dvh …">` blocks
 * it replaces. Server-safe (no hooks), so `page.tsx` can return it directly.
 */
export default function PageError({ error }: { error: ErrorResponse["error"] | null | undefined }) {
  return (
    <div className="min-h-dvh bg-(--color-bg) py-10">
      <SectionFallback error={error} />
    </div>
  );
}
