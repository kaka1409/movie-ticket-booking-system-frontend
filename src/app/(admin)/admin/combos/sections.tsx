import AdminDataError from "@/features/admin/components/AdminDataError";
import { getAdminCombos } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import CombosManager from "./components/CombosManager";

/** Combo list behind the page's static header; 401 renders nothing. */
export async function CombosManagerSection() {
  const result = await getAdminCombos();

  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;

  return <CombosManager combos={result.data} />;
}
