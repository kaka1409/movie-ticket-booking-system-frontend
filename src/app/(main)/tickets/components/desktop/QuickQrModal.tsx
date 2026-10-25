"use client";

import { useEffect, useRef } from "react";
import { X, Printer } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import QRCode from "@/app/(sub)/tickets/[id]/components/mobile/QRCode";
import type { UpcomingTicket } from "@/features/tickets/types";

/**
 * Modal to quickly preview and print the QR code of a ticket directly from the listing.
 */
export default function QuickQrModal({
  ticket,
  isOpen,
  onClose,
}: {
  ticket: UpcomingTicket;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { translate } = useLocale();
  const panelReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelReference}
        role="dialog"
        aria-modal="true"
        aria-label={translate("tickets.quick_qr")}
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-(--color-surface-2) text-(--color-text-muted) transition-colors hover:text-white"
          aria-label={translate("layout.sub.back")}
        >
          <X size={18} />
        </button>

        <div className="text-center mb-4">
          <p className="text-[11px] font-bold tracking-widest text-(--color-gold) uppercase">
            {translate("tickets.ticket_pass")}
          </p>
          <h3 className="mt-1 text-base font-extrabold text-white truncate px-6">{ticket.movie}</h3>
          <p className="mt-0.5 text-xs text-(--color-text-muted)">{ticket.datetime}</p>
          <p className="text-xs text-(--color-text-secondary)">
            {ticket.cinema} {ticket.room ? `· ${ticket.room}` : ""}
          </p>
        </div>

        <div className="flex justify-center my-3">
          {ticket.qrCode ? (
            <div className="rounded-2xl overflow-hidden shadow-inner">
              <QRCode value={ticket.qrCode} ticketId={ticket.id} />
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-(--color-text-muted)">
              {translate("tickets.detail.qr_invalid")}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-(--color-border) pt-4">
          <div>
            <p className="text-[10px] font-bold text-(--color-text-muted) uppercase tracking-wider">
              {translate("tickets.booking_id")}
            </p>
            <p className="text-xs font-mono font-bold text-white">{ticket.id}</p>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-(--color-gold)/40 bg-(--color-gold)/10 px-3 py-2 text-xs font-bold text-(--color-gold) transition hover:bg-(--color-gold)/20 active:scale-95"
          >
            <Printer size={14} />
            {translate("tickets.print_ticket")}
          </button>
        </div>
      </div>
    </div>
  );
}
