import { Suspense } from "react";
import RequireDraft from "@/app/(sub)/booking/components/shared/RequireDraft";
import { getRequestLocale } from "@/libs/session";
import { getPaymentMethods } from "@/features/booking/api";

// Mobile components
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";
import OrderSummary from "@/app/(sub)/booking/components/shared/OrderSummary";
import SecureBadge from "./components/shared/SecureBadge";
import TermsNote from "./components/shared/TermsNote";
import PaymentHeader from "./components/shared/PaymentHeader";
import BottomBar from "./components/mobile/BottomBar";

// Desktop components
import DesktopPaymentContent from "./components/desktop/PaymentContent";

import {
  DesktopPaymentOptionsSkeleton,
  MobilePaymentOptionsSkeleton,
} from "./components/shared/PaymentSkeletons";
import { PaymentDefaultAdoptSection, PaymentMethodsSection } from "./sections";

/**
 * Payment step, streamed: the page awaits the locale only, so the draft gate,
 * the order summary, the secure/terms notes and both CTAs paint immediately and
 * only the gateway catalog streams. Mobile and desktop pickers plus the
 * default-selection effect share one memoized catalog read.
 */
export default async function PaymentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const paymentMethodsPromise = getPaymentMethods(locale);

  return (
    <RequireDraft slug={slug}>
      <Suspense fallback={null}>
        <PaymentDefaultAdoptSection paymentMethodsPromise={paymentMethodsPromise} />
      </Suspense>

      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <StepBar current={5} />
          <main className="flex-1 overflow-y-auto pb-5 pt-1 space-y-5">
            <CountdownBanner />
            <OrderSummary />
            <section className="px-4 space-y-3">
              <PaymentHeader />
              <div className="space-y-2.5">
                <Suspense fallback={<MobilePaymentOptionsSkeleton />}>
                  <PaymentMethodsSection paymentMethodsPromise={paymentMethodsPromise} />
                </Suspense>
              </div>
            </section>
            <SecureBadge />
            <TermsNote />
          </main>
          <BottomBar />
        </div>
      </div>

      <div className="hidden md:block">
        <DesktopPaymentContent
          slots={
            <Suspense fallback={<DesktopPaymentOptionsSkeleton />}>
              <PaymentMethodsSection paymentMethodsPromise={paymentMethodsPromise} />
            </Suspense>
          }
        />
      </div>
    </RequireDraft>
  );
}
