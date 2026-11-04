"use client";

import TicketImageWrapper from "./TicketImageWrapper";
import TicketActions from "./TicketActions";
import { useDownloadTicket } from "@/features/tickets/hooks/useDownloadTicket";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

/**
 * Mobile ticket detail view: wraps ticket info (with ref for download)
 * and action buttons. Download uses html-to-image to capture the ticket.
 */
export default function MobileTicketDetail() {
  const { ticketRef, downloadTicket, isDownloading } = useDownloadTicket();
  const { ticket } = useTicketDetail();

  const handleDownload = () => {
    downloadTicket(`ticket-${ticket.id}.png`);
  };

  return (
    <>
      <TicketImageWrapper ref={ticketRef} />
      <TicketActions downloadTicket={handleDownload} isDownloading={isDownloading} />
    </>
  );
}
