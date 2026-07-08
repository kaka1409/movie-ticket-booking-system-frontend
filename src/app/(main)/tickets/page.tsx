"use client";

import { TicketsProvider } from "@/contexts/TicketsContext";

// Mobile componenets
import Tabs from "@/app/(main)/tickets/components/mobile/Tabs";
import TicketList from "@/app/(main)/tickets/components/mobile/TicketList";

// Desktop components
import TicketsContent from '@/app/(main)/tickets/components/desktop/TicketsContent'

export default function TicketsPage() {
  return (
    <TicketsProvider>
      <>
        {/* Mobile */}
        <div className="block md:hidden">
          <div className="space-y-4 py-(--space-md)">
            <Tabs />
            <TicketList />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <TicketsContent />
        </div>
      </>
    </TicketsProvider>
  );
}
