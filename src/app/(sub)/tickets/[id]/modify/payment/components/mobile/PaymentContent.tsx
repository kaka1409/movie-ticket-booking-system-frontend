"use client";

import { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { formatVND } from "@/libs/utils";
import { modifyTicket } from "@/features/tickets/action";
import BookingBottomBar from "@/components/shared/BookingBottomBar";
import MicroLabel from "@/components/ui/MicroLabel";
import Image from "next/image";

/** Local gateway cards — the backend charges the difference on the original method. */
const PAYMENT_METHODS: { id: string; name: string; description: string; imageSrc: string }[] = [
  { id: "vnpay", name: "VNPAY", description: "Bank Transfer", imageSrc: "/images/VNPay.png" },
  { id: "momo", name: "MoMo E-Wallet", description: "Fast & Secure", imageSrc: "/images/momo.png" },
];

export default function PaymentContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { translate, locale } = useLocale();
  const { ticket } = useTicketDetail();
  const { token } = useAuth();
  const { modificationType, selectedShowtime, selectedSeats } = useModification();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    setErrorMessage(null);

    startTransition(async () => {
      const newShowtime = selectedShowtime?.showtimeId
        ? { showtimeId: selectedShowtime.showtimeId }
        : undefined;
      const seatIds = selectedSeats.flatMap((seat) => seat.seatIds);
      const newSeats = seatIds.length > 0 ? { seatIds } : undefined;

      const result = await modifyTicket(
        { success: false, error: "" },
        {
          ticketId: id,
          modificationType: modificationType ?? "showtime",
          newShowtime,
          newSeats,
          token: token ?? "",
        },
      );

      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }

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
                <MicroLabel className="text-(--color-text-muted) mb-2">
                  {translate("tickets.modify.payment.pay_difference")}
                </MicroLabel>
                <p className="font-extrabold text-3xl text-(--color-gold)">
                  {formatVND(difference, locale)}
                </p>
              </div>
            </section>

            {/* Payment methods */}
            <section className="px-4 space-y-3">
              <MicroLabel className="text-(--color-text-muted)">
                {translate("booking.payment.select_method")}
              </MicroLabel>
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
          <BookingBottomBar
            canProceed={canPay}
            ctaText={
              isPending
                ? translate("booking.payment.processing")
                : translate("tickets.modify.payment.confirm_cta")
            }
            isLoading={isPending}
            errorText={errorMessage ?? undefined}
            onCtaClick={handleConfirm}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block" />
    </>
  );
}
