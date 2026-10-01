import { redirect } from "next/navigation";
import { findRecipient } from "@/features/tickets/api";
import { getRequestCookie } from "@/libs/session";

// Mobile components
import ConfirmCard from "./components/mobile/ConfirmCard";
import ConfirmBottomBar from "./components/mobile/ConfirmBottomBar";

// Desktop components
import DesktopConfirmContent from "./components/desktop/ConfirmContent";

interface ConfirmPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    seats?: string;
    recipient?: string;
    transferSnacks?: string;
  }>;
}

export default async function ConfirmPage({ params, searchParams }: ConfirmPageProps) {
  const { id } = await params;
  const { seats, recipient: recipientUsername, transferSnacks } = await searchParams;

  // Validate required searchParams
  if (!seats || !recipientUsername) {
    redirect(`/tickets/${id}/transfer`);
  }

  const recipient = await findRecipient(recipientUsername, await getRequestCookie());
  if (!recipient) {
    redirect(`/tickets/${id}/transfer`);
  }

  const seatLabels = seats
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);

  const showSnacks = transferSnacks === "true";

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1 overflow-y-auto pb-5 pt-4 space-y-6">
            <ConfirmCard
              seatLabels={seatLabels}
              recipient={recipient}
              transferSnacks={showSnacks}
            />
          </main>
          <ConfirmBottomBar
            seatLabels={seatLabels}
            recipient={recipient}
            transferSnacks={showSnacks}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopConfirmContent />
      </div>
    </>
  );
}
