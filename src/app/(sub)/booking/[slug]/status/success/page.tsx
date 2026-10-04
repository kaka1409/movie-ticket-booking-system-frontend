import { Suspense } from "react";
import { getMovieBySlug } from "@/features/movies/api";
import { StatusProvider } from "@/features/booking/contexts/StatusContext";

// Mobile components
import SuccessIcon from "./components/mobile/SuccessIcon";
import TicketCard from "./components/mobile/TicketCard";
import SuccessActions from "./components/mobile/SuccessActions";

// Desktop components
import DesktopSuccessContent from "./components/desktop/SuccessContent";

export default async function SuccessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  return (
    <Suspense>
      {/* Mobile */}
      <div className="block md:hidden">
        <StatusProvider movie={movie}>
          <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
            {/* Scrollable body */}
            <main className="flex-1 overflow-y-auto pb-8 pt-4 space-y-6">
              <SuccessIcon />
              <TicketCard />
              <SuccessActions />
            </main>
          </div>
        </StatusProvider>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopSuccessContent />
      </div>
    </Suspense>
  );
}
