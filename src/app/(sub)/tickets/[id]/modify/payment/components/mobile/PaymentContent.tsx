"use client";

import { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Clock, Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { PAYMENT_METHODS } from "@/features/booking/mock";
import { formatVND } from "@/libs/utils";
import { modifyTicket } from "@/features/tickets/action";
import Image from "next/image";

export default function PaymentContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { translate } = useLocale();
  const { ticket } = useTicketDetail();
  const { token } = useAuth();
  const { modificationType, selectedShowtime, selectedSeats } = useModification();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const showtimeFee = 15000;
  const seatsFee = selectedSeats.length > 0 ? 10000 : 0;

  const showShowtime = modificationType === "showtime" || modificationType === "both";
  const showSeats = modificationType === "seats" || modificationType === "both";

  let difference = 0;
  if (showtimeFee > 0 && showShowtime) difference += showtimeFee;
  if (showSeats && selectedSeats.length > 0) {
    const currentTotal = ticket.seatItems.reduce((sum, s) => sum + s.price, 0);
    const newTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    difference += newTotal - currentTotal;
  }
  difference += seatsFee;

  const canPay = !!selectedMethod && !isPending;

  const handleConfirm = () => {
    if (!canPay) return;

    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 2000));

      const newShowtime = selectedShowtime
        ? {
            date: selectedShowtime.date,
            time: selectedShowtime.time,
            cinema: selectedShowtime.cinemaName,
            room: selectedShowtime.room,
          }
        : undefined;

      const newSeats = selectedSeats.length > 0 ? selectedSeats : undefined;

      await modifyTicket(
        { success: false, error: "" },
        {
          ticketId: id,
          modificationType: modificationType ?? "showtime",
          newShowtime,
          newSeats,
          token: token ?? "",
        },
      );

      const txnId = `TXN${Date.now()}`;
      router.push(`/tickets/${id}/modify/success?transactionId=${txnId}`);
    });
  };

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1 overflow-y-auto pb-5 pt-4 space-y-5">
            {/* Amount to pay */}
            <section className="px-4">
              <div className="p-5 rounded-2xl bg-(--color-surface) border border-(--color-border) text-center">
                <p className="text-[9px] font-black tracking-[0.16em] uppercase text-(--color-text-muted) mb-2">
                  {translate("tickets.modify.payment.pay_difference")}
                </p>
                <p className="font-extrabold text-3xl text-(--color-gold)">
                  {formatVND(difference)}
                </p>
              </div>
            </section>

            {/* Payment methods */}
            <section className="px-4 space-y-3">
              <p className="text-[9px] font-black tracking-[0.16em] uppercase text-(--color-text-muted)">
                {translate("booking.payment.select_method")}
              </p>
              {PAYMENT_METHODS.map((method) => {
                const selected = selectedMethod === method.id;
                return (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
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
                        src={method.imageSrc}
                        alt={method.name}
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm text-(--color-text-primary)">
                        {method.name}
                      </span>
                      <p className="text-xs text-(--color-text-muted) mt-0.5">
                        {method.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </section>

            {/* Refund notice */}
            {difference < 0 && (
              <section className="px-4">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs">
                  <Clock size={14} />
                  {translate("tickets.modify.payment.refund_notice")}
                </div>
              </section>
            )}
          </main>

          {/* Bottom bar */}
          <div className="sticky bottom-0 z-50 bg-(--color-bg) border-t border-(--color-border) px-4 pb-6 pt-3">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canPay}
              className={`flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 ${
                canPay
                  ? "bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)] active:scale-[0.98]"
                  : "bg-(--color-surface) text-(--color-text-muted) cursor-not-allowed border border-(--color-border)"
              }`}
            >
              {isPending
                ? translate("booking.payment.processing")
                : translate("tickets.modify.payment.confirm_cta")}
              {isPending ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <ArrowRight size={17} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block" />
    </>
  );
}
