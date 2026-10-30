import { TransferProvider } from "@/features/tickets/contexts/TransferContext";
import TicketOverviewCard from "@/app/(sub)/tickets/components/shared/TicketOverviewCard";
import RecipientLookupAdopter from "@/app/(sub)/tickets/components/adopters/RecipientLookupAdopter";

// Shared
import RecipientField from "./components/shared/RecipientField";

// Mobile components
import TransferBottomBar from "./components/mobile/TransferBottomBar";

// Desktop components
import DesktopTransferContent from "./components/desktop/TransferContent";

export default function TransferPage() {
  return (
    /* One provider for both device trees — the desktop skin reads the same
       transfer draft (the two trees both render, so a per-branch provider would
       fork the recipient). */
    <TransferProvider>
      {/* Both device trees render, so the email lookup runs once here; the skins
          only mirror the draft it fills in. */}
      <RecipientLookupAdopter />

      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1 overflow-y-auto pb-5 pt-4 space-y-6">
            <div className="px-4">
              <TicketOverviewCard labelKey="tickets.transfer.whole_ticket" />
            </div>
            <RecipientField className="px-4" />
          </main>
          <TransferBottomBar />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopTransferContent />
      </div>
    </TransferProvider>
  );
}
