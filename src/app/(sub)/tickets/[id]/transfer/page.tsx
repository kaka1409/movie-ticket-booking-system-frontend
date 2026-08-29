import { TransferProvider } from "@/features/tickets/contexts/TransferContext";

// Mobile components
import SeatSelector from "./components/mobile/SeatSelector";
import RecipientInput from "./components/mobile/RecipientInput";
import TransferBottomBar from "./components/mobile/TransferBottomBar";

// Desktop components
import DesktopTransferContent from "./components/desktop/TransferContent";

export default function TransferPage() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <TransferProvider>
          <div className="flex flex-col min-h-dvh">
            <main className="flex-1 overflow-y-auto pb-5 pt-4 space-y-6">
              <SeatSelector />
              <RecipientInput />
            </main>
            <TransferBottomBar />
          </div>
        </TransferProvider>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopTransferContent />
      </div>
    </>
  );
}
