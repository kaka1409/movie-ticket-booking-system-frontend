import { Suspense } from "react";
import { getRequestLocale } from "@/libs/session";

// Shared
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";

// Local mobile
import SnackHeader from "./components/mobile/SnackHeader";
import BottomBar from "./components/mobile/BottomBar";

// Desktop
import DesktopSnackContent from "./components/desktop/SnackContent";

import {
  DesktopSnackCatalogSkeleton,
  MobileSnackCatalogSkeleton,
} from "./components/SnackSkeletons";
import { SnackCatalogSection } from "./sections";

/**
 * Snack step, streamed: the page awaits the locale only — the headers, the
 * countdown and both bottom surfaces paint immediately, and the catalog lands in
 * each tree's own boundary. Both boundaries read one memoized `getSnackCatalog`,
 * so the two skins cost a single round trip.
 */
export default async function CombosPage() {
  const locale = await getRequestLocale();

  return (
    <>
      <div className="block md:hidden">
        <StepBar current={3} />
        <main className="space-y-5 pt-1 pb-10">
          <CountdownBanner />
          <SnackHeader />
          <Suspense fallback={<MobileSnackCatalogSkeleton />}>
            <SnackCatalogSection locale={locale} variant="mobile" />
          </Suspense>
        </main>
        <BottomBar />
      </div>

      <div className="hidden md:block">
        <DesktopSnackContent
          slots={
            <Suspense fallback={<DesktopSnackCatalogSkeleton />}>
              <SnackCatalogSection locale={locale} variant="desktop" />
            </Suspense>
          }
        />
      </div>
    </>
  );
}
