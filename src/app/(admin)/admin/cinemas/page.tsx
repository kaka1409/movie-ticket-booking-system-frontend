import type { Metadata } from "next";
import LoginPrompt from "@/components/shared/LoginPrompt";
import AdminDataError from "@/features/admin/components/AdminDataError";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import { getAdminCinemas } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import CinemasManager from "./components/CinemasManager";

export const metadata: Metadata = { title: "Cinemas" };

export default async function AdminCinemasPage() {
  const result = await getAdminCinemas();

  if (isUnauthorizedResult(result)) return <LoginPrompt />;

  const header = (
    <AdminPageHeader
      eyebrowKey="admin.nav.cinema"
      titleKey="admin.cinemas.title"
      descriptionKey="admin.cinemas.description"
    />
  );

  if ("error" in result) {
    return (
      <>
        {header}
        <AdminDataError message={result.error.message} />
      </>
    );
  }

  return (
    <>
      {header}
      <CinemasManager cinemas={result.data} />
    </>
  );
}
