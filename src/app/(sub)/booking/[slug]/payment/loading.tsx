import PaymentPageSkeleton from "./components/shared/PaymentSkeletons";

/**
 * Route fallback during navigation — the same composition the page streams into,
 * so the navigation skeleton and the in-page boundary cannot drift apart.
 */
export default function PaymentLoading() {
  return <PaymentPageSkeleton />;
}
