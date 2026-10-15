import { getPaymentMethods } from "@/features/booking/api";
import RequireDraft from "@/features/booking/components/RequireDraft";
import { getRequestLocale } from "@/libs/session";

// Mobile components
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";
import PageError from "@/app/(sub)/booking/components/mobile/PageError";
import OrderSummary from "./components/mobile/OrderSummary";
import PaymentOption from "./components/mobile/PaymentOption";
import SecureBadge from "./components/mobile/SecureBadge";
import TermsNote from "./components/mobile/TermsNote";
import PaymentHeader from "./components/mobile/PaymentHeader";
import BottomBar from "./components/mobile/BottomBar";

// Desktop components
import DesktopPaymentContent from "./components/desktop/PaymentContent";

export default async function PaymentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const methodsResult = await getPaymentMethods(await getRequestLocale());

  if ("error" in methodsResult) {
    return <PageError error={methodsResult.error} />;
  }

  const paymentMethods = methodsResult.data;

  return (
    <RequireDraft slug={slug}>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <StepBar current={5} />
          <main className="flex-1 overflow-y-auto pb-5 pt-1 space-y-5">
            <CountdownBanner />
            <OrderSummary />
            <section className="px-4 space-y-3">
              <PaymentHeader />
              <div className="space-y-2.5">
                {paymentMethods.map((m) => (
                  <PaymentOption key={m.id} method={m} />
                ))}
              </div>
            </section>
            <SecureBadge />
            <TermsNote />
          </main>
          <BottomBar />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopPaymentContent />
      </div>
    </RequireDraft>
  );
}
