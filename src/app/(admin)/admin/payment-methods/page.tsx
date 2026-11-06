import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminListSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
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
      <Suspense fallback={<AdminListSkeleton search={false} total={false} action={false} pager={false} columns={5} />}>
        <PaymentMethodsManagerSection />
      </Suspense>
    </>
  );
}
