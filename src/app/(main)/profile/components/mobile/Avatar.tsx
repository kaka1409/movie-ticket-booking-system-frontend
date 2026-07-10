"use client";

import Image from "next/image";
import { USER } from "@/features/profile/mock";

export default function Avatar() {
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
          src={USER.avatarUrl}
          alt={USER.name}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
