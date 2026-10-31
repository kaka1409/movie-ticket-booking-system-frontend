"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { IncomingTransfer, PastTicket, TicketTransfer, UpcomingTicket } from "../types";

interface TicketDetailContextType {
  ticket: UpcomingTicket | PastTicket;
  /**
   * `recipient` → the viewer is deciding on a transfer, not the owner.
   * `sender` → the viewer gave the ticket away; nothing is actionable.
   */
  viewerRole: "owner" | "recipient" | "sender";
  /** Owner view — who this ticket is being sent to. */
  transfer?: TicketTransfer;
  /** Recipient view — the offer this viewer has to accept or decline. */
  incomingTransfer?: IncomingTransfer;
}

const TicketDetailContext = createContext<TicketDetailContextType | null>(null);

/**
 * Ticket detail for every viewer role. List-derived rows carry no `viewerRole`,
 * so it defaults to `"owner"` and the transfer views are simply absent.
 */
export function TicketDetailProvider({
  ticket,
  children,
}: {
  ticket: UpcomingTicket | PastTicket;
  children: ReactNode;
}) {
  const transfer = "transfer" in ticket ? ticket.transfer : undefined;
  const incomingTransfer = "incomingTransfer" in ticket ? ticket.incomingTransfer : undefined;
  const viewerRole = ("viewerRole" in ticket ? ticket.viewerRole : undefined) ?? "owner";

  return (
    <TicketDetailContext.Provider
      value={{
        ticket,
        viewerRole,
        transfer,
        incomingTransfer,
      }}
    >
      {children}
    </TicketDetailContext.Provider>
  );
}

/** Ticket plus the resolved viewer role and transfer views; throws outside the provider. */
export function useTicketDetail(): TicketDetailContextType {
  const ctx = useContext(TicketDetailContext);
  if (!ctx) throw new Error("useTicketDetail must be used within TicketDetailProvider");
  return ctx;
}
