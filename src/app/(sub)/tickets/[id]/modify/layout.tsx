"use client";

import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { ModificationProvider } from "@/features/tickets/contexts/ModificationContext";

export default function ModifyLayout({ children }: { children: React.ReactNode }) {
  const { ticket } = useTicketDetail();
  const seatCount = ticket.seatItems.length;

  return <ModificationProvider initialSeatCount={seatCount}>{children}</ModificationProvider>;
}
