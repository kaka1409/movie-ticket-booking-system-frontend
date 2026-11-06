import { AdminHeaderSkeleton } from "../components/shared/AdminSkeletons";
import SettingsSkeleton from "../components/skeletons/SettingsSkeleton";

export default function AdminSettingsLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <SettingsSkeleton />
    </>
  );
}
