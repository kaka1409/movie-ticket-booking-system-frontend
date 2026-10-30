import { MobileInboxSkeleton, DesktopInboxSkeleton } from "@/app/(sub)/notifications/components/shared/NotificationSkeletons";

export default function NotificationLoading() {
  return (
    <>
      <MobileInboxSkeleton />
      <DesktopInboxSkeleton />
    </>
  );
}