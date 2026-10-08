import LayoutProvider from "@/layouts/LayoutProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { hasSession } from "@/libs/session";
import type { Metadata } from "next";

// Every route in this group is user-specific (booking, tickets, profile,
// notifications) — never let search engines index it.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SubLayout({ children }: { children: React.ReactNode }) {
  // Swaps the DOM output only — Next 16 still executes the child page segment
  // server-side (orphan flight rows, never committed to the DOM; see AGENTS
  // "Protected Route Guards"). The page-level gates in (main)/tickets and
  // (main)/profile block their fetches outright.
  const isAuthed = await hasSession();

  return (
    <LayoutProvider layout="sub">
      {isAuthed ? <ProtectedRoute>{children}</ProtectedRoute> : <LoginPrompt />}
    </LayoutProvider>
  );
}
