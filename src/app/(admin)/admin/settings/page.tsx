import type { Metadata } from "next";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { getAdminTheme } from "@/features/admin/utils/preferences";
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
