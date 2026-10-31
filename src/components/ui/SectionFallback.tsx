"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { ErrorResponse } from "@/libs/api";

export default function SectionFallback({ error }: { error?: ErrorResponse["error"] | null }) {
  const { translate } = useLocale();
  const router = useRouter();

  return (
    <section className="mx-(--space-md) rounded-(--radius-sm) border border-(--color-border) bg-(--color-surface) px-(--space-md) py-8 md:mx-auto md:max-w-7xl md:rounded-(--radius-lg) md:px-8 md:py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle size={18} className="text-red-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-(--color-text-primary)">
            {translate("common.error")}
          </p>
          <p className="mt-1 text-xs text-(--color-text-muted)">
            {error?.message ?? translate("error.description")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="
            rounded-(--radius-sm) border border-(--color-gold) px-5 py-2 text-xs font-bold uppercase tracking-widest 
            text-(--color-gold) transition-colors hover:bg-(--color-gold) hover:text-black
          "
        >
          {translate("common.try_again")}
        </button>
      </div>
    </section>
  );
}
