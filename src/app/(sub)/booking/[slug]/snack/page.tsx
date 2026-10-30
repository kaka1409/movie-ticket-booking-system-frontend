import { Suspense } from "react";
import { getRequestLocale } from "@/libs/session";
import { getCombos, getFoodCategories, getFoodItems } from "@/features/booking/api";

import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";
import SnackHeader from "./components/shared/SnackHeader";
import BottomBar from "./components/mobile/BottomBar";
import DesktopSnackContent from "./components/desktop/SnackContent";
import {
  DesktopSnackCombosSkeleton,
  DesktopSnackFoodSkeleton,
  MobileSnackCombosSkeleton,
  MobileSnackFoodSkeleton,
} from "./components/shared/SnackSkeletons";
import { SnackCombosSection, SnackFoodSection } from "./sections";

/** Streams the independent catalog feeds after the booking chrome has rendered. */
export default async function CombosPage() {
  const locale = await getRequestLocale();
  const combosPromise = getCombos(locale);
  const foodItemsPromise = getFoodItems(locale);
  const foodCategoriesPromise = getFoodCategories(locale);

  return (
    <>
      <div className="block md:hidden">
        <StepBar current={3} />
        <main className="space-y-5 pt-1 pb-10">
          <CountdownBanner />
          <SnackHeader />
          <Suspense fallback={<MobileSnackCombosSkeleton />}>
            <SnackCombosSection combosPromise={combosPromise} variant="mobile" />
          </Suspense>
          <Suspense fallback={<MobileSnackFoodSkeleton />}>
            <SnackFoodSection
              foodItemsPromise={foodItemsPromise}
              foodCategoriesPromise={foodCategoriesPromise}
            />
          </Suspense>
        </main>
        <BottomBar />
      </div>

      <div className="hidden md:block">
        <DesktopSnackContent
          slots={
            <>
              <Suspense fallback={<DesktopSnackCombosSkeleton />}>
                <SnackCombosSection combosPromise={combosPromise} variant="desktop" />
              </Suspense>
              <Suspense fallback={<DesktopSnackFoodSkeleton />}>
                <SnackFoodSection
                  foodItemsPromise={foodItemsPromise}
                  foodCategoriesPromise={foodCategoriesPromise}
                />
              </Suspense>
            </>
          }
        />
      </div>
    </>
  );
}
