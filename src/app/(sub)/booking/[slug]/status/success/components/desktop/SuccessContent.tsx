"use client";

import type { ReactNode } from "react";
import { useDownloadTicket } from "@/features/tickets/hooks/useDownloadTicket";
import SuccessHero from "./SuccessHero";
import SuccessSidePanel from "./SuccessSidePanel";
import type { BookingDetail } from "@/features/booking/types";

/**
 * Desktop success page. The flow is over, so there is no stepper and no summary
 * rail: a left-aligned hero sits above a wide receipt card, with the scan
 * payload and the actions in a side panel.
 *
 * Below `lg:` the side panel drops under the receipt at full width — same
 * one-column rule the booking steps use in the 740–1023px band.
 *
 * The download button captures the off-screen `TicketCaptureCard` (mounted by
 * the receipt section) so the PNG matches the `/tickets/[id]` ticket style.
 */
export default function SuccessContent({
  transactionId,
  booking,
  receipt,
}: {
  transactionId: string;
  booking: BookingDetail | null;
  receipt: ReactNode;
}) {
  const { downloadTicket, isDownloading } = useDownloadTicket();

  const bookingRef = booking ? (booking.transactionRef ?? booking.id) : transactionId;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8">
      <SuccessHero />

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {receipt}
        <SuccessSidePanel
          booking={booking}
          transactionId={transactionId}
          onDownload={() =>
            downloadTicket(
              `ticket-${bookingRef}.png`,
              document.getElementById("success-ticket-capture"),
            )
          }
          isDownloading={isDownloading}
        />
      </div>
    </div>
  );
}
