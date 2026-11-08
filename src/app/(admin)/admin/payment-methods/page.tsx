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
      <Suspense fallback={<AdminListSkeleton filtersCard filterCardStyle="chips" columns={5} pager={false} />}>
        <PaymentMethodsManagerSection />
      </Suspense>
    </>
  );
}
