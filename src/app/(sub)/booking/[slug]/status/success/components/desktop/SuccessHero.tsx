"use client";

import { Check } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Desktop success hero — the icon sits beside the copy instead of the mobile
 * stacked, centred stack, so the page starts on the same left edge as the
 * receipt below it.
 */
export default function SuccessHero() {
  const mounted = useMounted();
  const { translate } = useLocale();

  return (
    <section className="flex items-center gap-6">
      <div
        className={`relative flex shrink-0 items-center justify-center transition-all duration-700 ${
          mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <div
          className={`absolute h-24 w-24 rounded-full bg-emerald-500/10 ${mounted ? "animate-ping" : ""}`}
          style={{ animationDuration: "2s", animationIterationCount: 1 }}
        />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 shadow-[0_0_32px_rgba(34,197,94,0.4)]">
          <Check size={36} className="text-white" strokeWidth={2.5} />
        </div>
      </div>

      <div
        className={`transition-all duration-700 delay-200 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <h1 className="text-3xl leading-tight font-extrabold text-(--color-text-primary)">
          {translate("booking.status.success.title")}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-(--color-text-muted)">
          {translate("booking.status.success.message")}
        </p>
      </div>
    </section>
  );
}
