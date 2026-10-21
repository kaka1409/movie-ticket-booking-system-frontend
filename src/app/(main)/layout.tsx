import LayoutProvider from "@/layouts/LayoutProvider";

/**
 * Group chrome only. Locale, device and the SSR inbox seed are resolved in the
 * root layout (cookie + header reads), so every route here renders per request.
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <LayoutProvider layout="main">{children}</LayoutProvider>;
}
