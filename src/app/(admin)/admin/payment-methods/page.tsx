import type { Metadata } from "next";
import LoginPrompt from "@/components/shared/LoginPrompt";
import AdminDataError from "@/features/admin/components/AdminDataError";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import { getAdminPaymentMethods } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import PaymentMethodsManager from "./components/PaymentMethodsManager";

export const metadata: Metadata = { title: "Payment methods" };

export default async function AdminPaymentMethodsPage() {
  const result = await getAdminPaymentMethods();

  if (isUnauthorizedResult(result)) return <LoginPrompt />;

  const header = (
    <AdminPageHeader
      eyebrowKey="admin.nav.transactions"
      titleKey="admin.paymentMethods.title"
      descriptionKey="admin.paymentMethods.description"
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
      <PaymentMethodsManager methods={result.data} />
    </>
  );
}
