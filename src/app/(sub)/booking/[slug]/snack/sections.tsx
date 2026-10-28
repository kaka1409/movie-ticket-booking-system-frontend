import SectionFallback from "@/components/ui/SectionFallback";
import { getSnackCatalog } from "@/features/booking/snack";
import CategorySection from "./components/mobile/CategorySection";
import ComboCard from "./components/mobile/ComboCard";
import SnackSectionHeading from "./components/mobile/SnackSectionHeading";

type SnackCatalogSectionProps = {
  locale: "en" | "vn";
  /** Both trees share these blocks; only the container classes differ. */
  variant: "mobile" | "desktop";
};

/**
 * Combos + pick-and-mix categories. The step chrome (header, rail, bar) paints
 * first and this lands as one block: the three catalog reads go out together, so
 * splitting the block would only add a second skeleton, not a second stream.
 */
export async function SnackCatalogSection({ locale, variant }: SnackCatalogSectionProps) {
  const { combos, foodItems, foodCategories, error, isUnauthorized } =
    await getSnackCatalog(locale);

  if (isUnauthorized) return null;
  if (error) return <SectionFallback error={error} />;

  const isDesktop = variant === "desktop";

  return (
    <>
      <section className="space-y-4">
        <SnackSectionHeading sectionKey="booking.snack.quick_combos" />
        <div className={isDesktop ? "grid gap-4 xl:grid-cols-2" : "space-y-3"}>
          {combos.map((item) => (
            <ComboCard key={item.id} item={item} className={isDesktop ? "" : "mx-4"} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {foodCategories.map((category) => (
          <CategorySection
            key={category.id}
            label={category.label}
            items={foodItems.filter((food) => food.category === category.id)}
          />
        ))}
      </section>
    </>
  );
}
