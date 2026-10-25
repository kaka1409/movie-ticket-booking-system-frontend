import ComparisonCard from "./components/shared/ComparisonCard";
import PriceSummary from "./components/shared/PriceSummary";
import ReviewBottomBar from "./components/mobile/BottomBar";

import DesktopReviewContent from "./components/desktop/ReviewContent";

export default function ReviewPage() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1 overflow-y-auto pb-5 pt-4 px-4 space-y-5">
            <ComparisonCard />
            <div className="p-4 rounded-2xl bg-(--color-surface) border border-(--color-border)">
              <PriceSummary />
            </div>
          </main>
          <ReviewBottomBar />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopReviewContent />
      </div>
    </>
  );
}
