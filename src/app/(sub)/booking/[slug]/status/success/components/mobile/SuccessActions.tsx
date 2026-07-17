"use client";

import Link from "next/link";
import { Download, Home } from "lucide-react";
import { useStatus } from "@/features/booking/contexts/StatusContext";

export default function SuccessActions() {
  const { mounted } = useStatus();

  return (
    <div
      className={`px-4 space-y-3 pb-4 transition-all duration-700 delay-500 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <button className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-sm tracking-wide bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)] hover:opacity-90 active:scale-[0.98] transition-all duration-150">
        <Download size={18} />
        Download Tickets
      </button>

      <Link
        href="/"
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm text-(--color-text-secondary) bg-(--color-surface) border border-(--color-border) hover:border-(--color-gold)/30 hover:text-(--color-gold) active:scale-[0.98] transition-all duration-150"
      >
        <Home size={17} />
        Back to Home
      </Link>
    </div>
  );
}
