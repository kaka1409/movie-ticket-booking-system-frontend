"use client";

import { useLocale } from "@/contexts/LocaleContext";
import type { UpcomingTicket } from "@/features/tickets/types";
import UpcomingCard from "@/app/(main)/tickets/components/mobile/UpcomingCard";
import TicketList from "@/app/(main)/tickets/components/mobile/TicketList";

export default function UpcomingTicketList({ tickets }: { tickets: UpcomingTicket[] }) {
  const { translate } = useLocale();

  return (
    <TicketList
      tickets={tickets}
      tab="upcoming"
      emptyLabel={translate("tickets.no_upcoming")}
      loadMoreLabel={translate("tickets.load_more")}
      renderCard={(ticket) => <UpcomingCard ticket={ticket} />}
    />
  );
}
