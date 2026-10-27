import type { Metadata, Viewport } from "next";
import "@/styles/admin-theme.css";
import AdminLayout from "@/layouts/AdminLayout";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { hasSession } from "@/libs/session";
import { getAdminSidebarMode, getAdminTheme } from "@/features/admin/preferences";

// The console renders live admin data with the visitor's refresh cookie, so
// nothing here may be prerendered or cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: { default: "Admin Console", template: "%s · Admin | PrimeSeat" },
  robots: { index: false, follow: false },
};

export async function generateViewport(): Promise<Viewport> {
  const theme = await getAdminTheme();
  if (theme === "light") return { themeColor: "#f6f6f4" };
  if (theme === "system") {
    return {
      themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f6f6f4" },
        { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
      ],
    };
  }
  return { themeColor: "#0f0f0f" };
}

export default async function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  // Same gate as `(sub)`: the cookie check decides which DOM is committed. A
  // present-but-revoked cookie still passes and is caught client-side by
  // `AdminLayout`, which renders the prompt/403 panel in place — never a
  // redirect, so the URL the admin opened survives.
  const [isAuthed, theme, sidebarMode] = await Promise.all([
    hasSession(),
    getAdminTheme(),
    getAdminSidebarMode(),
  ]);

  if (!isAuthed) {
    return (
      <div
        data-admin-theme={theme}
        className="min-h-dvh bg-(--color-bg) text-(--color-text-primary)"
      >
        <LoginPrompt />
      </div>
    );
  }

  return (
    <AdminLayout initialTheme={theme} initialSidebarMode={sidebarMode}>
      {children}
    </AdminLayout>
  );
}
