import TicketsSkeleton from "./components/mobile/TicketsSkeleton";

export default function TicketsLoading() {
  return (
    <div className="block md:hidden">
      <TicketsSkeleton />
    </div>
  );
}
