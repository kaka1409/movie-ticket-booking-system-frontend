import { AdminListSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";

export default function Loading() {
  return <AdminListSkeleton search select apply total action columns={6} />;
}
