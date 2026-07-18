"use client";

import { Download, XCircle } from "lucide-react";
import type { TicketStatus } from "@/features/tickets/constants";
import { useLocale } from "@/contexts/LocaleContext";

interface TicketActionsProps {
  status: TicketStatus;
}

export default function TicketActions({ status }: TicketActionsProps) {
  const { translate } = useLocale();
  const canCancel = ["success", "confirmed", "pending"].includes(status);

  return (
    <div className="px-4 pb-8 space-y-3">
      <button className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-150 active:scale-[0.98] bg-(--color-gold) text-[#0F0F0F] shadow-(--shadow-glow)">
        <Download size={18} />
        {translate("tickets.detail.download_ticket")}
      </button>

      {canCancel && (
        <button className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-150 active:scale-[0.98] border border-(--color-gold) text-(--color-gold) bg-transparent">
          <XCircle size={18} />
          {translate("tickets.detail.cancel_refund")}
        </button>
      )}
    </div>
  );
}
