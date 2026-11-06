import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { CinemasManagerSection } from "./sections";

export const metadata: Metadata = { title: "Cinemas" };

import CinemasSkeleton from "../components/skeletons/CinemasSkeleton";
export default function AdminCinemasPage() {
  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.cinema"
        titleKey="admin.cinemas.title"
        descriptionKey="admin.cinemas.description"
      />
      <Suspense fallback={<CinemasSkeleton />}>
        <CinemasManagerSection />
      </Suspense>
    </>
  );
}
