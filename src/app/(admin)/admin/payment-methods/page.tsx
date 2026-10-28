import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import { AdminTableSkeleton } from "@/features/admin/components/AdminSkeletons";
import { PaymentMethodsManagerSection } from "./sections";

export const metadata: Metadata = { title: "Payment methods" };

export default function AdminPaymentMethodsPage() {
  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.transactions"
        titleKey="admin.paymentMethods.title"
        descriptionKey="admin.paymentMethods.description"
      />
      <Suspense fallback={<AdminTableSkeleton />}>
        <PaymentMethodsManagerSection />
      </Suspense>
    </>
  );
}
