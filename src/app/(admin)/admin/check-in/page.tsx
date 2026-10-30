import type { Metadata } from "next";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import CheckinScanner from "./components/CheckinScanner";

export const metadata: Metadata = { title: "Check-in" };

export default function AdminCheckinPage() {
  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.system"
        titleKey="admin.checkin.title"
        descriptionKey="admin.checkin.description"
      />
      <CheckinScanner />
    </>
  );
}
