"use client";

import { Star } from "lucide-react";
import type { User } from "@/features/profile/types";

export default function UserInfo({ user }: { user: User }) {
  return (
    <div className="flex flex-col items-center mt-5">
      <h1 className="font-extrabold text-2xl text-(--color-text-primary)">
        {user.name}
      </h1>

      {/* Tier badge */}
      <span className="mt-2.5 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase bg-(--color-gold)/12 text-(--color-gold) border border-(--color-gold)/35">
        <Star size={12} className="fill-current" />
        {user.tier}
      </span>
    </div>
  );
}
