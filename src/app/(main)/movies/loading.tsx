import MoviesPageSkeleton from "./components/MoviesSkeletons";

/**
 * Route fallback during navigation. Same composition the page streams into, so
 * the navigation skeleton and the in-page boundary can never drift apart.
 */
export default function MoviesLoading() {
  return <MoviesPageSkeleton />;
}
