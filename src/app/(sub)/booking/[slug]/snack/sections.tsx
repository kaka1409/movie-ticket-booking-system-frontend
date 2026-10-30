import SectionFallback from "@/components/ui/SectionFallback";
import type { getCombos, getFoodCategories, getFoodItems } from "@/features/booking/api";
import CategorySection from "./components/mobile/CategorySection";
import ComboCard from "./components/mobile/ComboCard";
import SnackSectionHeading from "./components/mobile/SnackSectionHeading";

type SnackCombosSectionProps = {
  combosPromise: ReturnType<typeof getCombos>;
  variant: "mobile" | "desktop";
};

type SnackFoodSectionProps = {
  foodItemsPromise: ReturnType<typeof getFoodItems>;
  foodCategoriesPromise: ReturnType<typeof getFoodCategories>;
};

/** Streams combos independently from the pick-and-mix catalog. */
export async function SnackCombosSection({
  combosPromise,
  variant,
}: SnackCombosSectionProps) {
  const result = await combosPromise;

  if ("error" in result) {
    if (result.error.status === 401) return null;
    return <SectionFallback error={result.error} />;
  }

  const isDesktop = variant === "desktop";
  return (
    <section className="space-y-4">
      <SnackSectionHeading sectionKey="booking.snack.quick_combos" />
      <div className={isDesktop ? "grid gap-4 xl:grid-cols-2" : "space-y-3"}>
        {result.data.map((item) => (
          <ComboCard key={item.id} item={item} className={isDesktop ? "" : "mx-4"} />
        ))}
      </div>
    </section>
  );
}

/** Streams foods and their category labels as one dependent display section. */
export async function SnackFoodSection({
  foodItemsPromise,
  foodCategoriesPromise,
}: SnackFoodSectionProps) {
  const [foodItemsResult, foodCategoriesResult] = await Promise.all([
    foodItemsPromise,
    foodCategoriesPromise,
  ]);

  if ("error" in foodItemsResult) {
    if (foodItemsResult.error.status === 401) return null;
    return <SectionFallback error={foodItemsResult.error} />;
  }
  if ("error" in foodCategoriesResult) {
    if (foodCategoriesResult.error.status === 401) return null;
    return <SectionFallback error={foodCategoriesResult.error} />;
  }

  return (
    <section className="space-y-4">
      {foodCategoriesResult.data.map((category) => (
        <CategorySection
          key={category.id}
          label={category.label}
          items={foodItemsResult.data.filter((food) => food.category === category.id)}
        />
      ))}
    </section>
  );
}
