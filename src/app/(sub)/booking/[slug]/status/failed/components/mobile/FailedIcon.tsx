"use client";

import { AlertCircle } from "lucide-react";
import { useStatus } from "../../../components/mobile/StatusContext";

export default function FailedIcon() {
  const { mounted } = useStatus();

  return (
    <section className="flex flex-col items-center text-center px-6 gap-4">
      <div
        className={`flex items-center justify-center transition-all duration-500 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
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
      </div>

      <div
        className={`transition-all duration-700 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="font-extrabold text-3xl text-white leading-tight mb-2">
          Payment Failed
        </h1>
        <FailReason />
      </div>
    </section>
  );
}

function FailReason() {
  const { reason, mounted } = useStatus();

  const REASONS: Record<string, string> = {
    payment_declined: "Your payment was declined by the bank.",
    insufficient_funds: "Insufficient funds in your account.",
    network_error: "A network error occurred. Please try again.",
    expired_card: "Your card has expired. Please use a different card.",
  };

  const message = REASONS[reason ?? ""] ?? "An unexpected error occurred.";

  return (
    <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
      {message}
    </p>
  );
}
