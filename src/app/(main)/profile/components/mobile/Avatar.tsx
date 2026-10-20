"use client";

import { useAuth } from "@/contexts/AuthContext";
import AvatarRing from "@/components/ui/AvatarRing";

export default function ProfileAvatar() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="flex justify-center">
      <AvatarRing src={user.avatarUrl} name={user.name} size="h-28 w-28" />
    </div>
  );
}
