import { SkeletonBar, SkeletonCard, SurfaceSkeleton } from "@/components/ui/Skeleton";
import BookingSkeleton from "@/app/(sub)/booking/components/mobile/BookingSkeleton";
import BookingPanelSkeleton from "@/app/(sub)/booking/components/desktop/BookingPanelSkeleton";
import { SelectionRailSkeleton } from "@/app/(sub)/booking/components/desktop/RailSkeleton";

/**
 * Fallbacks for the snack step: one combo card (28-unit art tile + name/price
 * bars) and the pick-and-mix rows, matching `ComboCard` / `FoodItemCard` so the
 * catalog never shifts the page when it lands.
 */
function ComboCardSkeleton({ raised }: { raised: boolean }) {
  return (
    <SkeletonCard className="overflow-hidden p-0">
      <div className="flex">
        <SurfaceSkeleton raised={raised} className="h-28 w-28 shrink-0 rounded-none" />
        <div className="flex flex-1 flex-col justify-between gap-3 p-3.5">
          <div className="space-y-2">
            <SurfaceSkeleton raised={raised} className="h-4 w-2/3 rounded-full" />
            <SurfaceSkeleton raised={raised} className="h-2.5 w-full rounded-full" />
            <SurfaceSkeleton raised={raised} className="h-2.5 w-1/2 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <SurfaceSkeleton raised={raised} className="h-5 w-20 rounded-md" />
            <SurfaceSkeleton raised={raised} className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </SkeletonCard>
  );
}

function FoodRowSkeleton({ raised }: { raised: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <SurfaceSkeleton raised={raised} className="h-10 w-10 shrink-0 rounded-md" />
      <div className="flex-1 space-y-2">
        <SurfaceSkeleton raised={raised} className="h-3.5 w-2/3 rounded-full" />
        <SurfaceSkeleton raised={raised} className="h-2.5 w-1/3 rounded-full" />
      </div>
      <SurfaceSkeleton raised={raised} className="h-8 w-20 shrink-0 rounded-full" />
    </div>
  );
}

function SnackCatalogSkeleton({
  raised,
  comboClassName,
  combosClassName,
}: {
  raised: boolean;
  comboClassName: string;
  combosClassName: string;
}) {
  return (
    <>
      <div className="space-y-3">
        <SurfaceSkeleton raised={raised} className="mx-4 h-2.5 w-32 rounded-full" />
        <div className={combosClassName}>
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className={comboClassName}>
              <ComboCardSkeleton raised={raised} />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, groupIndex) => (
          <div key={groupIndex} className="space-y-2">
            <SurfaceSkeleton raised={raised} className="mx-4 h-2.5 w-28 rounded-full" />
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <FoodRowSkeleton key={rowIndex} raised={raised} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

/** Mobile boundary fallback (the page supplies the surrounding rhythm). */
export function MobileSnackCatalogSkeleton() {
  return <SnackCatalogSkeleton raised={false} comboClassName="mx-4" combosClassName="space-y-3" />;
}

/** Desktop boundary fallback: the same blocks in the step's two-up grid. */
export function DesktopSnackCatalogSkeleton() {
  return (
    <SnackCatalogSkeleton raised comboClassName="" combosClassName="grid gap-4 xl:grid-cols-2" />
  );
}

/** Mobile fallback for the combo feed. */
export function MobileSnackCombosSkeleton() {
  return (
    <div className="space-y-3">
      <SurfaceSkeleton className="mx-4 h-2.5 w-32 rounded-full" />
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="mx-4">
            <ComboCardSkeleton raised={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mobile fallback for the food feed. */
export function MobileSnackFoodSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          <SurfaceSkeleton className="mx-4 h-2.5 w-28 rounded-full" />
          {Array.from({ length: 3 }).map((_, rowIndex) => (
            <FoodRowSkeleton key={rowIndex} raised={false} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Desktop fallback for the combo feed. */
export function DesktopSnackCombosSkeleton() {
  return (
    <div className="space-y-3">
      <SurfaceSkeleton raised className="h-2.5 w-32 rounded-full" />
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <ComboCardSkeleton key={index} raised />
        ))}
      </div>
    </div>
  );
}

/** Desktop fallback for the food feed. */
export function DesktopSnackFoodSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          <SurfaceSkeleton raised className="h-2.5 w-28 rounded-full" />
          {Array.from({ length: 3 }).map((_, rowIndex) => (
            <FoodRowSkeleton key={rowIndex} raised />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Route fallback: the mobile step skeleton plus the desktop panel. */
export default function SnackPageSkeleton() {
  return (
    <>
      <div className="block md:hidden">
        <BookingSkeleton step={3} />
      </div>

      <div className="hidden md:block">
        <BookingPanelSkeleton summary={<SelectionRailSkeleton />}>
          <div className="space-y-8">
            <div className="space-y-1">
              <SkeletonBar className="h-6 w-40 rounded-md" />
              <SkeletonBar className="h-3 w-64 rounded-full" />
            </div>
            <DesktopSnackCatalogSkeleton />
          </div>
        </BookingPanelSkeleton>
      </div>
    </>
  );
}
