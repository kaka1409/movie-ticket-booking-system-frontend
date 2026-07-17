import { getCombos, getFoodItems, getFoodCategories } from "@/features/booking/api";
import { SnackSelectionProvider } from "@/features/booking/contexts/SnackSelectionContext";

// Shared
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";

// Local mobile
import ComboCard from "./components/mobile/ComboCard";
import CategorySection from "./components/mobile/CategorySection";
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

          <div className="px-4 pt-1">
            <h2 className="font-extrabold text-2xl text-(--color-text-primary) mb-1">
              Grab a Snack
            </h2>
            <p className="text-sm text-(--color-text-muted)">
              Add combos or pick your favourites — totally optional.
            </p>
          </div>

          {/* Quick Combos */}
          <div className="space-y-3">
            <h3 className="px-4 text-xs font-bold tracking-widest uppercase text-(--color-gold-dark)">
              Quick Combos
            </h3>
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
