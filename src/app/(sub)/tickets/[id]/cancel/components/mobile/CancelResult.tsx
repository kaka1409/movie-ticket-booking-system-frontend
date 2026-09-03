"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, AlertCircle, Home, HeadphonesIcon } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";

export default function CancelResult({
  status,
  refundAmount,
  paymentMethod,
  onRetry,
}: {
  status: "success" | "failed";
  refundAmount: number;
  paymentMethod: string;
  onRetry?: () => void;
}) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { translate } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (status === "success") {
    return (
      <main className="flex-1 overflow-y-auto pb-8 pt-4 px-4 space-y-6">
        {/* Success icon */}
        <section className="flex flex-col items-center text-center gap-4">
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
                style={{
                  animationDuration: "2s",
                  animationIterationCount: 1,
                }}
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
            <h1 className="font-extrabold text-3xl text-(--color-text-primary) leading-tight mb-2">
              {translate("tickets.cancel.success_title")}
            </h1>
            <p className="text-sm text-(--color-text-muted) leading-relaxed max-w-xs mx-auto">
              {translate("tickets.cancel.success_message")}
            </p>
          </div>
        </section>

        {/* Refund info card */}
        <div
          className={`rounded-2xl bg-(--color-surface) border border-(--color-border) p-5 space-y-4 transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-center space-y-1">
            <p className="text-xs text-(--color-text-muted) uppercase tracking-wider font-bold">
              {translate("tickets.cancel.refund_amount")}
            </p>
            <p className="text-3xl font-extrabold text-(--color-gold)">
              {formatVND(refundAmount)}
            </p>
          </div>

          <div className="border-t border-(--color-border) pt-4 space-y-2">
            <p className="text-[9px] font-black tracking-[0.16em] uppercase text-(--color-text-muted)">
              {translate("tickets.cancel.success_refund_to")}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-(--color-surface-2) flex items-center justify-center">
                <span className="text-xs font-bold text-(--color-text-muted)">
                  {paymentMethod?.includes("VNPay")
                    ? "VNP"
                    : paymentMethod?.includes("MoMo")
                      ? "MM"
                      : "—"}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-(--color-text-primary)">
                  {paymentMethod ?? "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {translate("tickets.cancel.success_processing")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div
          className={`space-y-3 transition-all duration-700 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              router.replace(`/tickets/${id}`);
              router.refresh();
            }}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)] active:scale-[0.98] transition-all duration-150"
          >
            {translate("tickets.cancel.success_view_ticket")}
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase border border-(--color-gold) text-(--color-gold) bg-transparent active:scale-[0.98] transition-all duration-150"
          >
            <Home size={17} />
            {translate("tickets.cancel.success_back_home")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto pb-8 pt-4 px-4 space-y-6">
      {/* Failed icon */}
      <section className="flex flex-col items-center text-center gap-4">
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
                mounted
                  ? "animate-[shake_0.5s_ease-in-out_0.3s]"
                  : ""
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
          <h1 className="font-extrabold text-3xl text-(--color-text-primary) leading-tight mb-2">
            {translate("tickets.cancel.failed_title")}
          </h1>
          <p className="text-sm text-(--color-text-muted) leading-relaxed max-w-xs mx-auto">
            {translate("tickets.cancel.failed_message")}
          </p>
        </div>
      </section>

      {/* Failed info card */}
      <div
        className={`rounded-2xl bg-(--color-surface) border border-red-500/20 p-5 space-y-4 transition-all duration-700 delay-300 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="text-center space-y-1">
          <p className="text-xs text-(--color-text-muted) uppercase tracking-wider font-bold">
            {translate("tickets.cancel.failed_refund_amount")}
          </p>
          <p className="text-3xl font-extrabold text-(--color-gold)">
            {formatVND(refundAmount)}
          </p>
        </div>

        <div className="border-t border-(--color-border) pt-4 space-y-2">
          <p className="text-[9px] font-black tracking-[0.16em] uppercase text-(--color-text-muted)">
            {translate("tickets.cancel.failed_status")}
          </p>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle size={10} />
            {translate("tickets.cancel.failed_status")}
          </span>
        </div>

        <p className="text-xs text-(--color-text-muted) leading-relaxed">
          {translate("tickets.cancel.failed_retry_text")}
        </p>
      </div>

      {/* Actions */}
      <div
        className={`space-y-3 transition-all duration-700 delay-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <button
          type="button"
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase bg-(--color-gold) text-[#0F0F0F] shadow-[--shadow-glow] active:scale-[0.98] transition-all duration-150"
        >
          {translate("tickets.cancel.failed_retry")}
        </button>

        <button
          type="button"
          onClick={() => router.push("/help")}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase border border-(--color-border) text-(--color-text-secondary) bg-transparent active:scale-[0.98] transition-all duration-150"
        >
          <HeadphonesIcon size={17} />
          {translate("tickets.cancel.failed_contact_support")}
        </button>
      </div>
    </main>
  );
}
