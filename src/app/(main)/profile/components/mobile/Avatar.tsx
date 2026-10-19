"use client";

import { useAuth } from "@/contexts/AuthContext";
import Avatar, { DEFAULT_AVATAR_SRC } from "@/components/ui/Avatar";

export default function ProfileAvatar() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="relative h-28 w-28">
      {/* Conic gradient ring */}
      <div
        className="absolute inset-0 rounded-full p-[3px]"
        style={{
          background:
            "conic-gradient(var(--color-gold) 0%, var(--color-gold-dark) 50%, var(--color-gold-light) 100%)",
        }}
      >
        <div className="h-full w-full rounded-full bg-(--color-bg)" />
      </div>

      {/* Avatar circle — brand portrait when the member has no picture */}
      <div className="absolute inset-[3px]">
        <Avatar
          src={user.avatarUrl}
          fallbackSrc={DEFAULT_AVATAR_SRC}
          name={user.name}
          size="h-full w-full"
          className="border-0"
        />
      </div>
    </div>
  );
}
