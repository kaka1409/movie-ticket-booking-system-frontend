import type { Metadata } from "next";
import LayoutProvider from "@/layouts/LayoutProvider";

// Auth pages are disallowed in robots.txt; the meta noindex is the
// belt-and-suspenders for any crawler that reaches them anyway.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <LayoutProvider layout="auth">{children}</LayoutProvider>;
}
