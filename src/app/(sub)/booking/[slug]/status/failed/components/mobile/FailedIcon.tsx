"use client";

import { AlertCircle } from "lucide-react";

export default function FailedIcon({ visible }: { visible: boolean }) {
  return (
    <div
      className={`flex items-center justify-center transition-all duration-500 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-50"
      }`}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full bg-red-500/8" />
        <div className="absolute w-20 h-20 rounded-full bg-red-500/12" />
        <div
          className={`relative w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center shadow-[0_0_28px_rgba(239,68,68,0.2)] ${
            visible ? "animate-[shake_0.5s_ease-in-out_0.3s]" : ""
          }`}
        >
          <AlertCircle size={34} className="text-red-400" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
