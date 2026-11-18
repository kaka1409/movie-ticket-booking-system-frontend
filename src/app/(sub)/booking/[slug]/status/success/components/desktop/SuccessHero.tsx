"use client";

import { Check } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { useLocale } from "@/contexts/LocaleContext";
import Reveal from "@/components/ui/Reveal";

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
      <Reveal variant="scale" className="relative flex shrink-0 items-center justify-center">
        <div
          className={`absolute h-24 w-24 rounded-full bg-emerald-500/10 ${mounted ? "animate-ping" : ""}`}
          style={{ animationDuration: "2s", animationIterationCount: 1 }}
        />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 shadow-[0_0_32px_rgba(34,197,94,0.4)]">
          <Check size={36} className="text-white" strokeWidth={2.5} />
        </div>
      </Reveal>

      <Reveal delay={200}>
        <h1 className="text-3xl leading-tight font-extrabold text-(--color-text-primary)">
          {translate("booking.status.success.title")}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-(--color-text-muted)">
          {translate("booking.status.success.message")}
        </p>
      </Reveal>
    </section>
  );
}
