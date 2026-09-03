
import CancelContent from "./components/desktop/CancelContent";
import CancelView from "./components/mobile/CancelView";

export default function CancelPage() {

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
          <CancelView />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <CancelContent />
      </div>
    </>
  );
}
