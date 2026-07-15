"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { useCredentials } from "./CredentialsContext";

export default function BottomBar() {
  const params = useParams();
  const slug = params.slug as string;
  const { total } = useBooking();
  const { isValid } = useCredentials();

  return (
    <div className="sticky bottom-0 z-50 bg-(--color-bg) border-t border-(--color-border) px-4 pb-6 pt-3">
      <div className="flex items-end justify-between mb-3">
        <p className="text-[9px] font-bold tracking-widest uppercase text-(--color-text-muted)">
          TOTAL
        </p>
        <p className="font-extrabold text-xl text-(--color-gold) tabular-nums">
          {total.toLocaleString("vi-VN")}₫
        </p>
      </div>

      <Link
        href={isValid ? `/booking/${slug}/payment` : "#"}
        aria-disabled={!isValid}
        onClick={(e) => !isValid && e.preventDefault()}
        className={`flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] ${
          isValid
            ? "bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)]"
            : "bg-(--color-surface) text-(--color-text-muted) border border-(--color-border) cursor-not-allowed"
        }`}
      >
        Continue to Payment
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}
