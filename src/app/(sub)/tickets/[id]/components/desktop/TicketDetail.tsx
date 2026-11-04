"use client";

import TicketImageWrapper from "./TicketImageWrapper";
import MobileHintPanel from "./MobileHintPanel";
import TicketActionsPanel from "./TicketActionsPanel";
import TicketHeader from "./TicketHeader";
import { useDownloadTicket } from "@/features/tickets/hooks/useDownloadTicket";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

/**
 * Desktop ticket detail view:
 * Header with breadcrumbs and title, ticket image (with ref for download, includes QR)
 * on the left, and mobile hint + action panel on the right (sticky for easy access).
 */
export default function TicketDetail() {
  const { ticketRef, downloadTicket, isDownloading } = useDownloadTicket();
  const { ticket } = useTicketDetail();

  const handleDownload = () => {
    downloadTicket(`ticket-${ticket.id}.png`);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <TicketHeader />

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-10">
        <main className="min-w-0">
          <TicketImageWrapper ref={ticketRef} />
        </main>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <MobileHintPanel />
          <TicketActionsPanel downloadTicket={handleDownload} isDownloading={isDownloading} />
        </aside>
      </div>
    </div>
  );
}
