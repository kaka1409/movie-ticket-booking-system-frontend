import LayoutProvider from "@/layouts/LayoutProvider";

/**
 * No `cookies()` and no data fetch here on purpose: the notification badge
 * loads client-side in the mobile header, so `/` and `/home` can be
 * statically generated (ISR — see the `revalidate` export on the pages).
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <LayoutProvider layout="main">{children}</LayoutProvider>;
}
