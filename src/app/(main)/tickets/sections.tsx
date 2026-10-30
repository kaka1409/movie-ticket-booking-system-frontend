import { getTicketsForTab, type TicketTab } from "@/features/tickets/api";

import UpcomingTicketList from "./components/mobile/UpcomingTicketList";
import PastTicketList from "./components/mobile/PastTicketList";
import Pager from "./components/shared/Pager";
import TicketsContent from "./components/desktop/TicketsContent";

type TicketSectionProps = {
  tab: TicketTab;
  page: number;
  cookie: string | undefined;
  locale: "en" | "vn";
};

/**
 * The visible tab's rows, streamed: the page shell (tabs, title band) is already
 * on screen when this resolves. Each tree owns its boundary, and both read the
 * `cache()`-memoized loader, so the pair still costs one backend call.
 */
export async function MobileTicketListSection({ tab, page, cookie, locale }: TicketSectionProps) {
  const { upcoming, past, meta, isUnauthorized } = await getTicketsForTab(
    tab,
    page,
    cookie,
    locale,
  );

  if (isUnauthorized) return null;

  return (
    <>
      {tab === "upcoming" ? (
        <UpcomingTicketList tickets={upcoming} />
      ) : (
        <PastTicketList tickets={past} />
      )}
      <Pager meta={meta} tab={tab} />
    </>
  );
}

/** Desktop listing: its header carries the tab links and the row count. */
export async function DesktopTicketsSection({ tab, page, cookie, locale }: TicketSectionProps) {
  const { upcoming, past, meta, isUnauthorized } = await getTicketsForTab(
    tab,
    page,
    cookie,
    locale,
  );

  if (isUnauthorized) return null;

  return <TicketsContent tab={tab} upcoming={upcoming} past={past} meta={meta} />;
}
