import type { Metadata } from "next";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import { getAdminTheme } from "@/features/admin/preferences";
import SettingsPanel from "./components/SettingsPanel";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const theme = await getAdminTheme();
  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.system"
        titleKey="admin.settings.title"
        descriptionKey="admin.settings.description"
      />
      <SettingsPanel initialTheme={theme} />
    </>
  );
}
