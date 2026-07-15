import { Suspense } from "react";
import { TicketsProvider } from "@/features/tickets/context";
import { getUpcomingTickets, getPastTickets } from "@/features/tickets/api";

// Mobile components
import Tabs from "@/app/(main)/tickets/components/mobile/Tabs";
import UpcomingTicketList from "@/app/(main)/tickets/components/mobile/UpcomingTicketList";
import PastTicketList from "@/app/(main)/tickets/components/mobile/PastTicketList";

// Desktop components
import TicketsContent from "@/app/(main)/tickets/components/desktop/TicketsContent";

export default async function TicketsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingTickets(),
    getPastTickets(),
  ]);

  return (
    <Suspense fallback={null}>
      <TicketsProvider>
        {/* Mobile */}
        <div className="block md:hidden">
          <div className="space-y-4 py-(--space-md)">
            <Tabs />
            <UpcomingTicketList tickets={upcoming} />
            <PastTicketList tickets={past} />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <TicketsContent />
        </div>
      </TicketsProvider>
    </Suspense>
  );
}
