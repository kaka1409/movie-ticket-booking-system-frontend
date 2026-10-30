import { HomePageSkeleton } from "./components/shared/HomeSkeletons";

/** Route-entry fallback — same composition as the page's per-section fallbacks. */
export default function HomeLoading() {
  return <HomePageSkeleton />;
}
