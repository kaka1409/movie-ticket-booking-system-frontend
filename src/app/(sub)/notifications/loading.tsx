import { MobileInboxSkeleton, DesktopInboxSkeleton } from "@/features/notifications/components/NotificationSkeletons";

export default function NotificationLoading() {
  return (
    <>
      <MobileInboxSkeleton />
      <DesktopInboxSkeleton />
    </>
  );
}