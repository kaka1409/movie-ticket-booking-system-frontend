"use client";

import Image from "next/image";
import { ChevronRight, CreditCard } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import TearLine from "@/components/ui/TearLine";
import Button from "@/components/ui/Button";
import MicroLabel from "@/components/ui/MicroLabel";
import type { UpcomingTicket } from "@/features/tickets/types";

export default function CancelSummary({
  ticket,
  onContinue,
  onPolicyClick,
}: {
  ticket: UpcomingTicket;
  onContinue: () => void;
  onPolicyClick: () => void;
}) {
  const { translate, locale } = useLocale();

  const totalPrice = ticket.totalPrice ?? 0;
  const totalSnackPrice = ticket.totalSnackPrice ?? 0;
  const totalSeatPrice = ticket.totalSeatPrice ?? 0;
  // The policy has no fee: the only gate is time, enforced by the backend.
  const refundAmount = totalPrice;

  return (
    <main className="flex-1 overflow-y-auto pb-8 p-4">
      <div className="rounded-3xl overflow-hidden bg-(--color-surface) border border-(--color-border) shadow-(--shadow-card)">
        <div className="flex gap-3 p-4">
          <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0">
            <Image
              src={ticket.poster}
              alt={ticket.movie}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-base text-(--color-text-primary) truncate">
              {ticket.movie}
            </p>
            <p className="text-xs text-white/60 mt-0.5">{ticket.cinema}</p>
            <p className="text-xs text-white/60">{ticket.datetime}</p>
          </div>
        </div>

        <div className="px-4 pb-4 space-y-1.5">
          <MicroLabel className="text-white/60">
            {translate("tickets.cancel.seats_label")}
          </MicroLabel>
          <p className="text-sm font-bold text-(--color-text-primary)">
            {ticket.seatItems.map((seat) => seat.label).join(", ")}
          </p>
        </div>

        <TearLine />

        <div className="px-4 py-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">{translate("tickets.cancel.ticket_price")}</span>
            <span className="font-medium text-(--color-text-primary)">
              {totalSeatPrice > 0 ? formatVND(totalSeatPrice, locale) : formatVND(0, locale)}
            </span>
          </div>
          {totalSnackPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-white/60">{translate("tickets.cancel.snack_price")}</span>
              <span className="font-medium text-(--color-text-primary)">
                {formatVND(totalSnackPrice, locale)}
              </span>
            </div>
          )}
        </div>

        <TearLine />

        <div className="px-4 py-4 space-y-3">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-(--color-text-primary)">
              {translate("tickets.cancel.total_paid")}
            </span>
            <span className="text-(--color-text-primary)">{formatVND(totalPrice, locale)}</span>
          </div>
        </div>

        <TearLine />

        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-(--color-text-primary)">
              {translate("tickets.cancel.refund_amount")}
            </span>
            <span className="text-lg font-extrabold text-(--color-gold)">
              {formatVND(refundAmount, locale)}
            </span>
          </div>
        </div>

        <div className="px-4 pb-4 space-y-1.5">
          <MicroLabel className="text-white/60">{translate("tickets.cancel.refund_to")}</MicroLabel>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-(--color-surface-2) flex items-center justify-center">
              <CreditCard size={14} className="text-white/60" />
            </div>
            <div>
              <p className="text-sm font-bold text-(--color-text-primary)">
                {ticket.paymentMethod ?? "N/A"}
              </p>
              <p className="text-xs text-white/60">
                {translate("tickets.cancel.original_payment")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onPolicyClick}
        className="w-full flex items-center justify-between px-4 py-3.5 mt-4 rounded-2xl bg-(--color-surface) border border-(--color-border) hover:border-(--color-gold)/20 transition-colors"
      >
        <span className="text-sm font-semibold text-(--color-text-secondary)">
          {translate("tickets.cancel.cancellation_policy")}
        </span>
        <ChevronRight size={16} className="text-white/60" />
      </button>

      <div className="mt-4">
        <Button onClick={onContinue}>{translate("tickets.cancel.continue")}</Button>
      </div>
    </main>
  );
}
