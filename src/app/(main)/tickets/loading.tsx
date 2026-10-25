import MobileTicketsSkeleton from "./components/mobile/TicketsSkeleton";
import DesktopTicketsSkeleton from "./components/desktop/TicketsSkeleton";

export default function TicketsLoading() {
  return (
    <>
      <div className="block md:hidden">
        <MobileTicketsSkeleton />
      </div>

      <div className="hidden md:block">
        <DesktopTicketsSkeleton />
      </div>
    </>
  );
}
