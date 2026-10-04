"use client";

import { useLocale } from "@/contexts/LocaleContext";
import type { PastTicket } from "@/features/tickets/types";
import PastCard from "@/app/(main)/tickets/components/mobile/PastCard";
import TicketList from "@/app/(main)/tickets/components/mobile/TicketList";

export default function PastTicketList({ tickets }: { tickets: PastTicket[] }) {
  const { translate } = useLocale();

  return (
    <TicketList
      tickets={tickets}
      tab="past"
      emptyLabel={translate("tickets.no_past")}
      loadMoreLabel={translate("tickets.load_older")}
      renderCard={(ticket) => <PastCard ticket={ticket} />}
    />
  );
}
