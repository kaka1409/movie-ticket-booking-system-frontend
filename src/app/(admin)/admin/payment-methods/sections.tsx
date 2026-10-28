import AdminDataError from "@/features/admin/components/AdminDataError";
import { getAdminPaymentMethods } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import PaymentMethodsManager from "./components/PaymentMethodsManager";

/** Gateway catalog behind the page's static header; 401 renders nothing. */
export async function PaymentMethodsManagerSection() {
  const result = await getAdminPaymentMethods();

  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;

  return <PaymentMethodsManager methods={result.data} />;
}
