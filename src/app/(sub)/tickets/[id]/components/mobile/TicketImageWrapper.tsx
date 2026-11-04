"use client";

import { forwardRef } from "react";
import TicketInfo from "./TicketInfo";

/**
 * Wrapper for TicketInfo to enable image capture.
 * Forwards ref to the root div for html-to-image capture.
 * TicketInfo already includes QR code.
 */
const TicketImageWrapper = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="flex flex-col">
      <TicketInfo />
    </div>
  );
});

TicketImageWrapper.displayName = "TicketImageWrapper";

export default TicketImageWrapper;
