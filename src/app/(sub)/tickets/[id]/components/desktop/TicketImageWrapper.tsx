"use client";

import { forwardRef } from "react";
import TicketCapture from "./TicketCapture";

/**
 * Wrapper for TicketCapture to enable image capture.
 * Forwards ref to the root div for html-to-image capture.
 * TicketCapture mirrors mobile TicketInfo design with QR code included.
 */
const TicketImageWrapper = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="flex flex-col">
      <TicketCapture />
    </div>
  );
});

TicketImageWrapper.displayName = "TicketImageWrapper";

export default TicketImageWrapper;
