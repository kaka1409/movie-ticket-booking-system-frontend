"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import type { PaymentMethod } from "@/types";
import { usePayment } from "./PaymentContext";

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "vnpay",
    name: "VNPAY",
    description: "Bank Transfer",
    imageSrc: "/images/VNPay.png",
  },
  {
    id: "momo",
    name: "MoMo E-Wallet",
    description: "Fast & Secure",
    imageSrc: "/images/momo.png",
  },
];

export { PAYMENT_METHODS };

export default function PaymentOption({ method }: { method: PaymentMethod }) {
  const { selectedMethod, setSelectedMethod } = usePayment();
  const selected = selectedMethod === method.id;
  const { imageSrc } = method;

  return (
    <button
      onClick={() => setSelectedMethod(method.id)}
      aria-pressed={selected}
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all duration-150 active:scale-[0.99] text-left ${
        selected
          ? "bg-(--color-surface) border-(--color-gold) shadow-[0_0_0_1px_rgba(255,204,77,0.12)]"
          : "bg-(--color-surface) border-(--color-border) hover:border-(--color-gold)/30"
      }`}
    >
      <div
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
          selected
            ? "border-(--color-gold) bg-(--color-gold)"
            : "border-(--color-text-muted) bg-transparent"
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-[#0F0F0F]" />}
      </div>

      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-(--color-surface-2) overflow-hidden">
        <Image
          src={imageSrc}
          alt={method.name}
          width={28}
          height={28}
          className="object-contain"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-bold text-sm ${
              selected
                ? "text-(--color-text-primary)"
                : "text-(--color-text-secondary)"
            }`}
          >
            {method.name}
          </span>
        </div>
        <p className="text-xs text-(--color-text-muted) mt-0.5">
          {method.description}
        </p>
      </div>

      {selected && (
        <CheckCircle2
          size={18}
          className="text-(--color-gold) flex-shrink-0"
        />
      )}
    </button>
  );
}
