import SeatsPageSkeleton from "./components/shared/SeatSkeletons";

/**
 * Route fallback during navigation — the same composition the page streams into,
 * so the navigation skeleton and the in-page boundary cannot drift apart.
 */
export default function SeatsLoading() {
  return <SeatsPageSkeleton />;
}
