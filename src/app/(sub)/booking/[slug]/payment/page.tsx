import { notFound } from "next/navigation";
import { getMovieBySlug } from "@/features/movies/api";
import { PaymentProvider } from "@/features/booking/contexts/PaymentContext";

// Mobile components
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";
import OrderSummary from "./components/mobile/OrderSummary";
import PaymentOption from "./components/mobile/PaymentOption";
import { PAYMENT_METHODS } from "@/features/booking/mock";
import SecureBadge from "./components/mobile/SecureBadge";
import TermsNote from "./components/mobile/TermsNote";
import BottomBar from "./components/mobile/BottomBar";

// Desktop components
import DesktopPaymentContent from "./components/desktop/PaymentContent";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <PaymentProvider>
          <div className="flex flex-col min-h-dvh">
            <StepBar current={5} />
            <main className="flex-1 overflow-y-auto pb-5 pt-1 space-y-5">
              <CountdownBanner />
              <OrderSummary movie={movie} />
              <section className="px-4 space-y-3">
                <h2 className="font-bold text-lg text-(--color-text-primary)">
                  Select Payment Method
                </h2>
                <div className="space-y-2.5">
                  {PAYMENT_METHODS.map((m) => (
                    <PaymentOption key={m.id} method={m} />
                  ))}
                </div>
              </section>
              <SecureBadge />
              <TermsNote />
              <div className="flex items-center justify-center gap-2 pb-2">
                <span className="text-xs text-(--color-text-muted)">
                  E-ticket will be sent to your email after payment.
                </span>
              </div>
            </main>
            <BottomBar />
          </div>
        </PaymentProvider>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopPaymentContent />
      </div>
    </>
  );
}
