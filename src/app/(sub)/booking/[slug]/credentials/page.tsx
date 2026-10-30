import RequireDraft from "@/app/(sub)/booking/components/shared/RequireDraft";

// Mobile components
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";
import ContactForm from "./components/shared/ContactForm";
import OrderSummary from "@/app/(sub)/booking/components/shared/OrderSummary";
import BottomBar from "./components/mobile/BottomBar";

// Desktop components
import DesktopCredentialsContent from "./components/desktop/CredentialsContent";

export default async function CredentialsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <RequireDraft slug={slug}>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <StepBar current={4} />
          <main className="flex-1 overflow-y-auto pb-5 pt-1 space-y-6">
            <CountdownBanner />
            <ContactForm />
            <OrderSummary />
          </main>
          <BottomBar />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopCredentialsContent slug={slug} />
      </div>
    </RequireDraft>
  );
}
