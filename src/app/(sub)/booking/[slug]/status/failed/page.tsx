import { Suspense } from "react";
import { getAllMovies } from "@/features/movies/api";
import { StatusProvider } from "@/features/booking/contexts/StatusContext";

// Mobile components
import FailedIcon from "./components/mobile/FailedIcon";
import FailedOrderCard from "./components/mobile/FailedOrderCard";
import FailActions from "./components/mobile/FailActions";

// Desktop components
import DesktopFailContent from "./components/desktop/FailContent";

export default async function FailPage() {
  const allMovies = await getAllMovies();

  return (
    <Suspense>
      {/* Mobile */}
      <div className="block md:hidden">
        <StatusProvider allMovies={allMovies}>
          <FailPageMobile />
        </StatusProvider>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopFailContent />
      </div>
    </Suspense>
  );
}

function FailPageMobile() {
  return (
    <>
      {/* Shake keyframe injection */}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-6px) rotate(-2deg); }
          40%      { transform: translateX(6px)  rotate(2deg);  }
          60%      { transform: translateX(-4px) rotate(-1deg); }
          80%      { transform: translateX(4px)  rotate(1deg);  }
        }
      `}</style>

      <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto pb-8 pt-10 space-y-6">
          {/* Error hero */}
          <FailedIcon />

          {/* Failed order card */}
          <FailedOrderCard />

          {/* Action buttons */}
          <FailActions />
        </main>
      </div>
    </>
  );
}
