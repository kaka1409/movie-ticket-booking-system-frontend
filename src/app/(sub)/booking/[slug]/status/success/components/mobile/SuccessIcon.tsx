"use client";

import { Check } from "lucide-react";
import { useStatus } from "@/features/booking/contexts/StatusContext";
import { useLocale } from "@/contexts/LocaleContext";

export default function SuccessIcon() {
  const { mounted } = useStatus();
  const { translate } = useLocale();

  return (
    <section className="flex flex-col items-center text-center px-6 gap-4">
      <div
        className={`flex items-center justify-center transition-all duration-700 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
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
      </div>

      <div
        className={`transition-all duration-700 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="font-extrabold text-3xl text-white leading-tight mb-2">
          {translate("booking.status.success.title")}
        </h1>
        <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
          {translate("booking.status.success.message")}
        </p>
      </div>
    </section>
  );
}
