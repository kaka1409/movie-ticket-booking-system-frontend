import { Suspense } from "react";
import { getAllMovies } from "@/features/movies/api";
import { StatusProvider } from "@/features/booking/contexts/StatusContext";

// Mobile components
import SuccessPageMobile from "./components/mobile/SuccessPageMobile";

// Desktop components
import DesktopSuccessContent from "./components/desktop/SuccessContent";

export default async function SuccessPage() {
  const allMovies = await getAllMovies();

  return (
    <Suspense>
      {/* Mobile */}
      <div className="block md:hidden">
        <StatusProvider allMovies={allMovies}>
          <SuccessPageMobile />
        </StatusProvider>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopSuccessContent />
      </div>
    </Suspense>
  );
}
