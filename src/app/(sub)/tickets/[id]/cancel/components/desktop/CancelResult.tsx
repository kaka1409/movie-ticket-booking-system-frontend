"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, Check, HeadphonesIcon, Home } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import Button from "@/components/ui/Button";
import MicroLabel from "@/components/ui/MicroLabel";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

/**
 * Desktop cancel outcome. One centred card for both endings — the refund and its
 * destination on success, the backend's refusal reason on failure — because
 * nothing else on the page is worth showing once the ticket is gone.
 */
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
  onRetry: () => void;
}) {
  const router = useRouter();
  const { ticket } = useTicketDetail();
  const { translate, locale } = useLocale();
  const isSuccess = status === "success";

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-16 lg:px-8">
      <section className="flex flex-col items-center gap-5 text-center">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full ${
            isSuccess
              ? "bg-emerald-600 shadow-[0_0_32px_rgba(34,197,94,0.4)]"
              : "bg-red-500/20 shadow-[0_0_28px_rgba(239,68,68,0.2)]"
          }`}
        >
          {isSuccess ? (
            <Check size={36} className="text-white" strokeWidth={2.5} />
          ) : (
            <AlertCircle size={34} className="text-red-400" strokeWidth={2} />
          )}
        </div>

        <div>
          <h1 className="text-3xl leading-tight font-extrabold text-(--color-text-primary)">
            {isSuccess
              ? translate("tickets.cancel.success_title")
              : translate("tickets.cancel.error.title")}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-(--color-text-muted)">
            {isSuccess
              ? translate("tickets.cancel.success_message")
              : (errorMessage ?? translate("tickets.cancel.error.fallback"))}
          </p>
        </div>
      </section>

      {isSuccess && (
        <div className="mt-8 space-y-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 text-center">
          <div className="space-y-1">
            <MicroLabel className="text-(--color-text-muted)">
              {translate("tickets.cancel.refund_amount")}
            </MicroLabel>
            <p className="text-3xl font-extrabold text-(--color-gold)">
              {formatVND(refundAmount, locale)}
            </p>
          </div>

          <div className="space-y-1.5 border-t border-(--color-border) pt-4">
            <MicroLabel className="text-(--color-text-muted)">
              {translate("tickets.cancel.success_refund_to")}
            </MicroLabel>
            <p className="text-sm font-bold text-(--color-text-primary)">
              {paymentMethod || "N/A"}
            </p>
          </div>

          <span className="inline-block rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-amber-400 uppercase">
            {translate("tickets.cancel.success_processing")}
          </span>
        </div>
      )}

      <div className="mt-8 space-y-3">
        {isSuccess ? (
          <>
            <Button
              onClick={() => {
                router.replace(`/tickets/${ticket.id}`);
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
          </>
        ) : (
          <>
            <Button onClick={onRetry}>{translate("tickets.cancel.failed_retry")}</Button>
            <Button
              variant="loadMore"
              icon={HeadphonesIcon}
              iconPosition="left"
              onClick={() => router.push("/help")}
            >
              {translate("tickets.cancel.failed_contact_support")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
