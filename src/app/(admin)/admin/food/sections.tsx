import AdminDataError from "@/app/(admin)/admin/components/shared/AdminDataError";
import { getAdminFoodItems } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import FoodManager from "./components/FoodManager";

/** Food & beverage list behind the page's static header; 401 renders nothing. */
export async function FoodManagerSection() {
  const result = await getAdminFoodItems();

  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;

  return <FoodManager items={result.data} />;
}
