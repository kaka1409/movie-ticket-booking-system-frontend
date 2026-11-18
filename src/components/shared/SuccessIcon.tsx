"use client";

import { Check } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { useLocale } from "@/contexts/LocaleContext";
import Reveal from "@/components/ui/Reveal";

export default function SuccessIcon({
  titleKey,
  messageKey,
}: {
  titleKey: string;
  messageKey: string;
}) {
  const mounted = useMounted();
  const { translate } = useLocale();

  return (
    <section className="flex flex-col items-center text-center px-6 gap-4">
      <Reveal variant="scale" className="flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div
            className={`absolute w-24 h-24 rounded-full bg-emerald-500/10 ${
              mounted ? "animate-ping" : ""
            }`}
            style={{ animationDuration: "2s", animationIterationCount: 1 }}
          />
          <div className="relative w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center shadow-[0_0_32px_rgba(34,197,94,0.4)]">
            <Check size={36} className="text-white" strokeWidth={2.5} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <h1 className="font-extrabold text-3xl text-white leading-tight mb-2">
          {translate(titleKey)}
        </h1>
        <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
          {translate(messageKey)}
        </p>
      </Reveal>
    </section>
  );
}
