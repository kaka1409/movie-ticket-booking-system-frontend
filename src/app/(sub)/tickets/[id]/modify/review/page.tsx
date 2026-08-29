import ComparisonCard from "./components/mobile/ComparisonCard";
import PriceSummary from "./components/mobile/PriceSummary";
import ReviewBottomBar from "./components/mobile/BottomBar";

import DesktopReviewContent from "./components/desktop/ReviewContent";

export default function ReviewPage() {
  return (
    <>
      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1 overflow-y-auto pb-5 pt-4 space-y-5">
            <ComparisonCard />
            <PriceSummary />
          </main>
          <ReviewBottomBar />
        </div>
      </div>

      <div className="hidden md:block">
        <DesktopReviewContent />
      </div>
    </>
  );
}
