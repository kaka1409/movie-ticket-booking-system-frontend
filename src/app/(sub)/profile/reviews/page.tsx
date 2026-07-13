"use client";

import ReviewContent from "./components/mobile/ReviewContent";
import DesktopReviewContent from "./components/desktop/ReviewContent";

export default function ReviewPage() {
  return (
    <>
      <div className="block md:hidden">
        <ReviewContent />
      </div>
      <div className="hidden md:block">
        <DesktopReviewContent />
      </div>
    </>
  );
}
