import type { Metadata } from "next";
import LoginPrompt from "@/components/shared/LoginPrompt";
import AdminDataError from "@/features/admin/components/AdminDataError";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import { getAdminCombos } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import CombosManager from "./components/CombosManager";

export const metadata: Metadata = { title: "Combos" };

export default async function AdminCombosPage() {
  const result = await getAdminCombos();

  if (isUnauthorizedResult(result)) return <LoginPrompt />;

  const header = (
    <AdminPageHeader
      eyebrowKey="admin.nav.food"
      titleKey="admin.combos.title"
      descriptionKey="admin.combos.description"
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
      <CombosManager combos={result.data} />
    </>
  );
}
