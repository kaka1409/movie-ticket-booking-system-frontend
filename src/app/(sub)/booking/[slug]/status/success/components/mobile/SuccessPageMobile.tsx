import SuccessIcon from "./SuccessIcon";
import TicketCard from "./TicketCard";
import SuccessActions from "./SuccessActions";

export default function SuccessPageMobile() {
  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
      {/* Scrollable body */}
      <main className="flex-1 overflow-y-auto pb-8 pt-4 space-y-6">
        {/* Success hero */}
        <SuccessIcon />

        {/* Ticket card */}
        <TicketCard />

        {/* Action buttons */}
        <SuccessActions />
      </main>
    </div>
  );
}
