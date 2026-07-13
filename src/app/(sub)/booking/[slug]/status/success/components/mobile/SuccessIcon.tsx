"use client";

import { Check } from "lucide-react";

export default function SuccessIcon({ visible }: { visible: boolean }) {
  return (
    <div
      className={`flex items-center justify-center transition-all duration-700 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-50"
      }`}
    >
      <div className="relative flex items-center justify-center">
        <div
          className={`absolute w-24 h-24 rounded-full bg-emerald-500/10 ${
            visible ? "animate-ping" : ""
          }`}
          style={{ animationDuration: "2s", animationIterationCount: 1 }}
        />
        <div className="relative w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center shadow-[0_0_32px_rgba(34,197,94,0.4)]">
          <Check size={36} className="text-white" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
