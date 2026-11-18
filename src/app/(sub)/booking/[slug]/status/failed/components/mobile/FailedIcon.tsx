"use client";

import { AlertCircle } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { useLocale } from "@/contexts/LocaleContext";
import { failReasonMessageKey } from "@/features/booking/utils/paymentFailure";
import Reveal from "@/components/ui/Reveal";

export default function FailedIcon({ reason }: { reason: string | null }) {
  const mounted = useMounted();
  const { translate } = useLocale();

  return (
    <section className="flex flex-col items-center text-center px-6 gap-4">
      <Reveal variant="scale" duration={500} className="flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-red-500/8" />
          <div className="absolute w-20 h-20 rounded-full bg-red-500/12" />
          <div
            className={`relative w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center shadow-[0_0_28px_rgba(239,68,68,0.2)] ${
              mounted ? "animate-[shake_0.5s_ease-in-out_0.3s]" : ""
            }`}
          >
            <AlertCircle size={34} className="text-red-400" strokeWidth={2} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <h1 className="font-extrabold text-3xl text-white leading-tight mb-2">
          {translate("booking.status.failed.title")}
        </h1>
        <FailReason reason={reason} />
      </Reveal>
    </section>
  );
}

function FailReason({ reason }: { reason: string | null }) {
  const { translate } = useLocale();

  return (
    <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
      {translate(failReasonMessageKey(reason))}
    </p>
  );
}
