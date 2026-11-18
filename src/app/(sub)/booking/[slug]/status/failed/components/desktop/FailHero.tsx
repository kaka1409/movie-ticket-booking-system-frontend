"use client";

import { AlertCircle } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { useLocale } from "@/contexts/LocaleContext";
import { failReasonMessageKey } from "@/features/booking/utils/paymentFailure";
import Reveal from "@/components/ui/Reveal";

/**
 * Desktop failure hero — red mark beside the copy, and the reason spelled out
 * on one wide line instead of the mobile centred `max-w-xs` paragraph.
 */
export default function FailHero({ reason }: { reason: string | null }) {
  const mounted = useMounted();
  const { translate } = useLocale();

  return (
    <section className="flex items-center gap-6">
      <Reveal variant="scale" duration={500} className="flex shrink-0 items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full bg-red-500/8" />
          <div className="absolute h-20 w-20 rounded-full bg-red-500/12" />
          <div
            className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 shadow-[0_0_28px_rgba(239,68,68,0.2)] ${
              mounted ? "animate-[shake_0.5s_ease-in-out_0.3s]" : ""
            }`}
          >
            <AlertCircle size={34} className="text-red-400" strokeWidth={2} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <h1 className="text-3xl leading-tight font-extrabold text-(--color-text-primary)">
          {translate("booking.status.failed.title")}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-(--color-text-muted)">
          {translate(failReasonMessageKey(reason))}
        </p>
      </Reveal>
    </section>
  );
}
