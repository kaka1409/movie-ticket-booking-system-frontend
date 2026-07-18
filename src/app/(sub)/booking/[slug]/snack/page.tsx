import { getCombos, getFoodItems, getFoodCategories } from "@/features/booking/api";
import { SnackSelectionProvider } from "@/features/booking/contexts/SnackSelectionContext";

// Shared
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";

// Local mobile
import ComboCard from "./components/mobile/ComboCard";
import CategorySection from "./components/mobile/CategorySection";
import SnackHeader from "./components/mobile/SnackHeader";
import SnackSectionHeading from "./components/mobile/SnackSectionHeading";
import BottomBar from "./components/mobile/BottomBar";

// Desktop
import DesktopSnackContent from "./components/desktop/SnackContent";

export default async function CombosPage() {
  const [combos, foodItems, foodCategories] = await Promise.all([
    getCombos(),
    getFoodItems(),
    getFoodCategories(),
  ]);

  return (
    <SnackSelectionProvider
      combos={combos}
      foodItems={foodItems}
      foodCategories={foodCategories}
    >
      {/* Mobile */}
      <div className="block md:hidden">
        <StepBar current={3} />
        <main className="space-y-5 pt-1 pb-10">
          <CountdownBanner />

          <SnackHeader />

          {/* Quick Combos */}
          <div className="space-y-3">
            <SnackSectionHeading sectionKey="booking.snack.quick_combos" />
            <div className="space-y-3">
              {combos.map((item) => (
                <ComboCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Pick & Mix */}
          <div className="space-y-4">
            {foodCategories.map((category) => (
              <CategorySection
                key={category.id}
                label={category.label}
                items={foodItems.filter((food) => food.category === category.id)}
              />
            ))}
          </div>
        </main>
        <BottomBar />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopSnackContent />
      </div>
    </SnackSelectionProvider>
  );
}
