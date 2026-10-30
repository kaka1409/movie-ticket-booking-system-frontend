import SectionFallback from "@/components/ui/SectionFallback";
import PaymentDefaultAdopt from "@/app/(sub)/booking/components/adopters/PaymentDefaultAdopter";
import type { getPaymentMethods } from "@/features/booking/api";
import PaymentOption from "./components/mobile/PaymentOption";

type PaymentSectionProps = {
  paymentMethodsPromise: ReturnType<typeof getPaymentMethods>;
};

/**
 * The gateway picker. The step chrome (summary, badges, terms, CTA) is static
 * and paints first; only the catalog rows stream, in each tree's own boundary.
 */
export async function PaymentMethodsSection({ paymentMethodsPromise }: PaymentSectionProps) {
  const result = await paymentMethodsPromise;

  if ("error" in result) {
    if (result.error.status === 401) return null;
    return <SectionFallback error={result.error} />;
  }

  return (
    <>
      {result.data.methods.map((method) => (
        <PaymentOption key={method.id} method={method} isDemo={result.data.demo} />
      ))}
    </>
  );
}

/**
 * Effect-only: preselects the single sellable gateway once the catalog lands.
 * Mounted at page level in a `fallback={null}` boundary so it never holds the
 * picker back.
 */
export async function PaymentDefaultAdoptSection({ paymentMethodsPromise }: PaymentSectionProps) {
  const result = await paymentMethodsPromise;

  if ("error" in result) return null;

  return <PaymentDefaultAdopt methods={result.data.methods} />;
}
