"use client";

import PageContent from "./components/mobile/PageContent";
import DesktopPaymentContent from "./components/desktop/PaymentContent";

export default function PaymentPage() {
  return (
    <>
      <div className="block md:hidden">
        <PageContent />
      </div>
      <div className="hidden md:block">
        <DesktopPaymentContent />
      </div>
    </>
  );
}
