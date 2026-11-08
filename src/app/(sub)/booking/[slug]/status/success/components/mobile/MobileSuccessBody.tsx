"use client";

import type { ReactNode } from "react";
import { useDownloadTicket } from "@/features/tickets/hooks/useDownloadTicket";
import SuccessActions from "./SuccessActions";
import type { BookingDetail } from "@/features/booking/types";

/**
 * Mobile success body: owns the ticket capture ref around the receipt and
 * hands the download handler to the action buttons. The receipt arrives as a
 * rendered slot because its data is fetched in an async server section.
 */
export default function MobileSuccessBody({
  receipt,
  booking,
  transactionId,
}: {
  receipt: ReactNode;
  booking: BookingDetail | null;
  transactionId: string;
}) {
  const { ticketRef, downloadTicket, isDownloading } = useDownloadTicket();

  const bookingRef = booking ? (booking.transactionRef ?? booking.id) : transactionId;

  return (
    <>
      <div ref={ticketRef}>{receipt}</div>
      <SuccessActions
        onDownload={() => downloadTicket(`ticket-${bookingRef}.png`)}
        isDownloading={isDownloading}
      />
    </>
  );
}
