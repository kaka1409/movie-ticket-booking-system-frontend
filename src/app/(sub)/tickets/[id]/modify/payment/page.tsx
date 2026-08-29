import PaymentContent from "./components/mobile/PaymentContent";

import DesktopPaymentContent from "./components/desktop/PaymentContent";

export default function PaymentPage() {
  return (
    <>
      <div className="block md:hidden">
        <PaymentContent />
      </div>

      <div className="hidden md:block">
        <DesktopPaymentContent />
      </div>
    </>
  );
}
