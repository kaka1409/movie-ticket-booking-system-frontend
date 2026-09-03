"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MonitorPlay, CalendarDays, Armchair, Popcorn, CreditCard, Clock } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import DetailRow from "@/app/(sub)/booking/components/mobile/DetailRow";
import QRCode from "./QRCode";
import TearLine from "@/components/ui/TearLine";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { cancelTransfer } from "@/features/tickets/api";

export default function TicketInfo() {
  const { ticket, transfer } = useTicketDetail();
  const { translate } = useLocale();
  const router = useRouter();

  const seatItems = ticket?.seatItems ?? [];
  const hasSnacks = !!ticket?.foodDrink && ticket.foodDrink.length > 0;
  const isTransferPending = transfer?.status === "pending";

  const handleCancelTransfer = async () => {
    await cancelTransfer(ticket.id);
    router.refresh();
  };

  return (
    <main className="flex-1 overflow-y-auto pb-8 p-4">
      {/* Hero ticket card */}
      <div className="rounded-3xl overflow-visible bg-(--color-surface) border border-(--color-border) shadow-(--shadow-card)">
        {/* Poster */}
        <div className="relative w-full h-80 bg-(--color-surface) rounded-t-3xl overflow-hidden">
          <Image
            src={ticket.poster}
            alt={ticket.movie}
            fill
            sizes="100%"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/80 text-(--color-text-secondary) border border-(--color-border)">
                {ticket.format}
              </span>
              {ticket?.ageRating && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/80 text-(--color-text-secondary) border border-(--color-border)">
                  {ticket.ageRating}
                </span>
              )}
            </div>
            <h2 className="text-white font-extrabold text-2xl leading-tight">
              {ticket.movie}
            </h2>
          </div>
        </div>

        {/* Tear line */}
        <TearLine className="px-0 my-0" lineClassName="mx-3" />

        {/* Booking details */}
        <div className="px-4 py-4 space-y-4">
          <div className="flex justify-center">
            <DetailRow
              icon={MonitorPlay}
              label={translate("booking.common.theater")}
              value={
                <>
                  {ticket?.cinema ?? "—"}
                  {ticket?.location && <>, {ticket.location}</>}
                  {ticket?.room && <>, {ticket.room}</>}
                </>
              }
            />
            <DetailRow
              icon={CalendarDays}
              label={translate("booking.common.date_time")}
              value={ticket.datetime}
              valueClass="text-white font-bold text-sm text-right"
              labelClass="justify-end "
            />
          </div>

          {/* Seats grouped by type */}
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.16em] uppercase text-white/60">
              <Armchair size={10} />
              {translate("booking.common.seats")} ({seatItems.length})
            </p>
            {Object.entries(
              seatItems.reduce<Record<string, typeof seatItems>>((acc, seat) => {
                (acc[seat.type] ??= []).push(seat);
                return acc;
              }, {})
            ).map(([type, seats]) => (
              <div key={type} className="space-y-1">
                <p className="text-sm font-bold text-white">
                  {seats.map((seat) => seat.label).join(", ")}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-white">{type} {translate("booking.common.ticket")}</span>
                  <span className="font-medium text-white">
                    {seats.length}× {formatVND(seats[0].price)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Food & Drink */}
          {hasSnacks && (
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.16em] uppercase text-white/60">
                <Popcorn size={10} />
                {translate("booking.common.snacks_combos")}
              </p>
              <div className="space-y-1">
                {ticket!.foodDrink!.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-white">{item.name}</span>
                    <span className="font-medium text-white">
                      {item.qty}× {formatVND(item.qty * item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment + Total */}
          <div className="flex justify-between items-end gap-4">
            <DetailRow
              icon={CreditCard}
              label={translate("booking.common.payment_method")}
              value={ticket?.paymentMethod || "N/A"}
            />
            <div className="text-right">
              <p className="flex items-center justify-end gap-1.5 text-[9px] font-black tracking-[0.16em] uppercase text-white/60">
                {translate("booking.common.total_price")}
              </p>
              <p className="font-bold text-base text-(--color-gold)">
                {ticket?.totalPrice != null ? formatVND(ticket.totalPrice) : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Tear line */}
        <TearLine className="px-0 my-0" lineClassName="mx-3" />

        {isTransferPending && transfer ? (
          /* Transfer pending panel — replaces QR while waiting */
          <div className="px-4 pb-5 pt-4 flex flex-col items-center gap-3 text-center">
            <span className="px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 bg-(--color-gold)/10 border border-(--color-gold)/40">
              <Clock size={13} className="text-(--color-gold)" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-(--color-gold)">
                {translate("tickets.transfer.pending_badge")}
              </span>
            </span>
            {transfer.transferredSeats.length > 0 && (
              <p className="font-extrabold text-lg text-(--color-text-primary)">
                {transfer.transferredSeats.join(" · ")}
              </p>
            )}
            <p className="text-sm text-(--color-text-muted)">
              {translate("tickets.transfer.pending_waiting").replace(
                "{name}",
                transfer.recipient.name
              )}
            </p>
            <button
              type="button"
              onClick={handleCancelTransfer}
              className="mt-1 px-5 py-2.5 rounded-xl font-extrabold text-xs tracking-widest uppercase transition-all duration-150 active:scale-[0.98] border border-red-500/60 text-red-400 bg-transparent"
            >
              {translate("tickets.transfer.cancel_transfer")}
            </button>
          </div>
        ) : (
          /* QR Code */
          <div className="px-4 pb-5 pt-4 flex flex-col items-center gap-3">
            <QRCode value={ticket.id} />
            <p className="text-xs text-white/60 tracking-wide">
              {translate("tickets.detail.booking_id")}
              <span className="font-bold text-white">#{ticket.id}</span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
