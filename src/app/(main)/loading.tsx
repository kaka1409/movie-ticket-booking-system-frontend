import { HomePageSkeleton } from "./home/components/shared/HomeSkeletons";

/**
 * Group-level fallback: only `/` renders here (`page.tsx` re-exports the home
 * route), so it reuses the home skeleton — including the desktop tree.
 */
export default function MainLoading() {
  return <HomePageSkeleton />;
}
