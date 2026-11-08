"use client";

import Link from "next/link";
import { Ticket, Film } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { TicketPageMeta } from "@/features/tickets/types";
import type { PastTicket, UpcomingTicket } from "@/features/tickets/types";
import EmptyState from "@/components/ui/EmptyState";
import Tabs from "@/components/ui/Tabs";
import Pager from "@/app/(main)/tickets/components/shared/Pager";
import PastTicketCard from "./PastTicketCard";
import UpcomingTicketCard from "./UpcomingTicketCard";
import LocaleTransition from "@/components/ui/LocaleTransition";
import DesktopPageHeader from "@/components/shared/DesktopPageHeader";
import type { TicketTab } from "@/features/tickets/types";

/**
 * Desktop ticket listing:
 * Supports quick tab navigation between upcoming and past passes,
 * rich empty-state with film discovery CTA, and paginated responsive cards.
 */
export default function TicketsContent({
  tab,
  upcoming,
  past,
  meta,
}: {
  tab: TicketTab;
  upcoming: UpcomingTicket[];
  past: PastTicket[];
  meta: TicketPageMeta;
}) {
  const { translate } = useLocale();
  const isEmpty = tab === "upcoming" ? upcoming.length === 0 : past.length === 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <DesktopPageHeader
        title={translate(`tickets.${tab}`)}
        subtitle={`${meta.total} ${translate("common.tickets")}`}
        action={
          <Tabs
            ariaLabel={translate("aria.tickets_tabs")}
            activeTab={tab}
            linkFor={(key) => `/tickets?tab=${key}`}
            stretch={false}
            tabs={[
              { key: "upcoming", label: translate("tickets.upcoming") },
              { key: "past", label: translate("tickets.past") },
            ]}
          />
        }
      />

      <section className="mt-8 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-7 shadow-(--shadow-card)">
        <div className="surface-raised">
          {isEmpty ? (
            <EmptyState
              icon={Ticket}
              title={translate(tab === "upcoming" ? "tickets.no_upcoming" : "tickets.no_past")}
              description={translate(
                tab === "upcoming" ? "tickets.no_upcoming_desc" : "tickets.no_past_desc",
              )}
            >
              {tab === "upcoming" && (
                <Link
                  href="/movies"
                  className="mt-2 flex items-center gap-2 rounded-xl border border-(--color-gold) bg-(--color-gold) px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-110 active:scale-95"
                >
                  <Film size={16} />
                  <span>{translate("tickets.browse_movies")}</span>
                </Link>
              )}
            </EmptyState>
          ) : (
            <LocaleTransition>
              <div className="grid gap-6 lg:grid-cols-2">
                {tab === "upcoming"
                  ? upcoming.map((ticket) => <UpcomingTicketCard key={ticket.id} ticket={ticket} />)
                  : past.map((ticket) => <PastTicketCard key={ticket.id} ticket={ticket} />)}
              </div>
            </LocaleTransition>
          )}
        </div>

        {meta.totalPages > 1 && (
          <div className="mt-8 border-t border-(--color-border)/40 pt-6">
            <Pager meta={meta} tab={tab} />
          </div>
        )}
      </section>
    </div>
  );
}
