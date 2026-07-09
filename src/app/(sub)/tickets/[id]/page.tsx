"use client";

import { useParams } from "next/navigation";
import { UPCOMING, PAST } from "@/features/tickets/mock";
import type { UpcomingTicket, PastTicket } from "@/features/tickets/types";

// Mobile
import MobileTicketInfo from "./components/mobile/TicketInfo";
import MobileTicketActions from "./components/mobile/TicketActions";

// Desktop
import DesktopTicketDetail from "./components/desktop/TicketDetail";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const ticket = UPCOMING.find((t) => t.id === id) ?? PAST.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-(--color-bg)">
        <p className="text-(--color-text-secondary) text-lg">Ticket not found</p>
      </div>
    );
  }

  const isUpcoming = "cinema" in ticket;
  const detail = isUpcoming ? ticket as UpcomingTicket : ticket as PastTicket;

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <MobileTicketInfo ticket={ticket} detail={detail} />
        {isUpcoming && <MobileTicketActions status={ticket.status} />}
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopTicketDetail />
      </div>
    </>
  );
}
