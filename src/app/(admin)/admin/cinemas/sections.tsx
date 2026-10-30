import AdminDataError from "@/app/(admin)/admin/components/shared/AdminDataError";
import { getAdminCinemas } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import CinemasManager from "./components/CinemasManager";

/** Cinema + room tree behind the page's static header; 401 renders nothing. */
export async function CinemasManagerSection() {
  const result = await getAdminCinemas();

  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;

  return <CinemasManager cinemas={result.data} />;
}
