"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { UpcomingTicket, PastTicket, TicketTransfer } from "../types";

interface TicketDetailContextType {
  ticket: UpcomingTicket | PastTicket;
  transfer?: TicketTransfer;
}

const TicketDetailContext = createContext<TicketDetailContextType | null>(null);

export function TicketDetailProvider({
  ticket,
  children,
}: {
  ticket: UpcomingTicket | PastTicket;
  children: ReactNode;
}) {
  const transfer = "transfer" in ticket ? ticket.transfer : undefined;

  return (
    <TicketDetailContext.Provider value={{
      ticket, transfer
    }}>
      {children}
    </TicketDetailContext.Provider>
  );
}

export function useTicketDetail(): TicketDetailContextType {
  const ctx = useContext(TicketDetailContext);
  if (!ctx) throw new Error("useTicketDetail must be used within TicketDetailProvider");
  return ctx;
}
