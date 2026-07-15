import { notFound } from "next/navigation";
import { getMovieBySlug } from "@/features/movies/api";
import { CredentialsProvider } from "./components/mobile/CredentialsContext";

// Mobile components
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";
import ContactForm from "./components/mobile/ContactForm";
import OrderSummary from "./components/mobile/OrderSummary";
import BottomBar from "./components/mobile/BottomBar";

// Desktop components
import DesktopCredentialsContent from "./components/desktop/CredentialsContent";

export default async function CredentialsPage({
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
        <CredentialsProvider>
          <div className="flex flex-col min-h-dvh">
            <StepBar current={4} />
            <main className="flex-1 overflow-y-auto pb-5 pt-1 space-y-6">
              <CountdownBanner />
              <ContactForm />
              <OrderSummary movie={movie} />
            </main>
            <BottomBar />
          </div>
        </CredentialsProvider>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopCredentialsContent />
      </div>
    </>
  );
}
