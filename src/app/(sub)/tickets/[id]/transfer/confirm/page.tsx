import { redirect } from "next/navigation";
import { getRecipient } from "@/features/tickets/api";
import { getRequestCookie } from "@/libs/session";

// Mobile components
import ConfirmCard from "./components/mobile/ConfirmCard";
import ConfirmBottomBar from "./components/mobile/ConfirmBottomBar";

// Desktop components
import DesktopConfirmContent from "./components/desktop/ConfirmContent";

interface ConfirmPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ recipient?: string }>;
}

export default async function ConfirmPage({ params, searchParams }: ConfirmPageProps) {
  const { id } = await params;
  const { recipient: recipientEmail } = await searchParams;

  // The offer is the whole ticket, so the recipient is the only draft value that
  // can be missing when this step is opened directly.
  if (!recipientEmail) redirect(`/tickets/${id}/transfer`);

  const recipient = await getRecipient(recipientEmail, {
    cookie: await getRequestCookie(),
  });
  if (!recipient) redirect(`/tickets/${id}/transfer`);

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1 overflow-y-auto pb-5 pt-4 space-y-6">
            <ConfirmCard recipient={recipient} />
          </main>
          <ConfirmBottomBar recipient={recipient} />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopConfirmContent />
      </div>
    </>
  );
}
