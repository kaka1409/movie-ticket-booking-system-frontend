import DesktopTicketPass from "./DesktopTicketPass";
import TicketActionsPanel from "./TicketActionsPanel";
import TicketHeader from "./TicketHeader";
import TicketQrPanel from "./TicketQrPanel";

/**
 * Desktop ticket detail view:
 * Header with breadcrumbs and title, high-end cinematic boarding pass on the left,
 * and sticky gate access / action center on the right.
 */
export default function TicketDetail() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <TicketHeader />

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-10">
        <main className="min-w-0">
          <DesktopTicketPass />
        </main>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <TicketQrPanel />
          <TicketActionsPanel />
        </aside>
      </div>
    </div>
  );
}
