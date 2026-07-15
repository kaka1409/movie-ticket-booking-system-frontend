"use client";

import Image from "next/image";
import type { User } from "@/features/profile/types";

export default function Avatar({ user }: { user: User }) {
  return (
    <div className="relative w-28 h-28">
      {/* Conic gradient ring */}
      <div
        className="absolute inset-0 rounded-full p-[3px]"
        style={{
          background:
            "conic-gradient(var(--color-gold) 0%, var(--color-gold-dark) 50%, var(--color-gold-light) 100%)",
        }}
      >
        <div className="w-full h-full rounded-full bg-(--color-bg)" />
      </div>

      {/* Avatar circle */}
      <div className="absolute inset-[3px] rounded-full overflow-hidden bg-(--color-surface-2)">
        <Image
          src={user.avatarUrl}
          alt={user.name}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
