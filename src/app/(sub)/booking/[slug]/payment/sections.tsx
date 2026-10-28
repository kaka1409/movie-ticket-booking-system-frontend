import SectionFallback from "@/components/ui/SectionFallback";
import PaymentDefaultAdopt from "@/features/booking/components/PaymentDefaultAdopt";
import { getPaymentCatalog } from "@/features/booking/payment";
import PaymentOption from "./components/mobile/PaymentOption";

type PaymentSectionProps = { locale: "en" | "vn" };

/**
 * The gateway picker. The step chrome (summary, badges, terms, CTA) is static
 * and paints first; only the catalog rows stream, in each tree's own boundary.
 */
export async function PaymentMethodsSection({ locale }: PaymentSectionProps) {
  const { methods, demo, error, isUnauthorized } = await getPaymentCatalog(locale);

  if (isUnauthorized) return null;
  if (error) return <SectionFallback error={error} />;

  return (
    <>
      {methods.map((method) => (
        <PaymentOption key={method.id} method={method} isDemo={demo} />
      ))}
    </>
  );
}

/**
 * Effect-only: preselects the single sellable gateway once the catalog lands.
 * Mounted at page level in a `fallback={null}` boundary so it never holds the
 * picker back.
 */
export async function PaymentDefaultAdoptSection({ locale }: PaymentSectionProps) {
  const { methods, error } = await getPaymentCatalog(locale);

  if (error) return null;

  return <PaymentDefaultAdopt methods={methods} />;
}
