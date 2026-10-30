import CinemaPageSkeleton from "./components/shared/CinemaSkeletons";

/**
 * Route fallback during navigation — the same composition the page streams into,
 * so the navigation skeleton and the in-page boundary cannot drift apart.
 */
export default function CinemaLoading() {
  return <CinemaPageSkeleton />;
}
