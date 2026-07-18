"use client";

import { useLocale } from "@/contexts/LocaleContext";
import SuccessIcon from "./SuccessIcon";
import TicketCard from "./TicketCard";
import SuccessActions from "./SuccessActions";

export default function SuccessPageMobile() {
  const { translate } = useLocale();
  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
      {/* Share button */}
      <div className="flex justify-end px-4 pt-5">
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full bg-(--color-surface) border border-(--color-border) text-(--color-text-muted) hover:text-(--color-gold) hover:border-(--color-gold)/40 transition-colors"
          aria-label={translate("booking.status.success.share_booking")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      {/* Scrollable body */}
      <main className="flex-1 overflow-y-auto pb-8 pt-4 space-y-6">
        {/* Success hero */}
        <SuccessIcon />

        {/* Ticket card */}
        <TicketCard />

        {/* Action buttons */}
        <SuccessActions />
      </main>
    </div>
  );
}
