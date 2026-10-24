"use client";

import { useParams, useRouter } from "next/navigation";
import { Check, AlertCircle, Home, HeadphonesIcon, Wallet } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import { useMounted } from "@/hooks/useMounted";
import Button from "@/components/ui/Button";
import MicroLabel from "@/components/ui/MicroLabel";

export default function CancelResult({
  status,
  refundAmount,
  paymentMethod,
  errorMessage,
  onRetry,
}: {
  status: "success" | "failed";
  refundAmount: number;
  paymentMethod: string;
  /** Backend reason when the cancel was refused; `null` when it went through. */
  errorMessage: string | null;
  onRetry?: () => void;
}) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { translate, locale } = useLocale();
  const mounted = useMounted();

  if (status === "success") {
    return (
      <main className="flex-1 overflow-y-auto pb-8 pt-4 px-4 space-y-6">
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
              {formatVND(refundAmount, locale)}
            </p>
          </div>

          <div className="border-t border-(--color-border) pt-4 space-y-2">
            <MicroLabel className="text-(--color-text-muted)">
              {translate("tickets.cancel.success_refund_to")}
            </MicroLabel>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-(--color-surface-2) flex items-center justify-center">
                {/* The refund goes back to whatever wallet paid, so no brand
                    branch is possible here — ids are opaque wire values. */}
                <Wallet size={16} className="text-(--color-text-muted)" />
              </div>
              <div>
                <p className="text-sm font-bold text-(--color-text-primary)">
                  {paymentMethod || "N/A"}
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

        <div
          className={`space-y-3 transition-all duration-700 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button
            onClick={() => {
              router.replace(`/tickets/${id}`);
              router.refresh();
            }}
          >
            {translate("tickets.cancel.success_view_ticket")}
          </Button>

          <Button
            variant="outline"
            icon={Home}
            iconPosition="left"
            onClick={() => router.push("/")}
          >
            {translate("tickets.cancel.success_back_home")}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto pb-8 pt-4 px-4 space-y-6">
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
          <h1 className="font-extrabold text-3xl text-(--color-text-primary) leading-tight mb-2">
            {translate("tickets.cancel.error.title")}
          </h1>
          <p className="text-sm text-(--color-text-muted) leading-relaxed max-w-xs mx-auto">
            {errorMessage ?? translate("tickets.cancel.error.fallback")}
          </p>
        </div>
      </section>

      <div
        className={`space-y-3 transition-all duration-700 delay-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Button onClick={onRetry}>{translate("tickets.cancel.failed_retry")}</Button>

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
